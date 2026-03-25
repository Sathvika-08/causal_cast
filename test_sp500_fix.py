#!/usr/bin/env python3
"""
Test script to verify S&P 500 data fetching fix.
"""

from utils.yahoo_finance import yahoo_service

def test_sp500_fix():
    """Test S&P 500 data fetching with the pandas fix."""
    
    print("🧪 Testing S&P 500 Data Fetching Fix")
    print("=" * 50)
    
    try:
        # Test S&P 500 volatility data
        data = yahoo_service.get_historical_volatility('^GSPC', period='6mo', window=30)
        
        if 'error' in data:
            print(f"❌ Error: {data['error']}")
            return
            
        print(f"✅ Index: {data['company_name']}")
        print(f"✅ Current Level: {data['current_price']:.2f}")
        print(f"✅ Volatility Data Points: {len(data['volatility_sequence'])}")
        print(f"✅ Price History Points: {len(data['price_history'])}")
        print(f"✅ Date Points: {len(data['dates'])}")
        
        if data['volatility_stats']:
            stats = data['volatility_stats']
            print(f"✅ Latest Volatility: {stats['latest']*100:.2f}%")
            print(f"✅ Avg Volatility: {stats['mean']*100:.2f}%")
        
        print("\n🎯 S&P 500 data fetching test completed successfully!")
        
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_sp500_fix()

