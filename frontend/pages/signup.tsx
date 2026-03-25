import { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    try {
      await axios.post(process.env.NEXT_PUBLIC_API_URL + '/auth/signup', { name, email, password })
      router.push('/login')
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.map((e: any) => e.msg).join(', '))
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#11221c] dark group/design-root overflow-x-hidden" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#24473a] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <Link href="/" className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">CausalCast</Link>
          </div>
          <Link
            href="/login"
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#24473a] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Log in</span>
          </Link>
        </header>
        
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Sign up for CausalCast</h2>
            
            <form onSubmit={onSubmit} className="flex flex-col gap-4 px-4">
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Name</p>
                  <input
                    placeholder="Enter your name"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#24473a] focus:border-none h-14 placeholder:text-[#93c8b4] p-4 text-base font-normal leading-normal"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </label>
              </div>
              
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Email</p>
                  <input
                    placeholder="Enter your email"
                    type="email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#24473a] focus:border-none h-14 placeholder:text-[#93c8b4] p-4 text-base font-normal leading-normal"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </label>
              </div>
              
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Password</p>
                  <div className="flex w-full flex-1 items-stretch rounded-lg">
                    <input
                      placeholder="Enter your password"
                      type="password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#24473a] focus:border-none h-14 placeholder:text-[#93c8b4] p-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <div className="text-[#93c8b4] flex border-none bg-[#24473a] items-center justify-center pr-4 rounded-r-lg border-l-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" />
                      </svg>
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-white text-base font-medium leading-normal pb-2">Confirm Password</p>
                  <div className="flex w-full flex-1 items-stretch rounded-lg">
                    <input
                      placeholder="Confirm your password"
                      type="password"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#24473a] focus:border-none h-14 placeholder:text-[#93c8b4] p-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="text-[#93c8b4] flex border-none bg-[#24473a] items-center justify-center pr-4 rounded-r-lg border-l-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z" />
                      </svg>
                    </div>
                  </div>
                </label>
              </div>
              
              {error && <p className="text-red-400 text-sm px-4">{error}</p>}
              
              <div className="px-4">
                <label className="flex gap-x-3 py-3 flex-row">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-[#346553] border-2 bg-transparent text-[#19e69b] checked:bg-[#19e69b] checked:border-[#19e69b] focus:ring-0 focus:ring-offset-0 focus:border-[#346553] focus:outline-none"
                    required
                  />
                  <p className="text-white text-base font-normal leading-normal">I agree to the Terms of Service and Privacy Policy</p>
                </label>
              </div>
              
              <div className="flex px-4 py-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#19e69b] text-[#11221c] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50"
                >
                  <span className="truncate">{loading ? 'Creating account...' : 'Create account'}</span>
                </button>
              </div>
              
              <div className="flex px-4 py-3">
                <Link
                  href="/login"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#24473a] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Already have an account? Login</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}