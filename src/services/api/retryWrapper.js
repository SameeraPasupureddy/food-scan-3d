export const exponentialBackoff = async (fn, maxRetries = 3, baseDelay = 500) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxRetries) throw err
      const jitter = Math.random() * baseDelay
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1) + jitter, 10000)
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

export const withTimeout = (promise, ms = 8000) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), ms)
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    })
  ]).finally(() => clearTimeout(timeout))
}
