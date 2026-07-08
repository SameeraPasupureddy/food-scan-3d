export const APP_NAME = 'BioScan 3D'
export const API_TIMEOUT = 8000
export const RETRY_MAX = 3
export const BARCODE_REGEX = /^\d{8,13}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const RISK_COLORS = {
  high: '#FF0040',
  medium: '#FF8C00',
  low: '#00FF88'
}

export const RISK_LEVELS = ['low', 'medium', 'high']

export const ORGAN_COLORS = {
  brain: '#8B5CF6',
  liver: '#FF8C00',
  kidneys: '#00F0FF',
  stomach: '#FFD700',
  heart: '#FF0040',
  lungs: '#3B82F6'
}

export const GAMIFICATION = {
  pointsPerScan: 10,
  streakBonus: 5,
  cleanProductBonus: 25,
  levels: [
    { level: 1, name: 'Scanner Novice', pointsNeeded: 0 },
    { level: 2, name: 'Label Reader', pointsNeeded: 100 },
    { level: 3, name: 'Ingredient Spotter', pointsNeeded: 250 },
    { level: 4, name: 'Health Analyst', pointsNeeded: 500 },
    { level: 5, name: 'Nutrition Master', pointsNeeded: 1000 },
    { level: 6, name: 'Wellness Guru', pointsNeeded: 2000 },
    { level: 7, name: 'BioScan Elite', pointsNeeded: 5000 }
  ]
}

export const SUSTAINABILITY = {
  scoreMax: 100,
  carbonPerKg: 2.5,
  waterPerKg: 1500
}

export const DIETARY_TAGS = ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-fat', 'low-sugar', 'organic', 'non-gmo']

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

export const EXPORT_FORMATS = ['csv', 'json', 'pdf']
