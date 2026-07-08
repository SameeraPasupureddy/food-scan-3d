import additivesData from '../data/additives.json'
import alternativesData from '../data/alternatives.json'
import productsData from '../data/products.json'
import diseasesData from '../data/diseases.json'

const MOLECULAR_WEIGHTS = {
  'High Fructose Corn Syrup': 180.16, 'Aspartame': 294.3, 'Sodium Benzoate': 144.1,
  'Monosodium Glutamate': 169.1, 'TBHQ': 166.22, 'Red 40': 496.42,
  'Soy Lecithin': 750, 'Citric Acid': 192.12, 'Caffeine': 194.19,
  'Salt': 58.44, 'Disodium Inosinate': 392.17, 'Methylcellulose': 40000,
  'Natural Flavors': 200
}

const HAZARD_CLASSES = { high: 3, medium: 2, low: 1 }
const ADI_LIMITS = { high: 5, medium: 25, low: 100 }

const sigmoid = (x) => 1 / (1 + Math.exp(-x))
const relu = (x) => Math.max(0, x)
const tanh = (x) => Math.tanh(x)

const computeLevenshtein = (a, b) => {
  const m = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) m[i][0] = i
  for (let j = 0; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0))
  return m[a.length][b.length]
}

const computeCosineSimilarity = (textA, textB) => {
  const tokenize = (s) => s.toLowerCase().split(/[^a-z]/).filter(Boolean)
  const getFreq = (tokens) => {
    const freq = {}
    for (const t of tokens) freq[t] = (freq[t] || 0) + 1
    return freq
  }
  const freqA = getFreq(tokenize(textA))
  const freqB = getFreq(tokenize(textB))
  let dot = 0, normA = 0, normB = 0
  const allKeys = new Set([...Object.keys(freqA), ...Object.keys(freqB)])
  for (const k of allKeys) {
    const va = freqA[k] || 0; const vb = freqB[k] || 0
    dot += va * vb; normA += va * va; normB += vb * vb
  }
  return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0
}

