import React, { useState, useEffect } from 'react';
import './App.css';

interface Provider {
  name: string;
  btc: number;
  actualUsdAmount: number;
}

interface GuardarianResponse {
  converted_amount?: {
    amount: string;
  };
}

interface PaybisResponse {
  amountToEquivalent?: {
    amount: string;
  };
}

interface MoonPayResponse {
  baseCurrencyAmount?: number;
}

interface ApiProvider extends GuardarianResponse, PaybisResponse, MoonPayResponse {
  name: string;
  btc: number;
}

interface ApiResponse {
  providers: ApiProvider[];
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
      const data: ApiResponse = await response.json();
      
      const mappedProviders = data.providers.map((provider: ApiProvider) => ({
        name: provider.name,
        btc: provider.btc,
        actualUsdAmount: provider.name === 'Guardarian' ? parseFloat(provider.converted_amount?.amount || amount.toString()) :
                        provider.name === 'Paybis' ? parseFloat(provider.amountToEquivalent?.amount || amount.toString()) :
                        provider.name === 'MoonPay' ? (provider.baseCurrencyAmount || amount) :
                        amount
      }));
      
      setProviders(mappedProviders);
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

  const formatUSD = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getProviderColor = (index: number): string => {
    const colors = [
      'from-violet-500 to-fuchsia-500',
      'from-blue-500 to-indigo-500',
      'from-emerald-500 to-teal-500',
      'from-rose-500 to-pink-500'
    ];
    return colors[index] || colors[0];
  };

  const getBgPattern = (index: number): string => {
    const patterns = [
      'radial-gradient(circle at 100% 100%, rgba(167, 139, 250, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 0% 100%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 100% 0%, rgba(5, 150, 105, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 0% 0%, rgba(244, 63, 94, 0.1) 0%, transparent 50%)'
    ];
    return patterns[index] || patterns[0];
  };

  const getProviderUrl = (name: string): string => {
    const urls: { [key: string]: string } = {
      'Guardarian': 'https://guardarian.com',
      'Paybis': 'https://paybis.com',
      'Transak': 'https://transak.com',
      'MoonPay': 'https://www.moonpay.com'
    };
    return urls[name] || '#';
  };

  const getBestProvider = (): number => {
    if (providers.length === 0) return -1;
    return providers.reduce((maxIndex, current, currentIndex, array) => 
      current.btc > array[maxIndex].btc ? currentIndex : maxIndex
    , 0);
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] bg-gradient-to-br from-gray-900 via-[#1a1b3d] to-black text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rotate-12 transform scale-150" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/10 to-transparent -rotate-12 transform scale-150" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-blue-500/20 blur-3xl -z-10 transform -skew-y-6"></div>
          <div className="relative">
            <span className="inline-block text-sm font-semibold text-violet-400 mb-4 tracking-wider animate-float">
              REAL-TIME CRYPTO COMPARISON
            </span>
            <h1 className="text-7xl font-black mb-6 tracking-tight">
              <span className="inline-block gradient-text animate-pulse-slow">Bitcoin</span>
              <span className="inline-block ml-4 text-white/90">Rates</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Find the best Bitcoin prices across trusted providers. 
              <span className="block mt-2 text-violet-400/90">Save money on every transaction.</span>
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Live Prices
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Best Rates
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Trusted Providers
              </div>
            </div>
          </div>
        </div>
        
        {/* Input Section */}
        <div className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 blur-3xl" />
          <div className="relative glass rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <label className="block text-gray-400 text-sm font-medium mb-2">Amount in USD</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-black/30 text-4xl font-bold outline-none focus:ring-2 focus:ring-violet-500 rounded-xl p-4 transition-all duration-300"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={fetchPrices}
                className="px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity duration-300"
              >
                Compare Prices
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl text-center backdrop-blur-sm">
              <p className="text-lg">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 rounded-full border-t-2 border-violet-500 animate-spin" />
                <div className="absolute inset-2 rounded-full border-r-2 border-fuchsia-500 animate-spin-reverse" />
              </div>
              <p className="mt-4 text-gray-400">Fetching latest prices...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {providers.map((provider, index) => {
                const isBestProvider = index === getBestProvider();
                return (
                  <div
                    key={provider.name}
                    className={`transform transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 relative ${
                      isBestProvider ? 'animate-pulse-slow' : ''
                    }`}
                    style={{ background: getBgPattern(index) }}
                  >
                    {isBestProvider && (
                      <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 shadow-lg transform rotate-12">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    <div className={`bg-gradient-to-r ${getProviderColor(index)} p-[1px] rounded-2xl ${
                      isBestProvider ? 'shadow-lg shadow-violet-500/20' : ''
                    }`}>
                      <div className={`bg-gray-900/95 backdrop-blur-xl p-6 rounded-2xl ${
                        isBestProvider ? 'bg-opacity-95' : ''
                      }`}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className={`w-16 h-16 rounded-full bg-white/5 p-2 backdrop-blur-sm ${
                              isBestProvider ? 'ring-2 ring-yellow-400/50' : ''
                            }`}>
                              <img
                                src={`/images/${provider.name.toLowerCase()}.png`}
                                alt={provider.name}
                                className="w-full h-full object-contain filter drop-shadow-lg"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-bold text-white">{provider.name}</h3>
                                {isBestProvider && (
                                  <span className="text-yellow-400 text-sm font-semibold px-2 py-1 bg-yellow-400/10 rounded-full">
                                    Best Rate
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-300">
                                {isBestProvider ? 'Highest BTC for your money' : `Provider #${index + 1}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <div className="text-3xl font-bold font-mono tracking-tight text-white">
                              {formatBTC(provider.btc)} BTC
                            </div>
                            <div className="text-gray-300 mt-1">
                              {formatUSD(provider.actualUsdAmount)} USD
                              {provider.actualUsdAmount < amount && (
                                <span className="text-xs ml-2 text-gray-400">
                                  (after fees)
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {formatUSD(amount - provider.actualUsdAmount)} in fees
                            </div>
                            <a
                              href={getProviderUrl(provider.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`mt-3 inline-flex items-center gap-2 text-sm font-medium ${
                                isBestProvider 
                                  ? 'text-yellow-400 hover:text-yellow-300' 
                                  : 'text-violet-400 hover:text-violet-300'
                              } transition-colors`}
                            >
                              Visit {provider.name}
                              <svg 
                                className="w-4 h-4" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth="2" 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="glass rounded-xl p-6 border border-white/10">
            <p className="text-gray-400">
              Prices update in real-time. All fees and network costs included.
            </p>
            <p className="mt-4 text-sm">
              Made with{' '}
              <span className="text-red-500">❤️</span> by{' '}
              <a
                href="https://github.com/aal51282"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                aal51282
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;