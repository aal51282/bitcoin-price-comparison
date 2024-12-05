from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from typing import Dict, List
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_guardarian_price(amount: float) -> float:
    url = "https://api-payments.guardarian.com/v1/estimate"
    params = {
        'from_amount': str(amount),
        'from_currency': 'USD',
        'to_currency': 'BTC',
        'platform': 'web',
        'from_network': 'USD',
        'to_network': 'BTC'
    }
    
    headers = {
        'X-API-Key': 'b9ee06c9-269d-4260-8cc5-1301da21197b',
        'Accept': 'application/json',
        'Origin': 'https://guardarian.com',
        'Referer': 'https://guardarian.com/'
    }
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        try:
            response = await client.get(url, params=params, headers=headers)
            print(f"Guardarian request URL: {response.url}")
            print(f"Guardarian request headers: {headers}")
            print(f"Guardarian response: {response.status_code}, {response.text}")
            if response.status_code == 200:
                data = response.json()
                return float(data.get('value', 0))
            print(f"Guardarian API error: Status {response.status_code}, {response.text}")
            return 0
        except Exception as e:
            print(f"Guardarian API error: {str(e)}")
            return 0

async def get_paybis_price(amount: float) -> float:
    url = "https://api.paybis.com/public/processing/v2/quote/buy-crypto"
    
    # Format amount to 2 decimal places
    formatted_amount = "{:.2f}".format(amount)
    
    json_data = {
        "currencyCodeFrom": "USD",
        "currencyCodeTo": "BTC",
        "requestedAmount": {
            "amount": formatted_amount,
            "currencyCode": "USD"
        },
        "requestedAmountType": "from"
    }
    
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(url, json=json_data, headers=headers)
            print(f"Paybis request URL: {url}")
            print(f"Paybis request data: {json_data}")
            print(f"Paybis response: {response.status_code}, {response.text}")
            if response.status_code == 200:
                data = response.json()
                # Get the BTC amount from the first payment method
                if data.get('paymentMethods') and len(data['paymentMethods']) > 0:
                    return float(data['paymentMethods'][0]['amountTo']['amount'])
            print(f"Paybis API error: Status {response.status_code}, {response.text}")
            return 0
        except Exception as e:
            print(f"Paybis API error: {str(e)}")
            return 0

async def get_transak_price(amount: float) -> float:
    url = "https://api.transak.com/api/v1/pricing/public/widget/quotes"
    params = {
        'fiatCurrency': 'USD',
        'cryptoCurrency': 'BTC',
        'paymentMethod': 'credit_debit_card',
        'isBuyOrSell': 'BUY',
        'fiatAmount': str(amount),
        'partnerApiKey': '02624956-010b-4775-8e31-7b9c8b82df76',
        'network': 'bitcoin',
        'quoteCountryCode': 'US'
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            print(f"Transak request URL: {response.url}")
            print(f"Transak response: {response.status_code}, {response.text}")
            if response.status_code == 200:
                data = response.json()
                return float(data['response']['cryptoAmount'])
            print(f"Transak API error: Status {response.status_code}, {response.text}")
            return 0
        except Exception as e:
            print(f"Transak API error: {str(e)}")
            return 0

async def get_moonpay_price(amount: float) -> float:
    url = "https://api.moonpay.com/v3/currencies/btc/buy_quote"
    params = {
        'apiKey': 'pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc',
        'baseCurrencyAmount': str(amount),
        'baseCurrencyCode': 'usd',
        'fixed': 'true',
        'areFeesIncluded': 'true',
        'quoteType': 'principal'
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params)
            print(f"MoonPay request URL: {response.url}")
            print(f"MoonPay response: {response.status_code}, {response.text}")
            if response.status_code == 200:
                data = response.json()
                return float(data['quoteCurrencyAmount'])
            print(f"MoonPay API error: Status {response.status_code}, {response.text}")
            return 0
        except Exception as e:
            print(f"MoonPay API error: {str(e)}")
            return 0

@app.get("/api/compare/{amount}")
async def compare_prices(amount: float):
    # Get prices from all providers
    tasks = [
        get_guardarian_price(amount),
        get_paybis_price(amount),
        get_transak_price(amount),
        get_moonpay_price(amount)
    ]
    
    results = await asyncio.gather(*tasks)
    
    providers = [
        {"name": "Guardarian", "btc": results[0]},
        {"name": "Paybis", "btc": results[1]},
        {"name": "Transak", "btc": results[2]},
        {"name": "MoonPay", "btc": results[3]}
    ]
    
    # Sort providers by BTC amount (highest to lowest)
    sorted_providers = sorted(providers, key=lambda x: x['btc'], reverse=True)
    
    return {"providers": sorted_providers}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 