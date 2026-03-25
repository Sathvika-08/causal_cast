# Yahoo Finance Integration

This document describes the new Yahoo Finance integration that automatically fetches historical volatility data for stock predictions.

## Overview

The prediction screen now automatically fetches historical volatility data from Yahoo Finance API instead of requiring manual input. This provides more accurate and up-to-date volatility data for better predictions.

## Features

### 🚀 Automatic Volatility Fetching
- **Real-time Data**: Fetches the latest historical volatility data from Yahoo Finance
- **Smart Caching**: Implements 1-hour caching to reduce API calls
- **Error Handling**: Graceful fallback to manual input if API fails
- **Multiple Timeframes**: Supports different data periods (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)

### 📊 Enhanced UI
- **Stock Information Display**: Shows company name, sector, current price, and latest volatility
- **Auto-populated Fields**: Volatility sequence is automatically populated from fetched data
- **Manual Override**: Users can still manually enter volatility data if needed
- **Visual Statistics**: Displays volatility statistics (mean, std, min, max)
- **Loading States**: Clear loading indicators during data fetching

### 🔧 Technical Implementation

#### Backend Changes
1. **New FastAPI Endpoints**:
   - `GET /volatility/{ticker}` - Fetch volatility data
   - `GET /stock-info/{ticker}` - Get basic stock information
   - `GET /validate-ticker/{ticker}` - Validate ticker symbol

2. **Express.js Route**:
   - `GET /prediction/volatility/:ticker` - Proxy endpoint to FastAPI

#### Frontend Changes
1. **Enhanced State Management**:
   - Added volatility data state
   - Loading and error states
   - Auto/manual mode toggle

2. **Improved UX**:
   - Combined "Get Data" button fetches both volatility and news
   - Real-time stock information display
   - Toggle between auto-fetched and manual data

## Usage

### For Users
1. **Enter Stock Ticker**: Type any valid stock symbol (e.g., AAPL, TSLA, MSFT)
2. **Click "Get Data"**: Automatically fetches volatility data and news
3. **Review Data**: Check the auto-populated volatility sequence and stock info
4. **Toggle Mode**: Use checkbox to switch between auto-fetched and manual data
5. **Run Prediction**: Submit with confidence using real market data

### For Developers

#### Testing the Integration
```bash
# Navigate to the Combined directory
cd Combined

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the test script
python test_yahoo_finance.py
```

#### API Usage Examples

**Fetch Volatility Data**:
```bash
curl -X GET "http://localhost:8002/volatility/AAPL?period=1y&window=30"
```

**Get Stock Information**:
```bash
curl -X GET "http://localhost:8002/stock-info/TSLA"
```

**Validate Ticker**:
```bash
curl -X GET "http://localhost:8002/validate-ticker/MSFT"
```

## Configuration

### Environment Variables
No additional environment variables are required. The integration uses the existing FastAPI URL configuration.

### Dependencies
The following new dependency was added:
- `yfinance>=0.2.18` - Yahoo Finance API client

## Data Flow

1. **User Input**: User enters stock ticker
2. **API Call**: Frontend calls backend volatility endpoint
3. **Yahoo Finance**: Backend fetches data from Yahoo Finance API
4. **Processing**: Volatility is calculated using rolling window
5. **Caching**: Result is cached for 1 hour
6. **Response**: Data is returned to frontend
7. **UI Update**: Frontend displays stock info and auto-populates volatility

## Error Handling

- **Invalid Ticker**: Clear error message with fallback to manual input
- **API Failures**: Graceful degradation with user notification
- **Network Issues**: Retry logic and timeout handling
- **Data Validation**: Ensures volatility data is valid before use

## Performance Considerations

- **Caching**: 1-hour cache reduces API calls
- **Async Operations**: Non-blocking data fetching
- **Error Recovery**: Fallback to manual input ensures functionality
- **Rate Limiting**: Yahoo Finance has generous rate limits

## Future Enhancements

- **Multiple Data Sources**: Add alternative data providers
- **Historical Comparison**: Compare volatility across different time periods
- **Volatility Forecasting**: Add volatility trend analysis
- **Portfolio Support**: Fetch data for multiple tickers simultaneously
- **Data Export**: Export volatility data for analysis

## Troubleshooting

### Common Issues

1. **"Failed to fetch volatility data"**
   - Check if ticker symbol is valid
   - Verify internet connection
   - Check if Yahoo Finance is accessible

2. **"No data found for ticker"**
   - Ensure ticker symbol is correct
   - Some tickers may not have sufficient historical data
   - Try a different time period

3. **Slow Loading**
   - First request may be slower due to data fetching
   - Subsequent requests use cached data
   - Check network connection

### Debug Mode
Enable debug logging by setting the log level in the FastAPI application.

## Support

For issues or questions regarding the Yahoo Finance integration:
1. Check the test script output: `python test_yahoo_finance.py`
2. Verify all dependencies are installed
3. Check network connectivity to Yahoo Finance
4. Review the browser console for frontend errors
