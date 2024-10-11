import axios from "axios";

export async function getOfferFromPaybis(amount:number): Promise<string|void> {
    try {
        const response = await
            axios.post('https://api.paybis.com/public/processing/v2/quote/buy-crypto',
            {"currencyCodeFrom":"USD",
            "currencyCodeTo":"BTC",
            "requestedAmount":{"amount":amount.toString(),"currencyCode":"USD"},
            "requestedAmountType":"from",
            "promoCode":null,
            "paymentMethod":"credit-card"
        });
        return response.data?.paymentMethods?.[0]?.amountTo?.amount.toString();
    } catch (e) {
        console.error(e);
        return;
    }
}

export async function getOfferFromGuardarian(amount:number): Promise<string|void> {
    try {
        const response = await
        axios.get(`https://api-payments.guardarian.com/v1/estimate?from_amount=${amount}&from_currency=USD&to_currency=BTC&platform=web&from_network=USD&to_network=BTC`,
            {
                headers: {
                    'X-Api-Key': 'b9ee06c9-269d-4260-8cc5-1301da21197b',
                }
            }
        );
        return response?.data?.value?.toString();
    } catch (e) {
        console.error(e);
        return;
    }
}