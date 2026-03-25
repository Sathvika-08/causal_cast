#!/usr/bin/env python3
"""
Test script for Yahoo Finance integration.
Run this to verify the Yahoo Finance service is working correctly.
"""

import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

from utils.yahoo_finance import yahoo_service

def test_yahoo_finance():
    """Test the Yahoo Finance service with a few popular tickers."""
    
    test_tickers = ['^GSPC', 'AAPL', 'TSLA', 'MSFT', 'GOOGL']
    
    print("🧪 Testing Yahoo Finance Integration")
    print("=" * 50)
    
    for ticker in test_tickers:
        print(f"\n📊 Testing {ticker}...")
        
        try:
            # Test volatility data
            vol_data = yahoo_service.get_historical_volatility(ticker, period='6mo', window=30)
            
            if 'error' in vol_data:
                print(f"❌ Error: {vol_data['error']}")
                continue
                
            print(f"✅ Company: {vol_data['company_name']}")
            print(f"✅ Sector: {vol_data['sector']}")
            print(f"✅ Current Price: ${vol_data['current_price']:.2f}" if vol_data['current_price'] else "❌ No price data")
            print(f"✅ Volatility Data Points: {len(vol_data['volatility_sequence'])}")
            
            if vol_data['volatility_stats']:
                stats = vol_data['volatility_stats']
                print(f"✅ Latest Volatility: {stats['latest']*100:.2f}%")
                print(f"✅ Mean Volatility: {stats['mean']*100:.2f}%")
                print(f"✅ Volatility Range: {stats['min']*100:.2f}% - {stats['max']*100:.2f}%")
            
            # Show first few volatility values
            if vol_data['volatility_sequence']:
                first_few = vol_data['volatility_sequence'][:5]
                print(f"✅ Sample Volatility: {[f'{v:.4f}' for v in first_few]}")
            
        except Exception as e:
            print(f"❌ Exception: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 Test completed!")
    
    # Test ticker validation
    print("\n🔍 Testing ticker validation...")
    valid_tickers = ['AAPL', 'INVALID123', 'TSLA']
    for ticker in valid_tickers:
        is_valid = yahoo_service.validate_ticker(ticker)
        status = "✅" if is_valid else "❌"
        print(f"{status} {ticker}: {'Valid' if is_valid else 'Invalid'}")

if __name__ == "__main__":
    test_yahoo_finance()
