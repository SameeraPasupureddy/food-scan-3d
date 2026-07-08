export const apiClient = {
  get: async (url) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`)
    return response.json()
  },
  post: async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`)
    return response.json()
  }
}
