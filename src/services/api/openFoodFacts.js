import { validateBarcode } from '../../utils/validators'
import productsData from '../../data/products.json'

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2'
const USER_AGENT = 'BioScan3D/3.0 (https://github.com/SameeraPasupureddy/food-scan-3d; samee@example.com)'
const REQUEST_TIMEOUT = 8000
const MAX_RETRIES = 3
const USE_MOCK = true

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

const fetchWithRetry = async (url, retries = MAX_RETRIES) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT }
      })
      clearTimeout(timeoutId)
      if (!response.ok) {
        if (response.status === 429 && attempt < retries) {
          const wait = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 1000, 10000)
          await sleep(wait)
          continue
        }
        throw new Error(`OpenFoodFacts HTTP ${response.status}`)
      }
      return await response.json()
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        if (attempt < retries) { await sleep(1000 * attempt); continue }
        throw new Error('Request timed out after 8s')
      }
      if (attempt === retries) throw err
      await sleep(Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 8000))
    }
  }
}

const enrichWithLocalData = (product) => {
  const local = productsData.find(p => p.barcode === product.code)
  if (!local) return product
  return { ...product, ...local, ingredients: local.ingredients, nutrition: local.nutrition, sustainability: local.sustainability, prices: local.prices }
}

export const fetchProductByBarcode = async (barcode) => {
  if (!validateBarcode(barcode)) throw new Error('Invalid barcode format. Must be 8-13 digits.')

  if (USE_MOCK) {
    await sleep(400 + Math.random() * 600)
    const product = productsData.find(p => p.barcode === barcode)
    if (!product) throw new Error('Product not found in database')
    return {
      status: 1,
      code: barcode,
      product: enrichWithLocalData({
        code: barcode,
        product_name: product.name,
        product_name_en: product.name,
        brands: product.brand,
        categories: product.category,
        image_url: product.image,
        ingredients_text: product.ingredients.map(i => i.name).join(', '),
        nutriments: product.nutrition,
        _local: product
      })
    }
  }

  return fetchWithRetry(`${OFF_BASE}/product/${barcode}.json`)
}

export const searchProducts = async (query, page = 1, pageSize = 20) => {
  if (!query || query.trim().length < 2) throw new Error('Search query must be at least 2 characters')
  const sanitized = query.trim().slice(0, 100)

  if (USE_MOCK) {
    await sleep(300 + Math.random() * 400)
    const q = sanitized.toLowerCase()
    const results = productsData.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.ingredients.some(i => i.name.toLowerCase().includes(q))
    )
    return { products: results.slice(0, pageSize), total: results.length, page, pageSize }
  }

  return fetchWithRetry(`${OFF_BASE}/search?search_terms=${encodeURIComponent(sanitized)}&page=${page}&page_size=${pageSize}`)
}

export const fetchProductByCategory = async (category, page = 1) => {
  if (USE_MOCK) {
    await sleep(300)
    const results = productsData.filter(p => p.category === category)
    return { products: results, total: results.length, page }
  }
  return fetchWithRetry(`${OFF_BASE}/category/${encodeURIComponent(category)}/${page}.json`)
}
