import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Profile() {
  const [me, setMe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/user/me', { headers: { Authorization: `Bearer ${token}` }})
      .then(({ data }) => setMe(data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen p-8 bg-[#11221c]" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">👤 Profile</h1>
        {me && (
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <div className="grid gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#19e69b] rounded-full flex items-center justify-center">
                  <span className="text-2xl text-[#11221c] font-bold">{me.name?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{me.name}</h2>
                  <p className="text-[#93c8b4]">{me.email}</p>
                </div>
              </div>
              
              <div className="border-t border-[#366347] pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                <div className="grid gap-4">
                  <div className="bg-[#24473a] p-4 rounded">
                    <div className="text-[#93c8b4] text-sm">Full Name</div>
                    <div className="text-white font-medium">{me.name}</div>
                  </div>
                  <div className="bg-[#24473a] p-4 rounded">
                    <div className="text-[#93c8b4] text-sm">Email Address</div>
                    <div className="text-white font-medium">{me.email}</div>
                  </div>
                  <div className="bg-[#24473a] p-4 rounded">
                    <div className="text-[#93c8b4] text-sm">Member Since</div>
                    <div className="text-white font-medium">
                      {new Date(me.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}


