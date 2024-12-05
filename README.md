# Bitcoin Price Comparison Tool 🚀

A real-time Bitcoin price comparison tool that helps users find the best BTC rates across multiple providers. This application fetches and compares Bitcoin prices from four major cryptocurrency providers:

- Guardarian
- Paybis
- Transak
- MoonPay

## Features ✨

- Real-time price comparison
- Clean, modern UI
- Automatic sorting by best rates
- Support for USD to BTC conversion
- Includes fees and network costs in calculations

## Tech Stack 🛠️

### Backend
- FastAPI (Python)
- HTTPX for async HTTP requests
- Uvicorn ASGI server
- Python-dotenv for environment management

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Modern component architecture
- Responsive design

## Getting Started 🚦

### Prerequisites
- Python 3.9+
- Node.js 14+
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aal51282/coins-table
cd bitcoin-tracker
```

2. Set up the backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

3. Set up the frontend:
```bash
cd ../frontend
npm install
npm run dev
```

## Usage 💡

1. Enter the amount in USD you want to convert
2. The application will automatically fetch current rates from all providers
3. Results are displayed in order from highest to lowest BTC amount
4. Each provider shows the exact amount of BTC you would receive

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📝

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Guardarian API
- Paybis API
- Transak API
- MoonPay API

## Disclaimer ⚠️

This tool is for informational purposes only. Cryptocurrency prices are volatile and may vary across providers. Always verify the final price before making any transactions.
