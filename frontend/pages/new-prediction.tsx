import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import MarketCharts from '../components/MarketCharts'

export default function NewPrediction() {
  const router = useRouter()
  const [ticker, setTicker] = useState('^GSPC') // S&P 500 index
  const [historical, setHistorical] = useState('0.1,0.2,0.15,0.18')
  const [news, setNews] = useState('S&P 500 shows mixed signals amid market volatility and economic uncertainty.')
  const [newsArticles, setNewsArticles] = useState<any[]>([])
  const [selectedNews, setSelectedNews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [volatilityData, setVolatilityData] = useState<any>(null)
  const [fetchingVolatility, setFetchingVolatility] = useState(false)
  const [volatilityError, setVolatilityError] = useState<string | null>(null)
  const [useAutoVolatility, setUseAutoVolatility] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    } else {
      // Auto-fetch data for default S&P 500 ticker
      fetchTickerData()
    }
  }, [router])

  async function fetchVolatilityData() {
    if (!ticker) return
    setFetchingVolatility(true)
    setVolatilityError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/prediction/volatility/${ticker}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setVolatilityData(response.data)
      
      // Auto-populate the historical volatility field if we have data
      if (response.data.volatility_sequence && response.data.volatility_sequence.length > 0) {
        setHistorical(response.data.volatility_sequence.map((v: number) => v.toFixed(4)).join(','))
      }
    } catch (error: any) {
      console.error('Failed to fetch volatility data:', error)
      setVolatilityError(error.response?.data?.message || 'Failed to fetch volatility data')
    }
    setFetchingVolatility(false)
  }

  async function fetchNews() {
    if (!ticker) return
    setLoading(true)
    try {
      // Map market indices to search terms that NewsAPI can understand
      const getSearchTerm = (ticker: string) => {
        const indexMap: { [key: string]: string } = {
          '^GSPC': 'S&P 500 OR "S&P500" OR "Standard & Poor\'s 500"',
          '^IXIC': 'NASDAQ OR "NASDAQ Composite"',
          '^DJI': 'Dow Jones OR "Dow Jones Industrial Average"',
          '^RUT': 'Russell 2000 OR "Russell 2000 Index"',
          '^VIX': 'VIX OR "Volatility Index" OR "Fear Index"'
        }
        return indexMap[ticker] || ticker
      }

      const searchTerm = getSearchTerm(ticker)
      
      // Using NewsAPI (free tier: 100 requests/day)
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`)
      const articles = response.data.articles || []
      setNewsArticles(articles)
    } catch (error) {
      console.error('Failed to fetch news:', error)
      // Fallback to demo news based on ticker type
      const getFallbackNews = (ticker: string) => {
        if (ticker === '^GSPC') {
          return [
            { title: 'S&P 500 shows mixed signals amid market volatility', description: 'The S&P 500 index reflects ongoing market uncertainty with mixed economic indicators...' },
            { title: 'Market analysts predict continued volatility in S&P 500', description: 'Financial experts suggest the S&P 500 may experience continued fluctuations...' },
            { title: 'S&P 500 companies report mixed quarterly earnings', description: 'Major companies in the S&P 500 index show varied performance in recent earnings...' }
          ]
        } else if (ticker === '^IXIC') {
          return [
            { title: 'NASDAQ Composite faces technology sector headwinds', description: 'The NASDAQ index shows volatility amid technology sector challenges...' },
            { title: 'Tech stocks drive NASDAQ performance', description: 'Technology companies continue to influence NASDAQ Composite movements...' }
          ]
        } else if (ticker === '^DJI') {
          return [
            { title: 'Dow Jones Industrial Average reflects economic uncertainty', description: 'The Dow Jones index shows mixed signals from industrial companies...' },
            { title: 'Blue-chip stocks influence Dow Jones performance', description: 'Major industrial companies drive Dow Jones Industrial Average movements...' }
          ]
        } else {
          return [
            { title: `${ticker} shows market volatility`, description: `${ticker} reflects ongoing market uncertainty and economic indicators...` },
            { title: `Analysts predict continued volatility for ${ticker}`, description: `Market experts suggest ${ticker} may experience continued fluctuations...` }
          ]
        }
      }
      
      setNewsArticles(getFallbackNews(ticker))
    }
    setLoading(false)
  }

  async function fetchTickerData() {
    // Fetch both volatility and news data when ticker changes
    await Promise.all([fetchVolatilityData(), fetchNews()])
  }

  function toggleNewsSelection(articleText: string) {
    setSelectedNews(prev => 
      prev.includes(articleText) 
        ? prev.filter(text => text !== articleText)
        : [...prev, articleText]
    )
  }

  async function submit() {
    const token = localStorage.getItem('token')
    
    // Use auto-fetched volatility data if available and enabled, otherwise use manual input
    let historical_vol_seq
    if (useAutoVolatility && volatilityData?.volatility_sequence?.length > 0) {
      historical_vol_seq = volatilityData.volatility_sequence
    } else {
      historical_vol_seq = historical.split(',').map(s => parseFloat(s.trim())).filter(n => !Number.isNaN(n))
    }
    
    const news_texts = selectedNews.length > 0 ? selectedNews : [news]
    const dan3_token_ids = [[1,2,3,4,5]]
    const { data } = await axios.post(process.env.NEXT_PUBLIC_API_URL + '/prediction/new', {
      ticker,
      historical_vol_seq,
      news_texts,
      dan3_token_ids,
      horizon: 1
    }, { headers: { Authorization: `Bearer ${token}` }})
    setResult(data)
  }

  return (
    <main className="min-h-screen p-8 bg-[#11221c]" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">New Prediction</h1>
        <div className="grid gap-6">
        <div className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
          <label className="text-white font-medium mb-3 block">Market Index</label>
          <div className="flex gap-3">
            <input 
              className="bg-[#24473a] border border-[#366347] text-white placeholder-[#93c8b4] p-3 rounded flex-1 focus:outline-none focus:border-[#19e69b]" 
              value={ticker} 
              onChange={e => setTicker(e.target.value)}
              placeholder="Enter market index (e.g., ^GSPC for S&P 500, ^IXIC for NASDAQ)"
            />
            <button 
              className="bg-[#19e69b] text-[#11221c] px-6 py-3 rounded font-medium hover:bg-[#39e079] transition-colors disabled:opacity-50"
              onClick={fetchTickerData}
              disabled={loading || fetchingVolatility}
            >
              {(loading || fetchingVolatility) ? 'Fetching...' : 'Get Market Data'}
            </button>
          </div>
          
          {/* Market Index Info Display */}
          {volatilityData && (
            <div className="mt-4 p-4 bg-[#24473a] border border-[#366347] rounded">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#93c8b4]">Index:</span>
                  <span className="text-white ml-2">{volatilityData.company_name}</span>
                </div>
                <div>
                  <span className="text-[#93c8b4]">Type:</span>
                  <span className="text-white ml-2">{volatilityData.sector || 'Market Index'}</span>
                </div>
                {volatilityData.current_price && (
                  <div>
                    <span className="text-[#93c8b4]">Current Level:</span>
                    <span className="text-white ml-2">{volatilityData.current_price.toFixed(2)}</span>
                  </div>
                )}
                {volatilityData.volatility_stats && (
                  <div>
                    <span className="text-[#93c8b4]">Market Volatility:</span>
                    <span className="text-white ml-2">{(volatilityData.volatility_stats.latest * 100).toFixed(2)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {volatilityError && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm">
              ⚠️ {volatilityError}
            </div>
          )}
        </div>

        <div className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <label className="text-white font-medium">Market Volatility Sequence</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAutoVolatility"
                checked={useAutoVolatility}
                onChange={e => setUseAutoVolatility(e.target.checked)}
                className="text-[#19e69b]"
              />
              <label htmlFor="useAutoVolatility" className="text-sm text-[#93c8b4]">
                Use market data
              </label>
            </div>
          </div>
          
          {useAutoVolatility && volatilityData?.volatility_sequence ? (
            <div className="space-y-3">
              <div className="p-3 bg-[#24473a] border border-[#366347] rounded">
                <div className="text-sm text-[#93c8b4] mb-2">
                  📊 Market volatility data ({volatilityData.volatility_sequence.length} data points)
                </div>
                <div className="text-xs text-white font-mono break-all">
                  {volatilityData.volatility_sequence.map((v: number) => v.toFixed(4)).join(', ')}
                </div>
                {volatilityData.volatility_stats && (
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[#93c8b4]">Avg Volatility:</span>
                      <span className="text-white ml-1">{(volatilityData.volatility_stats.mean * 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[#93c8b4]">Volatility Std:</span>
                      <span className="text-white ml-1">{(volatilityData.volatility_stats.std * 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[#93c8b4]">Lowest:</span>
                      <span className="text-white ml-1">{(volatilityData.volatility_stats.min * 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-[#93c8b4]">Highest:</span>
                      <span className="text-white ml-1">{(volatilityData.volatility_stats.max * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs text-[#93c8b4]">
                💡 Uncheck "Use market data" to manually enter volatility values below
              </div>
            </div>
          ) : (
            <textarea 
              className="bg-[#24473a] border border-[#366347] text-white placeholder-[#93c8b4] p-3 rounded w-full focus:outline-none focus:border-[#19e69b]" 
              value={historical} 
              onChange={e => setHistorical(e.target.value)}
              placeholder="Enter comma-separated volatility values (e.g., 0.1,0.2,0.15,0.18)"
              rows={3}
            />
          )}
        </div>

        <div className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
          <label className="text-white font-medium mb-3 block">Market News Articles</label>
          {newsArticles.length > 0 ? (
            <div className="grid gap-3 max-h-60 overflow-y-auto">
              {newsArticles.map((article, index) => {
                const articleText = `${article.title || ''} ${article.description || ''}`.trim()
                return (
                  <div key={index} className="border border-[#366347] p-3 rounded bg-[#24473a]">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedNews.includes(articleText)}
                        onChange={() => toggleNewsSelection(articleText)}
                        className="mt-1 text-[#19e69b]"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{article.title}</div>
                        <div className="text-xs text-[#93c8b4] mt-1">{article.description}</div>
                        <div className="text-xs text-[#93c8b4] mt-1">
                          {new Date(article.publishedAt || Date.now()).toLocaleDateString()}
                        </div>
                      </div>
                    </label>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="border border-[#366347] p-4 rounded bg-[#24473a] text-[#93c8b4]">
              Click "Get Market Data" to fetch recent market news for {ticker}
            </div>
          )}
        </div>

        <div className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
          <label className="text-white font-medium mb-3 block">Custom Market News (fallback)</label>
          <textarea 
            className="bg-[#24473a] border border-[#366347] text-white placeholder-[#93c8b4] p-3 rounded w-full focus:outline-none focus:border-[#19e69b]" 
            value={news} 
            onChange={e => setNews(e.target.value)}
            placeholder="Or enter custom market news text here"
            rows={4}
          />
        </div>

        <button 
          className="bg-[#19e69b] text-[#11221c] py-4 rounded-lg font-bold text-lg hover:bg-[#39e079] transition-colors"
          onClick={submit}
        >
          🚀 Run Market Prediction
        </button>
        </div>
      </div>

      {/* Market Charts Section */}
      <div className="mt-8">
        <MarketCharts 
          volatilityData={volatilityData}
          predictionResult={result}
          ticker={ticker}
        />
      </div>

      {result && (
        <div className="mt-8 bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">🎯 Market Prediction Results</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#24473a] border border-[#366347] p-6 rounded-lg">
              <h3 className="text-white font-medium mb-2">📈 Market Volatility Forecast</h3>
              <div className="text-3xl font-bold text-[#19e69b]">
                {(result.volatility_pred_next * 100)?.toFixed(2)}%
              </div>
              <div className="text-sm text-[#93c8b4] mt-1">Next period volatility</div>
            </div>
            <div className="bg-[#24473a] border border-[#366347] p-6 rounded-lg">
              <h3 className="text-white font-medium mb-2">💭 Market Sentiment</h3>
              <div className="text-3xl font-bold text-[#19e69b]">
                {result.avg_sentiment_score?.toFixed(3)}
              </div>
              <div className="text-sm text-[#93c8b4] mt-1">Average news sentiment</div>
            </div>
          </div>
          <details className="mt-6">
            <summary className="cursor-pointer text-white font-medium hover:text-[#19e69b]">View Full Market Analysis</summary>
            <pre className="mt-3 p-4 bg-[#24473a] border border-[#366347] rounded overflow-auto text-sm text-[#93c8b4]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </main>
  )
}


