import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Dashboard() {
  const [me, setMe] = useState<any>(null)
  const [error, setError] = useState('')
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
        console.error('Auth error:', err)
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          router.push('/login')
        } else {
          setError('Failed to load profile')
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!me) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>
  }

  return (
    <main className="min-h-screen p-8 bg-[#11221c]" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          {me && <p className="text-[#93c8b4]">Welcome back, {me.name}!</p>}
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="/new-prediction" 
            className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg hover:border-[#19e69b] transition-colors group"
          >
            <div className="text-3xl mb-3">🔮</div>
            <h3 className="text-white font-semibold mb-2">New Prediction</h3>
            <p className="text-[#93c8b4] text-sm">Create a new volatility prediction with news sentiment analysis</p>
          </a>
          
          <a 
            href="/history" 
            className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg hover:border-[#19e69b] transition-colors group"
          >
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-white font-semibold mb-2">Prediction History</h3>
            <p className="text-[#93c8b4] text-sm">View and download your previous predictions</p>
          </a>
          
          <a 
            href="/compare" 
            className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg hover:border-[#19e69b] transition-colors group"
          >
            <div className="text-3xl mb-3">⚖️</div>
            <h3 className="text-white font-semibold mb-2">Model Comparison</h3>
            <p className="text-[#93c8b4] text-sm">Compare LSTM vs ARIMA and DAN-3 variants</p>
          </a>
          
          <a 
            href="/research" 
            className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg hover:border-[#19e69b] transition-colors group"
          >
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="text-white font-semibold mb-2">Research</h3>
            <p className="text-[#93c8b4] text-sm">Learn about our methodology and datasets</p>
          </a>
          
          <a 
            href="/profile" 
            className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg hover:border-[#19e69b] transition-colors group"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="text-white font-semibold mb-2">Profile</h3>
            <p className="text-[#93c8b4] text-sm">Manage your account settings</p>
          </a>
        </div>
      </div>
    </main>
  )
}


