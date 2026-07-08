import storesData from '../data/stores.json'
import { formatCurrency } from '../utils/formatters'

export const findCheapestStore = (prices) => {
  if (!prices || prices.length === 0) return null
  return prices.reduce((min, p) => p.price < min.price ? p : min, prices[0])
}

export const getPriceHistory = (productId, prices) => {
  if (!prices) return []
  return prices.sort((a, b) => new Date(a.date) - new Date(b.date))
}

export const calculateSavings = (currentPrice, alternativePrice) => {
  if (!currentPrice || !alternativePrice) return 0
  const diff = currentPrice - alternativePrice
  return {
    perUnit: formatCurrency(diff),
    perYear: formatCurrency(diff * 52),
    percentage: Math.round((diff / currentPrice) * 100)
  }
}

export const getNearbyStores = (productPrices) => {
  if (!productPrices) return storesData.slice(0, 5)
  return productPrices.map(pp => {
    const store = storesData.find(s => s.name === pp.store)
    return {
      ...pp,
      storeInfo: store || { name: pp.store, type: 'Unknown', priceLevel: '$$' }
    }
  })
}

export const getHistoricalTrend = (productId, allPrices) => {
  if (!allPrices || allPrices.length < 2) return { trend: 'stable', change: 0 }
  const sorted = [...allPrices].sort((a, b) => new Date(a.date) - new Date(b.date))
  const first = sorted[0].price
  const last = sorted[sorted.length - 1].price
  const change = ((last - first) / first) * 100
  return {
    trend: change > 5 ? 'rising' : change < -5 ? 'falling' : 'stable',
    change: Math.round(change * 10) / 10
  }
}
