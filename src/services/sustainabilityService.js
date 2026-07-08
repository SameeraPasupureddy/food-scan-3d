import { SUSTAINABILITY } from '../utils/constants'

export const calculateSustainabilityScore = (product) => {
  if (!product || !product.ingredients) return 0

  let score = 70

  const riskCounts = product.ingredients.reduce((acc, ing) => {
    if (ing.type === 'additive') acc[ing.risk] = (acc[ing.risk] || 0) + 1
    return acc
  }, {})

  score -= (riskCounts.high || 0) * 15
  score -= (riskCounts.medium || 0) * 8
  score -= (riskCounts.low || 0) * 2

  if (product.certifications?.includes('organic')) score += 10
  if (product.certifications?.includes('fair_trade')) score += 5
  if (product.certifications?.includes('gmo_free')) score += 5
  if (product.certifications?.includes('vegan')) score += 3

  if (product.packaging?.toLowerCase().includes('recyclable')) score += 5
  if (product.packaging?.toLowerCase().includes('plastic')) score -= 5

  return Math.max(0, Math.min(100, score))
}

export const estimateCarbonFootprint = (product) => {
  if (!product?.category) return SUSTAINABILITY.carbonPerKg
  const factors = {
    meat: 5.0, fish: 3.0, dairy: 2.5, frozen: 3.5,
    snacks: 2.0, beverages: 1.5, grains: 0.8, produce: 0.3
  }
  return factors[product.category] || SUSTAINABILITY.carbonPerKg
}

export const estimateWaterUsage = (product) => {
  if (!product?.category) return SUSTAINABILITY.waterPerKg
  const factors = {
    meat: 4500, fish: 2000, dairy: 1500, frozen: 2500,
    snacks: 800, beverages: 1200, grains: 350, produce: 150
  }
  return factors[product.category] || SUSTAINABILITY.waterPerKg
}

export const getCertificationBadges = (product) => {
  const badges = []
  if (product.certifications?.includes('organic')) badges.push({ label: 'USDA Organic', color: 'green', icon: '🌱' })
  if (product.certifications?.includes('fair_trade')) badges.push({ label: 'Fair Trade', color: 'blue', icon: '🤝' })
  if (product.certifications?.includes('gmo_free')) badges.push({ label: 'Non-GMO', color: 'amber', icon: '🧬' })
  if (product.certifications?.includes('vegan')) badges.push({ label: 'Vegan', color: 'green', icon: '🌿' })
  return badges
}
