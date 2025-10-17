import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input';
import { validEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { UserContext } from '../../context/UserContext'
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-toastify';



const SignUp = () => {


  const navigate = useNavigate();


  const [profilePic, setProfilePic] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1) // 1: details, 2: OTP
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)


  const [error, setError] = useState(null)


  const { updateUser } = useContext(UserContext)


  const handleSendOTP = async (e) => {
    e.preventDefault()


    if (!fullName) {
      setError("Enter your full name")
      return
    }
    if (!validEmail(email)) {
      setError("enter valid emailId")
      return
    }
    if (!password) {
      setError("enter password")
      return
    }


    setError("")
    setLoading(true)


    try {
      const response = await axiosInstance.post(API_PATH.AUTH.SEND_OTP, {
        email,
      });


      if (response.data.message === "OTP sent successfully") {
        setOtpSent(true)
        setStep(2)
        toast.success("OTP sent to your email!")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }


  const handleVerifyOTP = async (e) => {
    e.preventDefault()


    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }


    setError("")
    setLoading(true)


    let profileImageUrl = ""


    try {
      // upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic)
        profileImageUrl = imgUploadRes.imageUrl || "";
      }


      const response = await axiosInstance.post(API_PATH.AUTH.VERIFY_OTP, {
        fullName,
        email,
        password,
        profileImageUrl,
        otp,
      });


      const { token, user } = response.data;


      if (token) {
        localStorage.setItem("token", token);
        updateUser(user)
        toast.success("Account created successfully!")
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }


  const handleResendOTP = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.post(API_PATH.AUTH.SEND_OTP, {
        email,
      });
      toast.success("OTP resent to your email!")
    } catch (error) {
      toast.error("Failed to resend OTP")
    } finally {
      setLoading(false)
    }
  }


  return (
    <AuthLayout>




      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>
          {step === 1 ? 'Create New Account' : 'Verify Your Email'}
        </h3>
        <p className='text-[13px] text-slate-700 mt-[5px] mb-6'>
          {step === 1
            ? 'Join us today by entering your details below.'
            : `We've sent a 6-digit OTP to ${email}. Please enter it below.`
          }
        </p>


        {step === 1 ? (
          <form onSubmit={handleSendOTP}>


          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />


          <div className='grid grid-rows-2 md:grid-rows-2 gap-0.5 md:gap-1'>
            <Input
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full name"
              placeholder="enter your name"
            />


            <Input
              type="text"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder='enter your email'
            />


            <div className='md:col-span-2'>
              <Input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder='password'
              />
            </div>
          </div>


          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}


          <button type='submit' className='btn-primary cursor-pointer' disabled={loading}>
            {loading ? 'Sending OTP...' : 'SIGNUP'}
          </button>


          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className='mb-4'>
              <Input
                type="text"
                value={otp}
                onChange={({ target }) => setOtp(target.value.replace(/\D/g, '').slice(0, 6))}
                label="Enter 6-digit OTP"
                placeholder="123456"
                maxLength={6}
              />
            </div>


            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}


            <button type='submit' className='btn-primary cursor-pointer w-full mb-4' disabled={loading}>
              {loading ? 'Verifying...' : 'VERIFY & SIGN UP'}
            </button>


            <button
              type='button'
              onClick={handleResendOTP}
              className='text-primary hover:underline text-sm'
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}


        {/* Google Login Button */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>


          <button
            type="button"
            onClick={() => window.location.href = `${API_PATH.BASE_URL}/api/v1/auth/google`}
            className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>


        <p className='text-[13px] text-slate-800 mt-3 pb-4'>
          Already have an account?
          <Link className='font-medium text-primary underline' to="/login"> Login</Link>
        </p>
      </div>


    </AuthLayout>
  )
}


export default SignUp
