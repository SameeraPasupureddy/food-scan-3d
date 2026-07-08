const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', native: '한국어' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', native: '中文' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱', native: 'Polski' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪', native: 'Svenska' },
  { code: 'da', name: 'Danish', flag: '🇩🇰', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮', native: 'Suomi' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴', native: 'Norsk' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿', native: 'Čeština' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺', native: 'Magyar' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴', native: 'Română' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦', native: 'Українська' },
  { code: 'el', name: 'Greek', flag: '🇬🇷', native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱', native: 'עברית' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' }
]

const translations = {
  en: {
    app: { name: 'BioScan 3D', tagline: 'Intelligent Food Analysis' },
    nav: { dashboard: 'Dashboard', scan: 'Scan', community: 'Community', explore: 'Explore', settings: 'Settings', history: 'History' },
    scan: { barcode: 'Barcode Scan', visual: 'Visual Scan', manual: 'Manual Entry', start: 'Start Scanning', stop: 'Stop', detecting: 'Detecting...' },
    product: { molecular: 'Molecular View', anatomy: 'Anatomy View', alternatives: 'Alternatives', sustainability: 'Sustainability', pricing: 'Pricing', nutrition: 'Nutrition Facts', ingredients: 'Ingredients', comments: 'Reviews' },
    auth: { login: 'Login', register: 'Register', email: 'Email', password: 'Password', forgot: 'Forgot Password?', signIn: 'Sign In' },
    dashboard: { overview: 'Overview', analytics: 'Analytics', mealPlans: 'Meal Plans', achievements: 'Achievements' },
    sustainability: { score: 'Sustainability Score', carbon: 'Carbon Footprint', water: 'Water Usage', certifications: 'Certifications' },
    common: { loading: 'Loading...', error: 'Error', save: 'Save', cancel: 'Cancel', delete: 'Delete', search: 'Search', back: 'Back', next: 'Next', close: 'Close', noData: 'No data available' },
    gamification: { points: 'Points', level: 'Level', streak: 'Streak', badges: 'Badges', leaderboard: 'Leaderboard' },
    community: { comments: 'Comments', share: 'Share', follow: 'Follow', unfollow: 'Unfollow', reviews: 'Reviews' },
    alerts: { allergenWarning: 'Allergen Detected!', priceDrop: 'Price Drop!', weeklyInsight: 'Weekly Insight', badgeUnlocked: 'Badge Unlocked!' }
  },
  es: {
    app: { name: 'BioScan 3D', tagline: 'Análisis Inteligente de Alimentos' },
    nav: { dashboard: 'Panel', scan: 'Escanear', community: 'Comunidad', explore: 'Explorar', settings: 'Ajustes', history: 'Historial' },
    scan: { barcode: 'Escaneo de Código', visual: 'Escaneo Visual', manual: 'Entrada Manual', start: 'Iniciar', stop: 'Detener', detecting: 'Detectando...' },
    product: { molecular: 'Vista Molecular', anatomy: 'Vista Anatómica', alternatives: 'Alternativas', sustainability: 'Sostenibilidad', pricing: 'Precios', nutrition: 'Información Nutricional', ingredients: 'Ingredientes', comments: 'Reseñas' },
    auth: { login: 'Iniciar Sesión', register: 'Registrarse', email: 'Correo', password: 'Contraseña', forgot: '¿Olvidaste tu contraseña?', signIn: 'Iniciar Sesión' },
    dashboard: { overview: 'Resumen', analytics: 'Analíticas', mealPlans: 'Plan de Comidas', achievements: 'Logros' },
    sustainability: { score: 'Puntuación de Sostenibilidad', carbon: 'Huella de Carbono', water: 'Uso de Agua', certifications: 'Certificaciones' },
    common: { loading: 'Cargando...', error: 'Error', save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', search: 'Buscar', back: 'Volver', next: 'Siguiente', close: 'Cerrar', noData: 'Sin datos disponibles' },
    gamification: { points: 'Puntos', level: 'Nivel', streak: 'Racha', badges: 'Insignias', leaderboard: 'Clasificación' },
    community: { comments: 'Comentarios', share: 'Compartir', follow: 'Seguir', unfollow: 'Dejar de Seguir', reviews: 'Reseñas' },
    alerts: { allergenWarning: '¡Alérgeno Detectado!', priceDrop: '¡Precio Rebajado!', weeklyInsight: 'Informe Semanal', badgeUnlocked: '¡Insignia Desbloqueada!' }
  }
}

const FALLBACK_LANG = 'en'

const getNestedTranslation = (obj, keys) => {
  let value = obj
  for (const key of keys) {
    if (!value || typeof value !== 'object') return null
    value = value[key]
  }
  return value
}

export const translate = (key, lang = FALLBACK_LANG) => {
  const keys = key.split('.')

  const exactLang = translations[lang]
  if (exactLang) {
    const result = getNestedTranslation(exactLang, keys)
    if (result) return result
  }

  const fallbackResult = getNestedTranslation(translations[FALLBACK_LANG], keys)
  if (fallbackResult) return fallbackResult

  return key
}

export const detectLanguage = () => {
  try {
    const lang = (navigator.language || '').split('-')[0]
    return translations[lang] ? lang : FALLBACK_LANG
  } catch {
    return FALLBACK_LANG
  }
}

export const getSupportedLanguages = () => SUPPORTED_LANGUAGES

export const getTranslatedIngredient = (name, lang) => {
  const dict = {
    sugar: { es: 'azúcar', fr: 'sucre', de: 'Zucker', ja: '砂糖', ko: '설탕', zh: '糖', hi: 'चीनी', ar: 'سكر', pt: 'açúcar', it: 'zucchero', ru: 'сахар', nl: 'suiker', pl: 'cukier', sv: 'socker' },
    salt: { es: 'sal', fr: 'sel', de: 'Salz', ja: '塩', ko: '소금', zh: '盐', hi: 'नमक', ar: 'ملح', pt: 'sal', it: 'sale', ru: 'соль', nl: 'zout', pl: 'sól', sv: 'salt' },
    oil: { es: 'aceite', fr: 'huile', de: 'Öl', ja: '油', ko: '기름', zh: '油', hi: 'तेल', ar: 'زيت', pt: 'óleo', it: 'olio', ru: 'масло', nl: 'olie', pl: 'olej', sv: 'olja' },
    water: { es: 'agua', fr: 'eau', de: 'Wasser', ja: '水', ko: '물', zh: '水', hi: 'पानी', ar: 'ماء', pt: 'água', it: 'acqua', ru: 'вода', nl: 'water', pl: 'woda', sv: 'vatten' },
    flour: { es: 'harina', fr: 'farine', de: 'Mehl', ja: '小麦粉', ko: '밀가루', zh: '面粉', hi: 'आटा', ar: 'طحين', pt: 'farinha', it: 'farina', ru: 'мука', nl: 'meel', pl: 'mąka', sv: 'mjöl' }
  }
  const key = name.toLowerCase().trim()
  const entry = dict[key]
  if (entry && entry[lang]) return entry[lang]
  return name
}

export const getAllergenWarning = (allergen, lang = FALLBACK_LANG) => {
  const warnings = {
    en: `⚠️ Allergen Alert: ${allergen} detected!`,
    es: `⚠️ Alerta de Alérgeno: ¡${allergen} detectado!`,
    fr: `⚠️ Alerte Allergène: ${allergen} détecté!`,
    de: `⚠️ Allergenwarnung: ${allergen} erkannt!`,
    ja: `⚠️ アレルゲン警告: ${allergen}が検出されました！`
  }
  return warnings[lang] || warnings[FALLBACK_LANG]
}
