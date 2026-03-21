/**
 * API client for the React storefront.
 *
 * Priority order for API base URL:
 *  1. window.__SN_API_BASE__  (injected by the Laravel storefront.blade.php)
 *  2. VITE_API_URL env var     (dev overrides)
 *  3. https://app.supplyneo.com/api  (production fallback — Laravel REST API)
 */

function resolveApiBase() {
  // Laravel shell sets this global when served embedded
  if (typeof window !== 'undefined' && window.__SN_API_BASE__) {
    return window.__SN_API_BASE__
  }
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'https://app.supplyneo.com/api'
  }
  // When served standalone from a subdomain (e.g. yachtcocatering.supplyneo.com)
  // always point to the central Laravel API
  return 'https://app.supplyneo.com/api'
}

const BASE = resolveApiBase()

/**
 * Always uses the Laravel REST API.
 * GET  /api/booking/{code}
 * POST /api/booking/{code}
 */
async function request(action, data = {}, method = 'GET') {
  const code = data.code || (typeof window !== 'undefined' && window.__SN_BOOKING_CODE__) || ''
  const url = new URL(`${BASE}/booking/${code}`, 'https://app.supplyneo.com')

  const opts = { method }

  if (method !== 'GET') {
    opts.headers = { 'Content-Type': 'application/json' }
    opts.body = JSON.stringify(data)
  }

  const res = await fetch(url.toString(), opts)

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`)
  }

  const json = await res.json()

  if (!json.ok) {
    throw new Error(json.error || 'API error')
  }

  return json.data
}

export const apiGet  = (action, data) => request(action, data, 'GET')
export const apiPost = (action, data) => request(action, data, 'POST')
