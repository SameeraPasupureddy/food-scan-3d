import mealPlansData from '../../data/mealPlans.json'

export const createMealPlanSlice = (set, get) => ({
  weeklyPlan: [],
  shoppingList: [],
  dietaryRestrictions: [],
  weightGoal: 'maintain',
  isLoading: false,

  generateMealPlan: async (preferences = {}) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 1000))
    const plan = mealPlansData.map(day => ({
      ...day,
      meals: day.meals.map(meal => ({
        ...meal,
        nutrition: {
          ...meal.nutrition,
          calories: preferences.weightGoal === 'lose'
            ? Math.round(meal.nutrition.calories * 0.8)
            : preferences.weightGoal === 'gain'
            ? Math.round(meal.nutrition.calories * 1.2)
            : meal.nutrition.calories
        }
      }))
    }))
    const allIngredients = [...new Set(plan.flatMap(d => d.meals.flatMap(m => m.ingredients)))]
    const list = allIngredients.map(item => ({
      item,
      quantity: '1 unit',
      category: item.includes('chicken') || item.includes('beef') || item.includes('turkey') || item.includes('shrimp') || item.includes('salmon') || item.includes('tuna') || item.includes('egg') ? 'protein'
        : item.includes('apple') || item.includes('banana') || item.includes('spinach') || item.includes('lettuce') || item.includes('broccoli') || item.includes('berry') || item.includes('carrot') || item.includes('kale') || item.includes('mushroom') || item.includes('tomato') || item.includes('pepper') || item.includes('onion') || item.includes('garlic') ? 'produce'
        : item.includes('oat') || item.includes('quinoa') || item.includes('rice') || item.includes('bread') || item.includes('tortilla') ? 'grains'
        : 'pantry'
    }))
    set({ weeklyPlan: plan, shoppingList: list, dietaryRestrictions: preferences.restrictions || [], weightGoal: preferences.weightGoal || 'maintain', isLoading: false })
  },

  regenerateMeal: (dayName, mealType) => {
    const state = get()
    const plan = [...state.weeklyPlan]
    const day = plan.find(d => d.day === dayName)
    if (!day) return
    const mealIdx = day.meals.findIndex(m => m.type === mealType)
    if (mealIdx === -1) return
    const backups = mealPlansData.find(d => d.day === dayName)?.meals
    if (!backups) return
    const original = backups[mealIdx]
    day.meals[mealIdx] = { ...original, nutrition: { ...original.nutrition } }
    set({ weeklyPlan: plan })
  },

  updateShoppingList: (list) => set({ shoppingList: list }),

  exportShoppingList: async () => {
    const { shoppingList } = get()
    const text = 'BioScan 3D - Shopping List\n' + '='.repeat(40) + '\n\n' +
      shoppingList.map(i => `[ ] ${i.item} - ${i.quantity} (${i.category})`).join('\n')
    return new Blob([text], { type: 'text/plain' })
  }
})
