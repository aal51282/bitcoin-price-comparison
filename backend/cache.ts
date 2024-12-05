const { saveCachedOffers, getCachedForProvider } = require('./database')
const { getAllOffers } = require('./providers')

export async function cacheOffers() {
  const offers = await getAllOffers(100)
  const offersData = Object.keys(offers).map(provider => ({
    provider,
    btc: offers[provider],
  }))
  await saveCachedOffers(offersData)
  return { message: 'ok' }
}

export async function getOffers() {
  const providers = ['guardarian', 'moonpay', 'transak', 'paybis']
  const results = await Promise.all(
    providers.map(provider => getCachedForProvider(provider))
  )
  return results.reduce((acc, result, index) => {
    if (result) {
      acc[providers[index]] = result.btc
    }
    return acc
  }, {})
}

module.exports = { cacheOffers, getOffers }
