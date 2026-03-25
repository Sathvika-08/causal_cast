import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function History() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    
    axios.get(process.env.NEXT_PUBLIC_API_URL + '/prediction/history', { headers: { Authorization: `Bearer ${token}` }})
      .then(({ data }) => setItems(data))
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">📈 Prediction History</h1>
        <div className="grid gap-6">
          {items.map((it) => (
            <div key={it._id} className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm text-[#93c8b4]">{new Date(it.createdAt).toLocaleString()}</div>
                  <div className="text-xl font-bold text-white mt-1">{it.ticker}</div>
                </div>
                <button
                  className="bg-[#19e69b] text-[#11221c] px-4 py-2 rounded font-medium hover:bg-[#39e079] transition-colors"
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    try {
                      const response = await axios.get(
                        (process.env.NEXT_PUBLIC_API_URL || '') + `/prediction/${it._id}/pdf`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                          responseType: 'blob'
                        }
                      );
                      const url = window.URL.createObjectURL(new Blob([response.data]));
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${it.ticker}_prediction.pdf`);
                      document.body.appendChild(link);
                      link.click();
                      link.parentNode?.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (err) {
                      alert('Failed to download PDF');
                    }
                  }}
                >
                  📄 Download PDF
                </button>
              </div>
              
              {it.result && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#24473a] p-4 rounded">
                    <div className="text-[#93c8b4] text-sm">Volatility Forecast</div>
                    <div className="text-2xl font-bold text-[#19e69b]">
                      {it.result.volatility_pred_next?.toFixed(4)}
                    </div>
                  </div>
                  <div className="bg-[#24473a] p-4 rounded">
                    <div className="text-[#93c8b4] text-sm">Avg Sentiment</div>
                    <div className="text-2xl font-bold text-[#19e69b]">
                      {it.result.avg_sentiment_score?.toFixed(3)}
                    </div>
                  </div>
                </div>
              )}
              
              <details className="mt-4">
                <summary className="cursor-pointer text-white font-medium hover:text-[#19e69b]">View Full Results</summary>
                <pre className="mt-3 p-4 bg-[#24473a] border border-[#366347] rounded overflow-auto text-sm text-[#93c8b4]">
                  {JSON.stringify(it.result, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}


