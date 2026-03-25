"""
Yahoo Finance API service for fetching historical stock data and calculating volatility.
"""
import yfinance as yf
import numpy as np
import pandas as pd
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta


class YahooFinanceService:
    """Service for fetching stock data from Yahoo Finance and calculating volatility."""
    
    def __init__(self):
        self.cache = {}  # Simple in-memory cache
    
    def get_historical_volatility(
        self, 
        ticker: str, 
        period: str = "1y", 
        window: int = 30,
        use_cache: bool = True
    ) -> Dict[str, Any]:
        """
        Fetch historical volatility data for a given ticker.
        
        Args:
            ticker: Stock symbol (e.g., 'AAPL', 'TSLA')
            period: Data period ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
            window: Rolling window for volatility calculation (default 30 days)
            use_cache: Whether to use cached data
            
        Returns:
            Dict containing volatility data and metadata
        """
        cache_key = f"{ticker}_{period}_{window}"
        
        if use_cache and cache_key in self.cache:
            cached_data = self.cache[cache_key]
            # Check if cache is still valid (less than 1 hour old)
            if datetime.now() - cached_data['timestamp'] < timedelta(hours=1):
                return cached_data['data']
        
        try:
            # Fetch stock data
            stock = yf.Ticker(ticker)
            hist = stock.history(period=period)
            
            if hist.empty:
                raise ValueError(f"No data found for ticker: {ticker}")
            
            # Calculate daily returns
            hist['Returns'] = hist['Close'].pct_change()
            
            # Calculate rolling volatility (annualized)
            hist['Volatility'] = hist['Returns'].rolling(window=window).std() * np.sqrt(252)
            
            # Get recent volatility sequence (last 30 days or available data)
            recent_volatility = hist['Volatility'].dropna().tail(30).tolist()
            
            # Get price history for charts
            price_history = hist['Close'].tail(30).tolist()
            dates = hist.tail(30).index.strftime('%Y-%m-%d').tolist()
            
            # Get current stock info
            info = stock.info
            current_price = hist['Close'].iloc[-1] if not hist.empty else None
            
            result = {
                'ticker': ticker,
                'volatility_sequence': recent_volatility,
                'price_history': price_history,
                'dates': dates,
                'current_price': float(current_price) if current_price else None,
                'company_name': info.get('longName', ticker),
                'sector': info.get('sector', 'Unknown'),
                'market_cap': info.get('marketCap'),
                'last_updated': datetime.now().isoformat(),
                'data_period': period,
                'volatility_window': window,
                'volatility_stats': {
                    'mean': float(np.mean(recent_volatility)) if recent_volatility else 0,
                    'std': float(np.std(recent_volatility)) if recent_volatility else 0,
                    'min': float(np.min(recent_volatility)) if recent_volatility else 0,
                    'max': float(np.max(recent_volatility)) if recent_volatility else 0,
                    'latest': float(recent_volatility[-1]) if recent_volatility else 0
                }
            }
            
            # Cache the result
            if use_cache:
                self.cache[cache_key] = {
                    'data': result,
                    'timestamp': datetime.now()
                }
            
            return result
            
        except Exception as e:
            return {
                'ticker': ticker,
                'error': str(e),
                'volatility_sequence': [],
                'current_price': None,
                'company_name': ticker,
                'sector': 'Unknown',
                'market_cap': None,
                'last_updated': datetime.now().isoformat(),
                'data_period': period,
                'volatility_window': window,
                'volatility_stats': {
                    'mean': 0,
                    'std': 0,
                    'min': 0,
                    'max': 0,
                    'latest': 0
                }
            }
    
    def get_stock_info(self, ticker: str) -> Dict[str, Any]:
        """Get basic stock information."""
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                'ticker': ticker,
                'company_name': info.get('longName', ticker),
                'sector': info.get('sector', 'Unknown'),
                'industry': info.get('industry', 'Unknown'),
                'market_cap': info.get('marketCap'),
                'current_price': info.get('currentPrice'),
                'currency': info.get('currency', 'USD'),
                'exchange': info.get('exchange', 'Unknown'),
                'website': info.get('website'),
                'description': info.get('longBusinessSummary', ''),
                'last_updated': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'ticker': ticker,
                'error': str(e),
                'company_name': ticker,
                'sector': 'Unknown',
                'industry': 'Unknown',
                'market_cap': None,
                'current_price': None,
                'currency': 'USD',
                'exchange': 'Unknown',
                'website': None,
                'description': '',
                'last_updated': datetime.now().isoformat()
            }
    
    def validate_ticker(self, ticker: str) -> bool:
        """Validate if a ticker symbol exists and has data."""
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period="5d")
            return not hist.empty
        except:
            return False


# Global instance
yahoo_service = YahooFinanceService()
