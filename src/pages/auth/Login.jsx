import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input'
import { validEmail } from '../../utils/helper'
import axiosInstance from "../../utils/axiosInstance.js"
import { API_PATH } from '../../utils/apiPath.js'
import { UserContext } from '../../context/UserContext.jsx'
import { getUserFriendlyErrorMessage } from '../../utils/errorMessage.js'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const { login } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Please enter your password")
      return
    }

    setError("")

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      })

      const { user } = response.data

      if (user) {
        login(user)
        navigate("/dashboard", { replace: true })
      }
    } catch (error) {
      setError(
        getUserFriendlyErrorMessage(error, {
          fallback: 'Sign in failed. Please try again later.',
          allowUnauthorizedMessage: true,
        })
      )
    }
  }

  return (
    <AuthLayout>
      <div>
        <p className='page-eyebrow'>Welcome back</p>
        <h2 className='mt-2 text-2xl font-bold tracking-tight text-slate-900'>Sign in</h2>
        <p className='mt-2 text-sm leading-6 text-slate-500'>
          Pick up where you left off.
        </p>

        <form className='mt-6' onSubmit={handleLogin}>
          <Input
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email address"
            placeholder='you@example.com'
          />

          <Input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder='Enter your password'
          />

          {error && (
            <div className='mb-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-xs text-rose-600'>
              {error}
            </div>
          )}

          <button type='submit' className='btn-primary cursor-pointer !py-3'>
            Sign in
          </button>
        </form>

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
          New here?
          <Link className='ml-1 font-bold text-primary hover:underline' to="/signUp">Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
