import React, { useState, useEffect } from 'react';
import './App.css';

interface Provider {
  name: string;
  btc: number;
}

function App() {
  const [amount, setAmount] = useState<number>(100);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPrices();
  }, [amount]);

  const fetchPrices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/compare/${amount}`);
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setError('Failed to fetch prices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatBTC = (value: number): string => {
    return value.toFixed(8);
  };

  const getProviderColor = (index: number): string => {
    const colors = [
      'from-purple-500 to-blue-500',
      'from-blue-500 to-cyan-500',
      'from-cyan-500 to-teal-500',
      'from-teal-500 to-green-500'
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            FIND CHEAPEST BTC
          </h1>
          <p className="text-gray-400">Compare Bitcoin prices across major providers</p>
        </div>
        
        {/* Input Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <div className="flex-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-transparent text-3xl font-bold outline-none focus:ring-2 focus:ring-purple-500 rounded-lg p-2"
                placeholder="Enter USD amount"
              />
            </div>
            <div className="text-3xl font-bold text-gray-400">USD</div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            providers.map((provider, index) => (
              <div
                key={provider.name}
                className={`transform transition-all duration-300 hover:scale-[1.02] cursor-pointer`}
              >
                <div className={`bg-gradient-to-r ${getProviderColor(index)} p-[1px] rounded-xl`}>
                  <div className="bg-gray-900 p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={`/images/${provider.name.toLowerCase()}.png`}
                          alt={provider.name}
                          className="w-10 h-10 object-contain"
                        />
                        <span className="text-xl font-semibold">{provider.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold font-mono">
                          {formatBTC(provider.btc)} BTC
                        </div>
                        <div className="text-sm text-gray-400">
                          ≈ ${(provider.btc * 40000).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Prices update in real-time. All fees included.</p>
          <p className="mt-2">
            Made with ❤️ by{' '}
            <a
              href="https://github.com/aal51282"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-400"
            >
              aal51282
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;