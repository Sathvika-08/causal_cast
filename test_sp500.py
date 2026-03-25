#!/usr/bin/env python3
"""
Test script for S&P 500 volatility data.
"""

from utils.yahoo_finance import yahoo_service

def test_sp500():
    """Test S&P 500 volatility data fetching."""
    
    print("🧪 Testing S&P 500 Volatility Data")
    print("=" * 50)
    
    try:
        # Test S&P 500 volatility data
        data = yahoo_service.get_historical_volatility('^GSPC', period='1y', window=30)
        
        if 'error' in data:
            print(f"❌ Error: {data['error']}")
            return
            
        print(f"✅ Index: {data['company_name']}")
        print(f"✅ Current Level: {data['current_price']:.2f}")
        print(f"✅ Data Points: {len(data['volatility_sequence'])}")
        
        if data['volatility_stats']:
            stats = data['volatility_stats']
            print(f"✅ Latest Volatility: {stats['latest']*100:.2f}%")
            print(f"✅ Avg Volatility: {stats['mean']*100:.2f}%")
            print(f"✅ Volatility Range: {stats['min']*100:.2f}% - {stats['max']*100:.2f}%")
        
        # Show first few volatility values
        if data['volatility_sequence']:
            first_few = data['volatility_sequence'][:5]
            print(f"✅ Sample Volatility: {[f'{v:.4f}' for v in first_few]}")
        
        print("\n🎯 S&P 500 test completed successfully!")
        
    except Exception as e:
        print(f"❌ Exception: {str(e)}")

if __name__ == "__main__":
    test_sp500()
