import { validateBarcode } from '../utils/validators'

const FORMAT_PATTERNS = {
  'UPC-A': /^\d{12}$/,
  'UPC-E': /^\d{8}$/,
  'EAN-13': /^\d{13}$/,
  'EAN-8': /^\d{8}$/,
  'QR': /^[A-Za-z0-9\-_]+$/
}

export const detectFormat = (code) => {
  for (const [format, pattern] of Object.entries(FORMAT_PATTERNS)) {
    if (pattern.test(code)) return format
  }
  return 'Unknown'
}

export const parseBarcode = (code) => {
  const cleaned = code.trim()
  if (!validateBarcode(cleaned)) {
    return { valid: false, error: 'Invalid barcode format. Must be 8-13 digits.' }
  }
  return {
    valid: true,
    code: cleaned,
    format: detectFormat(cleaned),
    countryCode: cleaned.startsWith('0') ? 'US/CA'
      : cleaned.startsWith('4') ? 'Japan'
      : cleaned.startsWith('5') ? 'Europe'
      : cleaned.startsWith('6') ? 'Australia'
      : cleaned.startsWith('7') ? 'Europe'
      : cleaned.startsWith('8') ? 'Italy/Spain'
      : cleaned.startsWith('9') ? 'Austria'
      : 'Unknown'
  }
}

export const generateMockBarcode = () => {
  const prefixes = ['490', '480', '789', '690', '890', '570', '740', '871', '590']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const middle = String(Math.floor(Math.random() * 10000000)).padStart(7, '0')
  const code = prefix + middle
  return code.slice(0, 13)
}
