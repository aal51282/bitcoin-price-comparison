from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from typing import Dict, List

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
    url = f"https://api.guardarian.com/v1/estimate?from_amount={amount}&from_currency=USD&to_currency=BTC"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            data = response.json()
            return float(data['estimated_amount'])
        except Exception as e:
            print(f"Guardarian API error: {str(e)}")
            return 0

async def get_paybis_price(amount: float) -> float:
    url = f"https://api.paybis.com/public/v2/market/estimate?fromCcy=USD&toCcy=BTC&amount={amount}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            data = response.json()
            return float(data['data']['toAmount'])
        except Exception as e:
            print(f"Paybis API error: {str(e)}")
            return 0

async def get_transak_price(amount: float) -> float:
    url = f"https://api.transak.com/api/v2/pricing/quote?fiatCurrency=USD&cryptoCurrency=BTC&amount={amount}"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            data = response.json()
            return float(data['response']['cryptoAmount'])
        except Exception as e:
            print(f"Transak API error: {str(e)}")
            return 0

async def get_moonpay_price(amount: float) -> float:
    url = f"https://api.moonpay.com/v3/currencies/btc/quote?baseCurrencyAmount={amount}&baseCurrencyCode=usd"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            data = response.json()
            return float(data['quoteCurrencyAmount'])
        except Exception as e:
            print(f"MoonPay API error: {str(e)}")
            return 0

@app.get("/api/compare/{amount}")
async def compare_prices(amount: float):
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