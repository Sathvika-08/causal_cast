import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Research() {
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
        <h1 className="text-3xl font-bold text-white mb-8">🔬 Research & Methodology</h1>
        
        <div className="grid gap-8">
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">📊 Dataset Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#24473a] p-6 rounded">
                <h3 className="text-lg font-semibold text-white mb-3">Financial Data</h3>
                <ul className="text-[#93c8b4] space-y-2">
                  <li>• S&P 500 historical volatility</li>
                  <li>• 5+ years of daily data</li>
                  <li>• Multiple asset classes</li>
                  <li>• Real-time market feeds</li>
                </ul>
              </div>
              <div className="bg-[#24473a] p-6 rounded">
                <h3 className="text-lg font-semibold text-white mb-3">News Data</h3>
                <ul className="text-[#93c8b4] space-y-2">
                  <li>• Reuters financial news</li>
                  <li>• 10,000+ labeled articles</li>
                  <li>• Sentiment annotations</li>
                  <li>• Multi-source aggregation</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">🏗️ Model Architecture</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#24473a] p-6 rounded">
                <h3 className="text-lg font-semibold text-white mb-3">LSTM Pipeline</h3>
                <ul className="text-[#93c8b4] space-y-2">
                  <li>• 3-layer bidirectional LSTM</li>
                  <li>• 128 hidden units</li>
                  <li>• Dropout regularization</li>
                  <li>• Sentiment feature integration</li>
                </ul>
              </div>
              <div className="bg-[#24473a] p-6 rounded">
                <h3 className="text-lg font-semibold text-white mb-3">DAN-3 with FCL</h3>
                <ul className="text-[#93c8b4] space-y-2">
                  <li>• 12-layer transformer</li>
                  <li>• 768 embedding dimensions</li>
                  <li>• Multi-head attention</li>
                  <li>• Focal Calibration Loss</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">📈 Experimental Results</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-[#24473a] p-6 rounded text-center">
                <div className="text-3xl font-bold text-[#19e69b] mb-2">87.3%</div>
                <div className="text-white font-medium">Volatility Prediction</div>
                <div className="text-[#93c8b4] text-sm mt-1">LSTM with sentiment</div>
              </div>
              <div className="bg-[#24473a] p-6 rounded text-center">
                <div className="text-3xl font-bold text-[#19e69b] mb-2">91.7%</div>
                <div className="text-white font-medium">Sentiment Analysis</div>
                <div className="text-[#93c8b4] text-sm mt-1">DAN-3 with FCL</div>
              </div>
              <div className="bg-[#24473a] p-6 rounded text-center">
                <div className="text-3xl font-bold text-[#19e69b] mb-2">0.023</div>
                <div className="text-white font-medium">RMSE</div>
                <div className="text-[#93c8b4] text-sm mt-1">Combined model</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1b3124] border border-[#366347] p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">📚 Citations & References</h2>
            <div className="space-y-4">
              <div className="bg-[#24473a] p-4 rounded">
                <div className="text-white font-medium">Hochreiter, S., & Schmidhuber, J. (1997)</div>
                <div className="text-[#93c8b4] text-sm">Long Short-Term Memory. Neural Computation</div>
              </div>
              <div className="bg-[#24473a] p-4 rounded">
                <div className="text-white font-medium">Vaswani, A., et al. (2017)</div>
                <div className="text-[#93c8b4] text-sm">Attention Is All You Need. NIPS</div>
              </div>
              <div className="bg-[#24473a] p-4 rounded">
                <div className="text-white font-medium">Lin, T. Y., et al. (2017)</div>
                <div className="text-[#93c8b4] text-sm">Focal Loss for Dense Object Detection. ICCV</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


