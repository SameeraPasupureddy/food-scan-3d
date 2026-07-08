import mealPlansData from '../data/mealPlans.json'

export const generateWeeklyPlan = (preferences = {}) => {
  const { restrictions = [], weightGoal = 'maintain' } = preferences

  let plan = mealPlansData.map(day => ({
    ...day,
    meals: day.meals.map(meal => {
      let adjustedCals = meal.nutrition.calories
      if (weightGoal === 'lose') adjustedCals = Math.round(adjustedCals * 0.8)
      if (weightGoal === 'gain') adjustedCals = Math.round(adjustedCals * 1.2)

      let filteredIngredients = meal.ingredients
      if (restrictions.includes('gluten-free')) {
        filteredIngredients = filteredIngredients.filter(i =>
          !['Whole wheat bread', 'Whole wheat wrap', 'Whole wheat dough', 'Oat flour', 'Rolled oats', 'Rice cakes'].includes(i)
        )
      }
      if (restrictions.includes('dairy-free')) {
        filteredIngredients = filteredIngredients.filter(i =>
          !['Feta cheese', 'Mozzarella', 'Low-fat cheese', 'Greek yogurt'].includes(i)
        )
      }
      if (restrictions.includes('vegan')) {
        filteredIngredients = filteredIngredients.filter(i =>
          !['Chicken breast', 'Turkey breast', 'Sirloin beef', 'Salmon fillet', 'Shrimp', 'Canned tuna', 'Chicken thigh', 'Egg', 'Egg whites', 'Feta cheese', 'Mozzarella', 'Low-fat cheese', 'Greek yogurt', 'Honey'].includes(i)
        )
      }

      return {
        ...meal,
        ingredients: filteredIngredients,
        nutrition: { ...meal.nutrition, calories: adjustedCals }
      }
    })
  }))

  const allIngredients = [...new Set(plan.flatMap(d => d.meals.flatMap(m => m.ingredients)))]
  const shoppingList = allIngredients.map(item => ({
    item,
    quantity: '1 pack',
    category: determineCategory(item)
  }))

  return { plan, shoppingList }
}

const determineCategory = (item) => {
  const produce = ['Rolled oats','Chia seeds','Blueberries','Strawberries','Spinach','Banana','Mango','Carrots','Celery','Onion','Garlic','Mixed greens','Cherry tomatoes','Cucumber','Lettuce','Tomato','Avocado','Bell peppers','Broccoli','Asparagus','Mushrooms','Sweet potato','Bok choy','Snap peas','Zucchini','Brussels sprouts','Potatoes','Red grapes','Kale','Herbs','Basil','Cilantro','Dill','Rosemary','Thyme','Lime','Lemon']
  const protein = ['Chicken breast','Turkey breast','Sirloin beef','Salmon fillet','Shrimp','Canned tuna','Chicken thigh','Tofu']
  const dairy = ['Feta cheese','Mozzarella','Low-fat cheese','Greek yogurt','Egg','Egg whites']
  const grains = ['Quinoa','Whole wheat bread','Whole wheat wrap','Whole wheat dough','Rice','Corn tortillas','Brown rice cakes','Oat flour']
  const pantry = ['Almond milk','Maple syrup','Balsamic vinegar','Olive oil','Soy sauce','Sesame oil','Coconut milk','Curry paste','Honey','Dijon mustard','Nutritional yeast','Tahini','Coconut water','Vanilla extract','Cumin','Turmeric','Red pepper flakes','Salt','Pepper','Everything seasoning']

  if (produce.includes(item)) return 'produce'
  if (protein.includes(item)) return 'protein'
  if (dairy.includes(item)) return 'dairy'
  if (grains.includes(item)) return 'grains'
  if (pantry.includes(item)) return 'pantry'
  return 'other'
}

export const calculateWeeklyNutrition = (plan) => {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  let mealCount = 0
  for (const day of plan) {
    for (const meal of day.meals) {
      totals.calories += meal.nutrition.calories
      totals.protein += meal.nutrition.protein
      totals.carbs += meal.nutrition.carbs
      totals.fat += meal.nutrition.fat
      mealCount++
    }
  }
  return {
    ...totals,
    dailyAverage: {
      calories: Math.round(totals.calories / 7),
      protein: Math.round(totals.protein / 7),
      carbs: Math.round(totals.carbs / 7),
      fat: Math.round(totals.fat / 7)
    }
  }
}
