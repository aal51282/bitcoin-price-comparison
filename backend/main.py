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

@app.get("/api/compare/{amount}")
async def compare_prices(amount: float):
    # Get prices from both providers
    guardarian_amount = await get_guardarian_price(amount)
    paybis_amount = await get_paybis_price(amount)
    
    providers = [
        {"name": "Guardarian", "btc": guardarian_amount},
        {"name": "Paybis", "btc": paybis_amount}
    ]
    
    # Sort providers by BTC amount (highest to lowest)
    sorted_providers = sorted(providers, key=lambda x: x['btc'], reverse=True)
    
    return {"providers": sorted_providers}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 