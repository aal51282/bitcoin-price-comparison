import axios from "axios";

interface ProviderOffer {
  amount: number;
  error?: string;
}

async function getGuardarianOffer(amount: number): Promise<ProviderOffer> {
  try {
    const response = await axios.get(
      `https://api-payments.guardarian.com/v1/estimate?to_currency=BTC&from_amount=${amount}&from_currency=USD&from_network=USD&to_network=BTC`,
      {
        headers: {
          'X-Api-Key': 'c14d927f-cb01-4561-9520-28ec22c92710',
        }
      }
    );
    return { amount: Number(response.data.value) };
  } catch (error) {
    console.error('Error fetching Guardarian offer:', error);
    return { amount: 0, error: 'Failed to fetch Guardarian offer' };
  }
}

async function getPaybisOffer(amount: number): Promise<ProviderOffer> {
  try {
    const response = await axios.post('https://api.paybis.com/public/processing/v2/quote/buy-crypto', {
      "currencyCodeFrom": "USD",
      "currencyCodeTo": "BTC",
      "requestedAmount": { "amount": amount.toString(), "currencyCode": "USD" },
      "requestedAmountType": "from",
      "promoCode": null,
      "paymentMethod": "credit-card"
    });
    return { amount: Number(response.data?.paymentMethods?.[0]?.amountTo?.amount) };
  } catch (error) {
    console.error('Error fetching Paybis offer:', error);
    return { amount: 0, error: 'Failed to fetch Paybis offer' };
  }
}

async function getTransakOffer(amount: number): Promise<ProviderOffer> {
  try {
    const response = await axios.get(`https://api.transak.com/api/v1/pricing/public/quotes?fiatCurrency=USD&cryptoCurrency=BTC&paymentMethod=credit_debit_card&isBuyOrSell=BUY&fiatAmount=${amount}&partnerApiKey=02624956-010b-4775-8e31-7b9c8b82df76&network=mainnet`);
    return { amount: Number(response.data?.response?.cryptoAmount) };
  } catch (error) {
    console.error('Error fetching Transak offer:', error);
    return { amount: 0, error: 'Failed to fetch Transak offer' };
  }
}

async function getMoonPayOffer(amount: number): Promise<ProviderOffer> {
  try {
    const response = await axios.get(`https://api.moonpay.com/v3/currencies/btc/buy_quote?apiKey=pk_live_R5Lf25uBfNZyKwccAZpzcxuL3ZdJ3Hc&baseCurrencyAmount=${amount}&baseCurrencyCode=usd&fixed=true&areFeesIncluded=true&regionalPricing=true&quoteType=principal`);
    return { amount: Number(response.data.quoteCurrencyAmount) };
  } catch (error) {
    console.error('Error fetching MoonPay offer:', error);
    return { amount: 0, error: 'Failed to fetch MoonPay offer' };
  }
}

export async function getOffers(amount: number) {
  const [guardarian, paybis, transak, moonpay] = await Promise.all([
    getGuardarianOffer(amount),
    getPaybisOffer(amount),
    getTransakOffer(amount),
    getMoonPayOffer(amount)
  ]);

  return {
    guardarian: guardarian.amount,
    paybis: paybis.amount,
    transak: transak.amount,
    moonpay: moonpay.amount
  };
}