export const mlModels = {

  /** Model 1: Toxicity Predictor — neural-network simulation */
  toxicityPredictor: (ingredient) => {
    if (!ingredient) return { score: 0, risk: 'unknown', confidence: 0 }

    const molWeight = MOLECULAR_WEIGHTS[ingredient.name] || 200
    const hazardClass = HAZARD_CLASSES[ingredient.risk] || 1
    const adiLimit = ADI_LIMITS[ingredient.risk] || 50

    const normalizedWeight = sigmoid((molWeight - 100) / 200)
    const normalizedHazard = hazardClass / 3
    const normalizedADI = sigmoid((50 - adiLimit) / 30)

    const layer1 = relu(normalizedWeight * 0.6 + normalizedHazard * 1.2 + normalizedADI * 0.4 - 0.3)
    const layer2 = tanh(layer1 * 1.5 - 0.2)
    const layer3 = sigmoid(layer2 * 1.8 - 0.5)

    const score = Math.round(layer3 * 100)
    const risk = score > 65 ? 'high' : score > 35 ? 'medium' : 'low'
    const confidence = Math.round((0.75 + Math.random() * 0.2) * 100) / 100

    return { score, risk, confidence, molecularWeight: molWeight, hazardClass, adiLimit }
  },

  /** Model 2: Ingredient Matcher — BERT-simulation via cosine similarity */
  ingredientMatcher: (query, candidates) => {
    const results = candidates.map(candidate => {
      const nameSim = computeCosineSimilarity(query, candidate.name)
      const descSim = candidate.description
        ? computeCosineSimilarity(query, candidate.description)
        : 0
      const levSim = 1 - computeLevenshtein(query.toLowerCase(), candidate.name.toLowerCase()) / Math.max(query.length, candidate.name.length)
      const combinedScore = nameSim * 0.5 + descSim * 0.3 + levSim * 0.2
      return { ...candidate, similarity: Math.round(combinedScore * 1000) / 1000 }
    })
    return results
      .filter(r => r.similarity > 0.15)
      .sort((a, b) => b.similarity - a.similarity)
  },

  /** Model 3: Health Risk Predictor — XGBoost-style formula */
  healthRiskPredictor: (product, userProfile = {}) => {
    if (!product || !product.ingredients) return { personalRiskScore: 0, factors: [] }

    const age = userProfile.age || 30
    const weight = userProfile.weight || 70
    const consumptionFreq = userProfile.consumptionFrequency || 3

    const factors = product.ingredients.map(ing => {
      const toxicity = mlModels.toxicityPredictor(ing)

      const ageWeight = age > 50 ? 1.3 : age > 35 ? 1.1 : 0.9
      const weightWeight = weight < 60 ? 1.2 : weight > 100 ? 1.1 : 1.0
      const freqWeight = 1 + (consumptionFreq - 1) * 0.15

      const rawScore = toxicity.score * ageWeight * weightWeight * freqWeight
      const cappedScore = Math.round(Math.min(100, rawScore))

      return {
        ingredient: ing.name,
        toxicityScore: toxicity.score,
        risk: toxicity.risk,
        adjustedScore: cappedScore,
        weights: { ageWeight, weightWeight, freqWeight }
      }
    })

    const personalRiskScore = Math.round(
      factors.reduce((sum, f) => sum + f.adjustedScore, 0) / Math.max(factors.length, 1)
    )

    return {
      personalRiskScore,
      riskLevel: personalRiskScore > 60 ? 'high' : personalRiskScore > 30 ? 'medium' : 'low',
      factors: factors.sort((a, b) => b.adjustedScore - a.adjustedScore),
      totalIngredients: product.ingredients.length,
      hazardousCount: factors.filter(f => f.risk === 'high').length
    }
  },

  /** Model 4: Alternative Recommender — KNN-simulation via feature matching */
  alternativeRecommender: (product, topK = 5) => {
    if (!product) return []

    const productFeatures = {
      category: product.category || '',
      riskProfile: product.ingredients
        ? product.ingredients.reduce((sum, i) => sum + (HAZARD_CLASSES[i.risk] || 0), 0) / Math.max(product.ingredients.length, 1)
        : 0,
      certScore: (product.certifications?.length || 0) * 10,
      sustainabilityScore: product.sustainability?.score || 50,
      price: product.prices?.[0]?.price || 5
    }

    const candidates = alternativesData.filter(a => a.productId !== product.id)
    const allProducts = productsData.filter(p => p.id !== product.id)

    const scored = allProducts.map(candidate => {
      const candidateFeatures = {
        category: candidate.category || '',
        riskProfile: candidate.ingredients
          ? candidate.ingredients.reduce((sum, i) => sum + (HAZARD_CLASSES[i.risk] || 0), 0) / Math.max(candidate.ingredients.length, 1)
          : 0,
        certScore: (candidate.certifications?.length || 0) * 10,
        sustainabilityScore: candidate.sustainability?.score || 50,
        price: candidate.prices?.[0]?.price || 5
      }

      const catSim = productFeatures.category === candidateFeatures.category ? 1 : 0
      const riskDist = 1 - Math.abs(productFeatures.riskProfile - candidateFeatures.riskProfile) / 3
      const certDist = Math.min(1, candidateFeatures.certScore / 30)
      const sustainDist = 1 - Math.abs(productFeatures.sustainabilityScore - candidateFeatures.sustainabilityScore) / 100
      const priceDist = 1 - Math.abs(productFeatures.price - candidateFeatures.price) / 10

      const totalScore = catSim * 0.25 + riskDist * 0.3 + certDist * 0.15 + sustainDist * 0.2 + priceDist * 0.1

      return {
        ...candidate,
        matchScore: Math.round(totalScore * 100) / 100,
        reasons: []
      }
    })

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore).slice(0, topK)
    sorted.forEach((item, i) => {
      const reasons = []
      if (item.certifications?.length > (product.certifications?.length || 0)) reasons.push('More certifications')
      if ((item.sustainability?.score || 0) > (product.sustainability?.score || 0)) reasons.push('Higher sustainability')
      if ((item.prices?.[0]?.price || 99) < (product.prices?.[0]?.price || 0)) reasons.push('Cheaper alternative')
      if (item.ingredients.filter(ing => ing.risk === 'high').length < product.ingredients.filter(ing => ing.risk === 'high').length) reasons.push('Fewer hazardous additives')
      item.reasons = reasons.length > 0 ? reasons : ['Alternative option']
      item.rank = i + 1
    })

    return sorted
  },

  /** Batch analysis — run all 4 models on a product */
  fullProductAnalysis: (product, userProfile = {}) => {
    if (!product) return null

    const toxicityResults = product.ingredients?.map(ing => ({
      ingredient: ing.name,
      ...mlModels.toxicityPredictor(ing)
    })) || []

    const healthRisk = mlModels.healthRiskPredictor(product, userProfile)
    const alternatives = mlModels.alternativeRecommender(product)

    const matchedAdditives = product.ingredients
      ? mlModels.ingredientMatcher(
          product.ingredients.map(i => i.name).join(' '),
          additivesData
        ).slice(0, 5)
      : []

    const relatedDiseases = healthRisk.factors
      .filter(f => f.risk === 'high' || f.risk === 'medium')
      .flatMap(f => {
        const add = additivesData.find(a => a.name === f.ingredient)
        return add ? add.chronicEffects || [] : []
      })
    const uniqueDiseases = [...new Set(relatedDiseases)].slice(0, 8)

    return {
      toxicityAnalysis: toxicityResults,
      healthRisk,
      alternatives,
      matchedAdditives,
      relatedDiseases: uniqueDiseases,
      riskSummary: {
        highCount: healthRisk.factors.filter(f => f.risk === 'high').length,
        mediumCount: healthRisk.factors.filter(f => f.risk === 'medium').length,
        lowCount: healthRisk.factors.filter(f => f.risk === 'low').length,
        overallScore: healthRisk.personalRiskScore,
        recommendation: healthRisk.personalRiskScore > 50
          ? 'Consider limiting consumption and seeking cleaner alternatives'
          : healthRisk.personalRiskScore > 25
          ? 'Moderate risk — consume in moderation'
          : 'Low risk — generally safe for regular consumption'
      }
    }
  }
}
