const translations = {
  en: {
    app: { name: 'BioScan 3D', tagline: 'Intelligent Food Analysis' },
    nav: { dashboard: 'Dashboard', scan: 'Scan', community: 'Community', explore: 'Explore', settings: 'Settings' },
    scan: { barcode: 'Barcode Scan', visual: 'Visual Scan', manual: 'Manual Entry', start: 'Start Scanning', stop: 'Stop' },
    product: { molecular: 'Molecular View', anatomy: 'Anatomy View', alternatives: 'Alternatives', sustainability: 'Sustainability', pricing: 'Pricing' },
    auth: { login: 'Login', register: 'Register', email: 'Email', password: 'Password', forgot: 'Forgot Password?' },
    common: { loading: 'Loading...', error: 'Error', save: 'Save', cancel: 'Cancel', delete: 'Delete', search: 'Search' }
  },
  es: {
    app: { name: 'BioScan 3D', tagline: 'Análisis Inteligente de Alimentos' },
    nav: { dashboard: 'Panel', scan: 'Escanear', community: 'Comunidad', explore: 'Explorar', settings: 'Ajustes' },
    scan: { barcode: 'Escaneo de Código', visual: 'Escaneo Visual', manual: 'Entrada Manual', start: 'Iniciar', stop: 'Detener' },
    product: { molecular: 'Vista Molecular', anatomy: 'Vista Anatómica', alternatives: 'Alternativas', sustainability: 'Sostenibilidad', pricing: 'Precios' },
    auth: { login: 'Iniciar Sesión', register: 'Registrarse', email: 'Correo', password: 'Contraseña', forgot: '¿Olvidaste tu contraseña?' },
    common: { loading: 'Cargando...', error: 'Error', save: 'Guardar', cancel: 'Cancelar', delete: 'Eliminar', search: 'Buscar' }
  },
  fr: {
    app: { name: 'BioScan 3D', tagline: 'Analyse Alimentaire Intelligente' },
    nav: { dashboard: 'Tableau de Bord', scan: 'Scanner', community: 'Communauté', explore: 'Explorer', settings: 'Paramètres' }
  },
  de: {
    app: { name: 'BioScan 3D', tagline: 'Intelligente Lebensmittelanalyse' },
    nav: { dashboard: 'Dashboard', scan: 'Scannen', community: 'Community', explore: 'Erkunden', settings: 'Einstellungen' }
  },
  ja: {
    app: { name: 'BioScan 3D', tagline: 'インテリジェント食品分析' },
    nav: { dashboard: 'ダッシュボード', scan: 'スキャン', community: 'コミュニティ', explore: '探索', settings: '設定' }
  }
}

export const translate = (key, lang = 'en') => {
  const keys = key.split('.')
  let value = translations[lang]
  for (const k of keys) {
    if (!value) return key
    value = value[k]
  }
  return value || key
}

export const detectLanguage = () => {
  try {
    const lang = navigator.language?.split('-')[0]
    return translations[lang] ? lang : 'en'
  } catch {
    return 'en'
  }
}

export const getTranslatedIngredient = (name, lang) => {
  const dict = {
    sugar: { es: 'azúcar', fr: 'sucre', de: 'Zucker', ja: '砂糖' },
    salt: { es: 'sal', fr: 'sel', de: 'Salz', ja: '塩' },
    oil: { es: 'aceite', fr: 'huile', de: 'Öl', ja: '油' }
  }
  const key = name.toLowerCase().trim()
  return dict[key]?.[lang] || name
}
