#!/usr/bin/env python3
"""
Test script for FastAPI endpoints.
Run this to verify the FastAPI service endpoints are working correctly.
"""

import requests
import json

def test_fastapi_endpoints():
    """Test the FastAPI endpoints."""
    
    base_url = "http://localhost:8002"
    
    print("🧪 Testing FastAPI Endpoints")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health endpoint: OK")
        else:
            print(f"❌ Health endpoint: {response.status_code}")
    except Exception as e:
        print(f"❌ Health endpoint: {str(e)}")
    
    # Test volatility endpoint
    test_tickers = ['AAPL', 'TSLA']
    
    for ticker in test_tickers:
        print(f"\n📊 Testing volatility endpoint for {ticker}...")
        
        try:
            response = requests.get(f"{base_url}/v1/volatility/{ticker}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Volatility data fetched successfully")
                print(f"   Company: {data.get('company_name', 'N/A')}")
                print(f"   Data points: {len(data.get('volatility_sequence', []))}")
                if data.get('volatility_stats'):
                    stats = data['volatility_stats']
                    print(f"   Latest volatility: {stats.get('latest', 0)*100:.2f}%")
            else:
                print(f"❌ Volatility endpoint: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Volatility endpoint: {str(e)}")
    
    # Test stock info endpoint
    print(f"\n📈 Testing stock info endpoint for AAPL...")
    try:
        response = requests.get(f"{base_url}/v1/stock-info/AAPL")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Stock info fetched successfully")
            print(f"   Company: {data.get('company_name', 'N/A')}")
            print(f"   Sector: {data.get('sector', 'N/A')}")
            print(f"   Current Price: ${data.get('current_price', 0):.2f}")
        else:
            print(f"❌ Stock info endpoint: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Stock info endpoint: {str(e)}")
    
    # Test ticker validation
    print(f"\n🔍 Testing ticker validation...")
    test_tickers = ['AAPL', 'INVALID123']
    for ticker in test_tickers:
        try:
            response = requests.get(f"{base_url}/v1/validate-ticker/{ticker}")
            if response.status_code == 200:
                data = response.json()
                status = "✅" if data.get('valid') else "❌"
                print(f"{status} {ticker}: {'Valid' if data.get('valid') else 'Invalid'}")
            else:
                print(f"❌ Validation endpoint: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Validation endpoint: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎯 FastAPI endpoint testing completed!")

if __name__ == "__main__":
    test_fastapi_endpoints()
