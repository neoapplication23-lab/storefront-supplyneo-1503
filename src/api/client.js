/**
 * API client for the React storefront.
 *
 * Priority order for API base URL:
 *  1. window.__SN_API_BASE__  (injected by the Laravel storefront.blade.php)
 *  2. VITE_API_URL env var     (dev overrides)
 *  3. https://supplyneo.com/admin/api.php  (legacy fallback for old PHP API)
 *
 * When served from Laravel the API is at /api/booking/{code}
 * When served from the old cPanel the API is at api.php?action=get_booking&code=...
 */

function resolveApiBase() {
  // Laravel shell sets this global
  if (typeof window !== 'undefined' && window.__SN_API_BASE__) {
    return window.__SN_API_BASE__
  }
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'https://supplyneo.com/admin/api.php'
  }
  return 'https://supplyneo.com/admin/api.php'
}

const BASE = resolveApiBase()

/**
 * Detect whether we're using the new Laravel REST API or the old PHP action API.
 * Laravel API: BASE ends with /api  (e.g. https://app.supplyneo.com/api)
 * Old API:     BASE ends with api.php
 */
const IS_LARAVEL = !BASE.endsWith('api.php')

async function request(action, data = {}, method = 'GET') {
  let url, opts = { method }

  if (IS_LARAVEL) {
    // Laravel REST style: GET /api/booking/{code}  POST /api/booking/{code}
    const code = data.code || (typeof window !== 'undefined' && window.__SN_BOOKING_CODE__) || ''
    url = new URL(`${BASE}/booking/${code}`, window.location.origin)

    if (method === 'GET') {
      // No extra params needed — code is in the path
    } else {
      opts.headers = { 'Content-Type': 'application/json' }
      opts.body = JSON.stringify(data)
    }
  } else {
    // Legacy PHP action API
    url = new URL(BASE)
    url.searchParams.set('action', action)

    if (method === 'GET') {
      Object.entries(data).forEach(([k, v]) => url.searchParams.set(k, v))
    } else {
      opts.headers = { 'Content-Type': 'application/json' }
      opts.body = JSON.stringify(data)
    }
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
