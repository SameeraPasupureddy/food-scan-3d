import { validateBarcode } from '../utils/validators'

const FORMAT_PATTERNS = {
  'UPC-A': /^\d{12}$/,
  'UPC-E': /^\d{8}$/,
  'EAN-13': /^\d{13}$/,
  'EAN-8': /^\d{8}$/,
  'GS1-128': /^\d{14}$/,
  'ITF-14': /^\d{14}$/,
  'QR': /^[A-Za-z0-9\-_./:]+$/
}

const COUNTRY_MAP = {
  '0': 'US/Canada', '1': 'US', '2': 'US',
  '3': 'France/Germany', '4': 'Japan',
  '5': 'UK/Europe', '6': 'Australia/NZ',
  '7': 'Europe (generic)', '8': 'Italy/Spain',
  '9': 'Austria/Scandinavia'
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

  const format = detectFormat(cleaned)
  const countryCode = COUNTRY_MAP[cleaned[0]] || 'Unknown'

  const checksum = (() => {
    if (cleaned.length < 8) return 'N/A'
    let sum = 0
    for (let i = 0; i < cleaned.length - 1; i++) {
      sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3)
    }
    const check = (10 - (sum % 10)) % 10
    return parseInt(cleaned[cleaned.length - 1]) === check ? 'Valid' : 'Invalid'
  })()

  return {
    valid: true,
    code: cleaned,
    format,
    countryCode,
    checksum,
    length: cleaned.length
  }
}

export const generateMockBarcode = (format = 'EAN-13') => {
  const prefixes = ['490', '480', '789', '690', '890', '570', '740', '871', '590', '200', '301', '400', '500']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  let code = prefix
  const targetLen = format === 'EAN-13' ? 13 : format === 'EAN-8' ? 8 : 12
  const remaining = targetLen - prefix.length - 1
  for (let i = 0; i < remaining; i++) {
    code += Math.floor(Math.random() * 10)
  }
  let sum = 0
  for (let i = 0; i < code.length; i++) {
    sum += parseInt(code[i]) * (i % 2 === 0 ? 1 : 3)
  }
  const checkDigit = (10 - (sum % 10)) % 10
  return code + checkDigit
}
