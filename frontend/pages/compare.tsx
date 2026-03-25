import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Compare() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <main className="min-h-screen p-8 bg-[#11221c]" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">⚖️ Model Comparison</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">📈 Volatility Models</h2>
            <div className="space-y-4">
              <div className="bg-[#24473a] p-4 rounded">
                <h3 className="text-lg font-semibold text-white mb-2">LSTM Neural Network</h3>
                <p className="text-[#93c8b4] text-sm">Deep learning model with sentiment integration</p>
                <div className="mt-2 text-[#19e69b] font-medium">Accuracy: 87.3%</div>
              </div>
              <div className="bg-[#24473a] p-4 rounded">
                <h3 className="text-lg font-semibold text-white mb-2">ARIMA Baseline</h3>
                <p className="text-[#93c8b4] text-sm">Traditional statistical time series model</p>
                <div className="mt-2 text-[#19e69b] font-medium">Accuracy: 72.1%</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">💭 Sentiment Models</h2>
            <div className="space-y-4">
              <div className="bg-[#24473a] p-4 rounded">
                <h3 className="text-lg font-semibold text-white mb-2">DAN-3 (Deep Attention)</h3>
                <p className="text-[#93c8b4] text-sm">Advanced transformer-based sentiment analysis</p>
                <div className="mt-2 text-[#19e69b] font-medium">Accuracy: 91.7%</div>
              </div>
              <div className="bg-[#24473a] p-4 rounded">
                <h3 className="text-lg font-semibold text-white mb-2">FinBERT</h3>
                <p className="text-[#93c8b4] text-sm">Financial domain BERT model</p>
                <div className="mt-2 text-[#19e69b] font-medium">Accuracy: 85.2%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">📊 Performance Metrics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#24473a] p-6 rounded text-center">
              <div className="text-3xl font-bold text-[#19e69b] mb-2">0.847</div>
              <div className="text-white font-medium">Mean R² Score</div>
            </div>
            <div className="bg-[#24473a] p-6 rounded text-center">
              <div className="text-3xl font-bold text-[#19e69b] mb-2">0.023</div>
              <div className="text-white font-medium">RMSE</div>
            </div>
            <div className="bg-[#24473a] p-6 rounded text-center">
              <div className="text-3xl font-bold text-[#19e69b] mb-2">89.1%</div>
              <div className="text-white font-medium">Overall Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


