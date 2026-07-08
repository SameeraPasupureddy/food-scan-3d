import { BARCODE_REGEX, EMAIL_REGEX } from './constants'

export const validateBarcode = (code) => {
  if (!code || typeof code !== 'string') return false
  return BARCODE_REGEX.test(code.trim())
}

export const validateEmail = (email) => {
  if (!email) return false
  return EMAIL_REGEX.test(email.trim().toLowerCase())
}

export const validatePassword = (password) => {
  if (!password || password.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter'
  if (!/[0-9]/.test(password)) return 'Password must contain a number'
  return null
}

export const validateName = (name) => {
  if (!name || name.trim().length < 2) return 'Name must be at least 2 characters'
  return null
}

export const validateAge = (age) => {
  const n = Number(age)
  if (isNaN(n) || n < 1 || n > 150) return 'Enter a valid age (1-150)'
  return null
}

export const validateWeight = (weight) => {
  const n = Number(weight)
  if (isNaN(n) || n < 10 || n > 500) return 'Enter a valid weight (10-500 kg)'
  return null
}

export const sanitizeString = (str) => {
  if (!str) return ''
  return str.trim().replace(/<[^>]*>/g, '').slice(0, 500)
}
