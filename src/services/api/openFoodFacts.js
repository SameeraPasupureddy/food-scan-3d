import { fetchWithRetry } from './retryWrapper'
import { validateBarcode } from '../../utils/validators'
import productsData from '../../data/products.json'

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2'
const USE_MOCK = true

const enrichWithLocalData = (offProduct) => {
  const local = productsData.find(p => p.barcode === offProduct.code)
  if (!local) return offProduct
  return { ...offProduct, ...local, ingredients: local.ingredients, nutrition: local.nutrition, sustainability: local.sustainability, prices: local.prices }
}

export const fetchProductByBarcode = async (barcode) => {
  if (!validateBarcode(barcode)) throw new Error('Invalid barcode format')

  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    const product = productsData.find(p => p.barcode === barcode)
    if (!product) throw new Error('Product not found')
    return { status: 1, code: barcode, product: enrichWithLocalData({ code: barcode, product_name: product.name, brands: product.brand }) }
  }

  return fetchWithRetry(`${OFF_BASE}/product/${barcode}.json`)
}

export const searchProducts = async (query, page = 1) => {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 500))
    const results = productsData.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.brand.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    )
    return { products: results.slice(0, 20), total: results.length, page }
  }

  return fetchWithRetry(`${OFF_BASE}/search?search_terms=${encodeURIComponent(query)}&page=${page}&page_size=20`)
}
