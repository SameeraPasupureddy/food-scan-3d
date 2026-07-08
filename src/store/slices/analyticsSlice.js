export const createAnalyticsSlice = (set, get) => ({
  totalScans: 0,
  averageHazardScore: 0,
  allergenExposure: [],
  nutritionTrends: [],
  streakDays: 0,
  isLoading: false,

  fetchAnalytics: async (userId) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 700))
    set({
      totalScans: Math.floor(Math.random() * 150) + 10,
      averageHazardScore: Math.floor(Math.random() * 40) + 15,
      allergenExposure: [
        { allergen: 'Sodium', count: 34, severity: 'high' },
        { allergen: 'Sugar', count: 28, severity: 'medium' },
        { allergen: 'Preservatives', count: 19, severity: 'high' },
        { allergen: 'Artificial Colors', count: 12, severity: 'medium' },
        { allergen: 'Gluten', count: 8, severity: 'low' },
        { allergen: 'Dairy', count: 6, severity: 'low' }
      ],
      nutritionTrends: Array.from({ length: 14 }, (_, i) => ({
        date: new Date(Date.now() - (13 - i) * 86400000).toISOString().split('T')[0],
        calories: Math.floor(Math.random() * 800) + 1400,
        protein: Math.floor(Math.random() * 40) + 50,
        carbs: Math.floor(Math.random() * 100) + 150,
        fat: Math.floor(Math.random() * 30) + 40
      })),
      streakDays: Math.floor(Math.random() * 20) + 1,
      isLoading: false
    })
  },

  exportData: async (format) => {
    await new Promise(r => setTimeout(r, 1000))
    const state = get()
    const data = {
      totalScans: state.totalScans,
      averageHazardScore: state.averageHazardScore,
      allergenExposure: state.allergenExposure,
      nutritionTrends: state.nutritionTrends,
      streakDays: state.streakDays,
      exportedAt: new Date().toISOString()
    }
    if (format === 'json') return { blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename: 'bioscan-data.json' }
    if (format === 'csv') {
      const rows = [['Metric', 'Value'], ...Object.entries(data).filter(([_, v]) => typeof v !== 'object').map(([k, v]) => [k, v])]
      const csv = rows.map(r => r.join(',')).join('\n')
      return { blob: new Blob([csv], { type: 'text/csv' }), filename: 'bioscan-data.csv' }
    }
    return { blob: new Blob([JSON.stringify(data, null, 2)], { type: 'application/pdf' }), filename: 'bioscan-data.pdf' }
  }
})
