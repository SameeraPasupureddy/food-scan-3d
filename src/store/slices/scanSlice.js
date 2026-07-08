export const createScanSlice = (set, get) => ({
  currentScan: null,
  scanHistory: [],
  isScanning: false,
  cameraActive: false,
  detectedCode: null,
  yoloResults: null,

  setScanning: (val) => set({ isScanning: val }),
  setCameraActive: (val) => set({ cameraActive: val }),
  setDetectedCode: (code) => set({ detectedCode: code }),

  processBarcode: async (code) => {
    set({ isScanning: true, currentScan: { type: 'barcode', status: 'processing', code } })
    await new Promise(r => setTimeout(r, 800))
    const entry = {
      id: `scan-${Date.now()}`,
      code,
      method: 'barcode',
      timestamp: new Date().toISOString(),
      status: 'completed'
    }
    set(state => ({
      scanHistory: [entry, ...state.scanHistory],
      currentScan: { ...state.currentScan, status: 'completed' },
      isScanning: false,
      detectedCode: code
    }))
    return entry
  },

  processVisualScan: async (imageData) => {
    set({ isScanning: true, currentScan: { type: 'visual', status: 'processing' } })
    await new Promise(r => setTimeout(r, 1500))
    const mockResults = {
      detectedFoods: [
        { foodType: 'Apple', confidence: 0.96 },
        { foodType: 'Fruit', confidence: 0.89 },
        { foodType: 'Produce', confidence: 0.72 }
      ],
      primaryMatch: 'Apple',
      nutritionProfile: {
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
        fiber: 4
      }
    }
    set({ yoloResults: mockResults, isScanning: false, currentScan: { type: 'visual', status: 'completed', results: mockResults } })
    return mockResults
  },

  addToHistory: (entry) => {
    set(state => ({ scanHistory: [entry, ...state.scanHistory] }))
  },

  clearScanHistory: () => set({ scanHistory: [] })
})
