import { useState } from 'react'

const GUIDE_FAQ: Record<string, string> = {
  'upload csv': 'Use the New Prediction page and paste values; CSV upload can be added similarly.',
  'api url': 'Set NEXT_PUBLIC_API_URL in .env.local to your backend URL.',
  'news': 'Click "Get News" to fetch recent articles for any stock ticker.',
  'prediction': 'Enter ticker, historical volatility, and news data to get AI predictions.',
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [a, setA] = useState('')

  function ask() {
    const key = Object.keys(GUIDE_FAQ).find(k => q.toLowerCase().includes(k))
    setA(GUIDE_FAQ[key || ''] || 'This is a simple demo assistant. Try: "news", "prediction", or "upload csv".')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="w-80 bg-[#1b3124] border border-[#366347] rounded-lg shadow-lg p-4 mb-2">
          <div className="font-medium text-white mb-3">🤖 CausalCast Assistant</div>
          <input 
            className="w-full bg-[#24473a] border border-[#366347] text-white placeholder-[#93c8b4] p-2 rounded focus:outline-none focus:border-[#19e69b]" 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder="Ask a question..." 
            onKeyPress={e => e.key === 'Enter' && ask()}
          />
          <button 
            className="mt-2 bg-[#19e69b] text-[#11221c] text-sm px-3 py-1 rounded font-medium hover:bg-[#39e079] transition-colors" 
            onClick={ask}
          >
            Ask
          </button>
          {a && <div className="mt-3 text-sm text-[#93c8b4] p-2 bg-[#24473a] rounded">{a}</div>}
        </div>
      )}
      <button 
        className="bg-[#19e69b] text-[#11221c] px-4 py-2 rounded-lg font-medium hover:bg-[#39e079] transition-colors shadow-lg" 
        onClick={() => setOpen(!open)}
      >
        {open ? '✕ Close' : '💬 Assistant'}
      </button>
    </div>
  )
}


