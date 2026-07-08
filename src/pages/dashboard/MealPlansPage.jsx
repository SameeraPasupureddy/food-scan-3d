import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Spinner'
import { Tabs } from '../../components/ui/Tabs'

export const MealPlansPage = () => {
  const { weeklyPlan, shoppingList, isLoading, generateMealPlan, regenerateMeal, exportShoppingList } = useStore(s => ({
    weeklyPlan: s.weeklyPlan, shoppingList: s.shoppingList, isLoading: s.isLoading,
    generateMealPlan: s.generateMealPlan, regenerateMeal: s.regenerateMeal, exportShoppingList: s.exportShoppingList
  }))
  const user = useStore(s => s.user)
  const [activeDay, setActiveDay] = useState('Monday')
  const [showShopping, setShowShopping] = useState(false)

  useEffect(() => {
    if (weeklyPlan.length === 0) {
      generateMealPlan({
        restrictions: user?.dietaryRestrictions || [],
        weightGoal: user?.weightGoal || 'maintain'
      })
    }
  }, [])

  const handleExport = async () => {
    const blob = await exportShoppingList()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bioscan-shopping-list.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>

  const dayData = weeklyPlan.find(d => d.day === activeDay)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">7-Day Meal Plan</h1>
          <p className="text-gray-500 text-sm mt-1">Personalized nutrition based on your profile</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowShopping(!showShopping)}>
            {showShopping ? 'Hide List' : 'Shopping List'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>Export List</Button>
        </div>
      </div>

      {showShopping && shoppingList.length > 0 && (
        <Card>
          <CardHeader><CardTitle>🛒 Shopping List ({shoppingList.length} items)</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-2">
              {['produce', 'protein', 'dairy', 'grains', 'pantry', 'other'].map(cat => {
                const items = shoppingList.filter(i => i.category === cat)
                if (items.length === 0) return null
                return (
                  <div key={cat}>
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">{cat}</p>
                    {items.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 py-0.5">
                        <input type="checkbox" className="accent-accent-cyan" />
                        <span>{i.item}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {weeklyPlan.map(d => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              activeDay === d.day ? 'bg-accent-cyan text-deep-950' : 'bg-deep-800 text-gray-400 hover:text-white'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      {dayData && (
        <div className="grid sm:grid-cols-2 gap-4">
          {dayData.meals.map((meal, i) => (
            <Card key={i}>
              <CardHeader>
                <Badge variant="info" size="sm">{meal.type}</Badge>
                <Button variant="ghost" size="sm" onClick={() => regenerateMeal(activeDay, meal.type)}>↻</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <h3 className="text-base font-semibold text-white">{meal.name}</h3>
                <p className="text-xs text-gray-500">{meal.recipe}</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-1.5 bg-deep-900 rounded"><p className="text-sm font-bold text-accent-cyan">{meal.nutrition.calories}</p><p className="text-[10px] text-gray-500">cal</p></div>
                  <div className="text-center p-1.5 bg-deep-900 rounded"><p className="text-sm font-bold text-white">{meal.nutrition.protein}g</p><p className="text-[10px] text-gray-500">protein</p></div>
                  <div className="text-center p-1.5 bg-deep-900 rounded"><p className="text-sm font-bold text-white">{meal.nutrition.carbs}g</p><p className="text-[10px] text-gray-500">carbs</p></div>
                  <div className="text-center p-1.5 bg-deep-900 rounded"><p className="text-sm font-bold text-white">{meal.nutrition.fat}g</p><p className="text-[10px] text-gray-500">fat</p></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {meal.ingredients.map((ing, j) => (
                    <span key={j} className="text-[10px] bg-deep-900 text-gray-400 px-1.5 py-0.5 rounded">{ing}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
