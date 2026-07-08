import productsData from '../../data/products.json'
import additivesData from '../../data/additives.json'
import alternativesData from '../../data/alternatives.json'

export const createProductSlice = (set, get) => ({
  currentProduct: null,
  viewMode: 'molecular',
  selectedAdditive: null,
  selectedOrgan: null,
  alternatives: [],
  loading: false,
  error: null,

  fetchProduct: async (identifier) => {
    set({ loading: true, error: null })
    await new Promise(r => setTimeout(r, 500))
    const product = productsData.find(p => p.barcode === identifier || p.id === identifier)
    if (!product) {
      set({ loading: false, error: 'Product not found' })
      return
    }
    const enriched = {
      ...product,
      ingredientDetails: product.ingredients.map(ing => {
        const add = additivesData.find(a => a.name === ing.name)
        return add ? { ...ing, ...add } : ing
      })
    }
    const alts = alternativesData.filter(a => a.productId === product.id)
    set({ currentProduct: enriched, alternatives: alts, loading: false, selectedAdditive: null, selectedOrgan: null })
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  selectAdditive: (additive) => set({ selectedAdditive: additive }),

  selectOrgan: (organ) => set({ selectedOrgan: organ }),

  clearProduct: () => set({ currentProduct: null, alternatives: [], selectedAdditive: null, selectedOrgan: null })
})
