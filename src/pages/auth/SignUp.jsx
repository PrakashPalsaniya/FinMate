import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input'
import { validEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATH } from '../../utils/apiPath'
import { UserContext } from '../../context/UserContext'
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage'

const SignUp = () => {
  const navigate = useNavigate()
  const { login } = useContext(UserContext)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSendOTP = async (e) => {
    e.preventDefault()

    if (!fullName) {
      setError("Enter your full name")
      return
    }

    if (!validEmail(email)) {
      setError("Enter a valid email address")
      return
    }

    if (!password) {
      setError("Enter a password")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setError("")
    setLoading(true)

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.SEND_OTP, { email })

      if (response.data.message === "OTP sent successfully") {
        setStep(2)
        toast.success("OTP sent to your email")
      }
    } catch (error) {
      setError(
        getUserFriendlyErrorMessage(error, {
          fallback: 'Could not continue right now. Please try again later.',
          allowUnauthorizedMessage: true,
        })
      )
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

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.VERIFY_OTP, {
        fullName,
        email,
        password,
        otp,
      })

      const { token, user } = response.data

      if (token) {
        login(user, token)
        toast.success("Account created successfully")
        navigate("/dashboard", { replace: true })
      }
    } catch (error) {
      setError(
        getUserFriendlyErrorMessage(error, {
          fallback: 'Could not verify the code right now. Please try again later.',
          allowUnauthorizedMessage: true,
        })
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setLoading(true)

    try {
      await axiosInstance.post(API_PATH.AUTH.SEND_OTP, { email })
      toast.success("OTP resent to your email")
    } catch (error) {
      toast.error(
        getUserFriendlyErrorMessage(error, {
          fallback: 'Could not resend the code right now. Please try again later.',
          allowUnauthorizedMessage: true,
        })
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div>
        <div className='flex items-center gap-3 justify-center'>
          <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-primary' : 'bg-slate-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step === 2 ? 'bg-primary' : 'bg-slate-300'}`} />
        </div>

        <p className='page-eyebrow mt-4 text-center'>{step === 1 ? 'Step 1 of 2' : 'Final Step'}</p>
        <h2 className='mt-2 text-xl font-bold tracking-tight text-slate-900 text-center'>
          {step === 1 ? 'Create space' : 'Verify email'}
        </h2>
        <p className='mt-1 text-[13px] leading-5 text-slate-500 text-center'>
          {step === 1
            ? 'Start with your basic details.'
            : `Code sent to ${email}`}
        </p>

        <div className='mt-6'>
          {step === 1 ? (
            <form onSubmit={handleSendOTP}>
              <Input
                type="text"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                label="Full name"
                placeholder="Full name"
              />

              <Input
                type="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                label="Email"
                placeholder='you@example.com'
              />

              <Input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder='Strong password'
              />

              {error && (
                <div className='mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-600'>
                  {error}
                </div>
              )}

              <button type='submit' className='btn-primary cursor-pointer !py-3' disabled={loading}>
                {loading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <Input
                type="text"
                value={otp}
                onChange={({ target }) => setOtp(target.value.replace(/\D/g, '').slice(0, 6))}
                label="6-digit OTP"
                placeholder="123456"
                maxLength={6}
              />

              {error && (
                <div className='mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-600'>
                  {error}
                </div>
              )}

              <button type='submit' className='btn-primary cursor-pointer mb-3 !py-3' disabled={loading}>
                {loading ? 'Verifying...' : 'Verify account'}
              </button>

              <button
                type='button'
                onClick={handleResendOTP}
                className='btn-secondary !w-full !py-2.5 text-xs'
                disabled={loading}
              >
                Resend code
              </button>
            </form>
          )}
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white/50 px-3 text-slate-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = `${API_PATH.BASE_URL}/api/v1/auth/google`}
            className="btn-secondary mt-4 w-full !py-3 text-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </div>

        <p className='mt-6 text-center text-xs text-slate-500'>
          Have an account?
          <Link className='ml-1 font-bold text-primary hover:underline' to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default SignUp
