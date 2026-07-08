import { API_TIMEOUT, RETRY_MAX } from '../../utils/constants'

export const fetchWithRetry = async (url, options = {}, retries = RETRY_MAX) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, { ...options, signal: controller.signal })
      clearTimeout(timeoutId)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (err) {
      clearTimeout(timeoutId)
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500))
    }
  }
}
