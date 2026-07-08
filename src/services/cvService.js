const FOOD_DATABASE = {
  apple: { name: 'Apple', category: 'fruit', confidence: 0.96, nutrition: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4 } },
  banana: { name: 'Banana', category: 'fruit', confidence: 0.94, nutrition: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3 } },
  orange: { name: 'Orange', category: 'fruit', confidence: 0.93, nutrition: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3 } },
  broccoli: { name: 'Broccoli', category: 'vegetable', confidence: 0.91, nutrition: { calories: 55, protein: 4.2, carbs: 11, fat: 0.6, fiber: 5 } },
  carrot: { name: 'Carrot', category: 'vegetable', confidence: 0.92, nutrition: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2, fiber: 3 } },
  chicken: { name: 'Chicken Breast', category: 'meat', confidence: 0.88, nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 } },
  salmon: { name: 'Salmon Fillet', category: 'fish', confidence: 0.87, nutrition: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 } },
  rice: { name: 'White Rice', category: 'grain', confidence: 0.95, nutrition: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0 } },
  bread: { name: 'Whole Wheat Bread', category: 'grain', confidence: 0.89, nutrition: { calories: 69, protein: 3.6, carbs: 12, fat: 0.9, fiber: 2 } },
  egg: { name: 'Egg', category: 'protein', confidence: 0.93, nutrition: { calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0 } },
  tomato: { name: 'Tomato', category: 'vegetable', confidence: 0.9, nutrition: { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5 } },
  avocado: { name: 'Avocado', category: 'fruit', confidence: 0.88, nutrition: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 } }
}

const fuzzyMatch = (input) => {
  const cleaned = input.toLowerCase().replace(/[^a-z]/g, '')
  let bestMatch = null
  let bestScore = 0

  for (const [key, value] of Object.entries(FOOD_DATABASE)) {
    let score = 0
    if (cleaned.includes(key)) score = value.confidence
    else if (key.includes(cleaned)) score = value.confidence * 0.8
    else {
      let matches = 0
      for (let i = 0; i < Math.min(cleaned.length, key.length); i++) {
        if (cleaned[i] === key[i]) matches++
      }
      score = (matches / Math.max(cleaned.length, key.length)) * value.confidence * 0.7
    }
    if (score > bestScore) {
      bestScore = score
      bestMatch = { ...value, confidence: Math.round(score * 100) / 100 }
    }
  }

  return bestMatch
}

export const analyzeFoodImage = async (imageData) => {
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700))

  const mockDetections = [
    FOOD_DATABASE.apple,
    FOOD_DATABASE.banana,
    FOOD_DATABASE.broccoli,
  ]

  const primary = mockDetections[Math.floor(Math.random() * mockDetections.length)]

  return {
    success: true,
    detections: mockDetections.slice(0, 3).map(d => ({
      foodType: d.name,
      confidence: d.confidence - Math.random() * 0.15,
      category: d.category
    })),
    primaryMatch: primary.name,
    nutritionProfile: primary.nutrition,
    inferenceTime: `${(Math.random() * 200 + 100).toFixed(0)}ms`
  }
}

export const analyzeFoodText = (foodName) => {
  const result = fuzzyMatch(foodName)
  if (!result) return { success: false, error: 'Unknown food item' }
  return {
    success: true,
    detections: [{ foodType: result.name, confidence: result.confidence, category: result.category }],
    primaryMatch: result.name,
    nutritionProfile: result.nutrition,
    inferenceTime: '42ms'
  }
}
