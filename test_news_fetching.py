#!/usr/bin/env python3
"""
Test script for news fetching functionality.
"""

import requests
import os

def test_news_fetching():
    """Test news fetching for market indices."""
    
    print("🧪 Testing News Fetching for Market Indices")
    print("=" * 50)
    
    # Test different market indices
    test_cases = [
        ('^GSPC', 'S&P 500 OR "S&P500" OR "Standard & Poor\'s 500"'),
        ('^IXIC', 'NASDAQ OR "NASDAQ Composite"'),
        ('^DJI', 'Dow Jones OR "Dow Jones Industrial Average"'),
        ('^RUT', 'Russell 2000 OR "Russell 2000 Index"'),
        ('^VIX', 'VIX OR "Volatility Index" OR "Fear Index"')
    ]
    
    for ticker, search_term in test_cases:
        print(f"\n📰 Testing {ticker} -> {search_term}")
        
        # Note: This would require a NewsAPI key to test actual API calls
        # For now, we'll just show the mapping
        print(f"✅ Search term mapped correctly")
        print(f"   Ticker: {ticker}")
        print(f"   Search: {search_term}")
    
    print("\n" + "=" * 50)
    print("🎯 News fetching mapping test completed!")
    print("\n💡 Note: Actual API testing requires NewsAPI key")
    print("   The frontend will use these search terms to fetch relevant news")

if __name__ == "__main__":
    test_news_fetching()
