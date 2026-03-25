import React, { useMemo } from 'react'

interface MarketChartsProps {
  volatilityData: any
  predictionResult: any
  ticker: string
}

export default function MarketCharts({ volatilityData, predictionResult, ticker }: MarketChartsProps) {
  // Simple chart component using SVG
  const SimpleLineChart = ({ data, title, color = '#19e69b', unit = '%' }: any) => {
    if (!data || data.length === 0) return null

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 400
    const height = 200
    const padding = 40

    const points = data.map((value: number, index: number) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
      const y = padding + ((max - value) / range) * (height - 2 * padding)
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="bg-[#24473a] border border-[#366347] p-4 rounded">
        <h4 className="text-white font-medium mb-3">{title}</h4>
        <div className="h-64 flex items-center justify-center">
          <svg width={width} height={height} className="border border-[#366347] rounded">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1={padding}
                  y1={padding + ratio * (height - 2 * padding)}
                  x2={width - padding}
                  y2={padding + ratio * (height - 2 * padding)}
                  stroke="rgba(54, 99, 71, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={padding + ratio * (height - 2 * padding) + 4}
                  fill="#93c8b4"
                  fontSize="10"
                  textAnchor="end"
                >
                  {(max - ratio * range).toFixed(2)}{unit}
                </text>
              </g>
            ))}
            
            {/* Data line */}
            <polyline
              fill="none"
              stroke={color}
              strokeWidth="2"
              points={points}
            />
            
            {/* Data points */}
            {data.map((value: number, index: number) => {
              const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
              const y = padding + ((max - value) / range) * (height - 2 * padding)
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="3"
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
              )
            })}
          </svg>
        </div>
        <div className="mt-2 text-xs text-[#93c8b4]">
          {data.length} data points, Range: {min.toFixed(2)} - {max.toFixed(2)}{unit}
        </div>
      </div>
    )
  }

  // Simple bar chart component
  const SimpleBarChart = ({ data, labels, title, colors }: any) => {
    if (!data || data.length === 0) return null

    const max = Math.max(...data)
    const width = 400
    const height = 200
    const padding = 40
    const barWidth = (width - 2 * padding) / data.length - 10

    return (
      <div className="bg-[#24473a] border border-[#366347] p-4 rounded">
        <h4 className="text-white font-medium mb-3">{title}</h4>
        <div className="h-64 flex items-center justify-center">
          <svg width={width} height={height} className="border border-[#366347] rounded">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <g key={i}>
                <line
                  x1={padding}
                  y1={padding + ratio * (height - 2 * padding)}
                  x2={width - padding}
                  y2={padding + ratio * (height - 2 * padding)}
                  stroke="rgba(54, 99, 71, 0.3)"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={padding + ratio * (height - 2 * padding) + 4}
                  fill="#93c8b4"
                  fontSize="10"
                  textAnchor="end"
                >
                  {(ratio * max).toFixed(0)}%
                </text>
              </g>
            ))}
            
            {/* Bars */}
            {data.map((value: number, index: number) => {
              const x = padding + index * (barWidth + 10)
              const barHeight = (value / max) * (height - 2 * padding)
              const y = padding + (height - 2 * padding) - barHeight
              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    fill={colors[index] || '#19e69b'}
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                  <text
                    x={x + barWidth / 2}
                    y={height - padding + 15}
                    fill="#93c8b4"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {labels[index]}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    fill="#ffffff"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {value.toFixed(1)}%
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <div className="mt-2 text-xs text-[#93c8b4]">
          Sentiment distribution from news analysis
        </div>
      </div>
    )
  }

  // Prepare chart data
  const volatilityDataForChart = useMemo(() => {
    if (!volatilityData?.volatility_sequence) return null
    return volatilityData.volatility_sequence.map((v: number) => v * 100)
  }, [volatilityData])

  const priceDataForChart = useMemo(() => {
    if (!volatilityData?.price_history) return null
    return volatilityData.price_history
  }, [volatilityData])

  const sentimentDataForChart = useMemo(() => {
    if (!predictionResult?.dan3_probs_avg) return null
    return {
      data: predictionResult.dan3_probs_avg.map((v: number) => v * 100),
      labels: ['Negative', 'Neutral', 'Positive'],
      colors: ['#ef4444', '#6b7280', '#10b981']
    }
  }, [predictionResult])

  if (!volatilityData) {
    return (
      <div className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
        <h3 className="text-white font-medium mb-4">📊 Market Charts</h3>
        <div className="text-center text-[#93c8b4] py-8">
          Click "Get Market Data" to load charts
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#1b3124] border border-[#366347] p-6 rounded-lg">
      <h3 className="text-white font-medium mb-6">📊 Market Analysis Charts</h3>
      
      <div className="grid gap-6">
        {/* Volatility Trend Chart */}
        {volatilityDataForChart && (
          <SimpleLineChart
            data={volatilityDataForChart}
            title="📈 Volatility Trend"
            color="#19e69b"
            unit="%"
          />
        )}

        {/* Market Index Price Chart */}
        {priceDataForChart && (
          <SimpleLineChart
            data={priceDataForChart}
            title={`💰 ${ticker} Price Movement`}
            color="#3b82f6"
            unit=""
          />
        )}

        {/* Sentiment Analysis Chart */}
        {sentimentDataForChart && (
          <SimpleBarChart
            data={sentimentDataForChart.data}
            labels={sentimentDataForChart.labels}
            title="💭 Market Sentiment"
            colors={sentimentDataForChart.colors}
          />
        )}

        {/* Prediction Results */}
        {predictionResult && (
          <div className="bg-[#24473a] border border-[#366347] p-4 rounded">
            <h4 className="text-white font-medium mb-3">🔮 Volatility Prediction</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#19e69b]">
                  {(predictionResult.volatility_pred_next * 100).toFixed(2)}%
                </div>
                <div className="text-sm text-[#93c8b4]">Predicted Volatility</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#3b82f6]">
                  {predictionResult.avg_sentiment_score > 0 ? 'Positive' : 
                   predictionResult.avg_sentiment_score < 0 ? 'Negative' : 'Neutral'}
                </div>
                <div className="text-sm text-[#93c8b4]">Market Sentiment</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-[#93c8b4]">
              AI prediction based on historical volatility and news sentiment
            </div>
          </div>
        )}
      </div>

      {/* Chart Summary */}
      <div className="mt-6 p-4 bg-[#24473a] border border-[#366347] rounded">
        <h4 className="text-white font-medium mb-2">📋 Chart Summary</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-[#93c8b4]">Volatility Trend:</span>
            <span className="text-white ml-2">
              {volatilityData.volatility_stats ? 
                `${(volatilityData.volatility_stats.mean * 100).toFixed(2)}% average` : 
                'N/A'
              }
            </span>
          </div>
          <div>
            <span className="text-[#93c8b4]">Current Level:</span>
            <span className="text-white ml-2">
              {volatilityData.current_price ? 
                `$${volatilityData.current_price.toFixed(2)}` : 
                'N/A'
              }
            </span>
          </div>
          {predictionResult && (
            <>
              <div>
                <span className="text-[#93c8b4]">Predicted Volatility:</span>
                <span className="text-white ml-2">
                  {(predictionResult.volatility_pred_next * 100).toFixed(2)}%
                </span>
              </div>
              <div>
                <span className="text-[#93c8b4]">Market Sentiment:</span>
                <span className="text-white ml-2">
                  {predictionResult.avg_sentiment_score > 0 ? 'Positive' : 
                   predictionResult.avg_sentiment_score < 0 ? 'Negative' : 'Neutral'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
