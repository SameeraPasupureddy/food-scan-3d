const createNotification = (type, title, message, severity = 'low') => ({
  id: `notif-${Date.now()}`,
  type,
  title,
  message,
  timestamp: new Date().toISOString(),
  read: false,
  severity
})

export const generateAllergenWarning = (allergen, organs, severity) => {
  return createNotification(
    'allergen',
    `⚠️ Allergen Alert: ${allergen}`,
    `${allergen} detected! May affect ${organs.join(', ')}.`,
    severity
  )
}

export const generatePriceDropAlert = (productName, storeName, oldPrice, newPrice) => {
  const savings = ((oldPrice - newPrice) / oldPrice * 100).toFixed(0)
  return createNotification(
    'price_drop',
    '💵 Price Drop!',
    `${productName} now ${newPrice} at ${storeName} (${savings}% off)`,
    'low'
  )
}

export const generateWeeklyInsight = (scansThisWeek, hazardChange) => {
  const direction = hazardChange < 0 ? 'decreased' : 'increased'
  return createNotification(
    'insight',
    '📊 Weekly Insight',
    `You scanned ${scansThisWeek} products. Your average hazard score ${direction} by ${Math.abs(hazardChange)}%!`,
    'low'
  )
}

export const generateBadgeAlert = (badgeName) => {
  return createNotification(
    'badge',
    '🏆 Badge Unlocked!',
    `You earned the "${badgeName}" badge!`,
    'low'
  )
}

export const generateNewProductAlert = (productName) => {
  return createNotification(
    'new_product',
    '🆕 New Product Available',
    `${productName} has been added to the database with a sustainability score.`,
    'low'
  )
}
