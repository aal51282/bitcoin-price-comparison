import React, { useState, useEffect } from 'react';
import './App.css';

interface Provider {
  name: string;
  btc: number;
  logo: string;
}

function App() {
  const [amount, setAmount] = useState<number>(300);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPrices();
  }, [amount]);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/compare/${amount}`);
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          FIND CHEAPEST BTC
        </h1>
        
        <div className="flex items-center gap-2 mb-8 bg-[#1A1B2E] p-4 rounded-lg">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="bg-transparent text-2xl w-32 outline-none"
          />
          <span className="text-gray-400 text-2xl">USD</span>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            providers.map((provider) => (
              <div
                key={provider.name}
                className="flex items-center justify-between bg-[#1A1B2E] p-4 rounded-lg hover:bg-[#2A2B3E] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`/images/${provider.name.toLowerCase()}.png`}
                    alt={provider.name}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-lg">{provider.name}</span>
                </div>
                <span className="text-lg">
                  {provider.btc.toFixed(8)} BTC
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;