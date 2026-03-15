/**
 * Strips whitespace/newlines from base64 data URIs that cause ERR_INVALID_URL.
 * Returns a clean, usable src string or null if invalid.
 */
export function sanitizeImageSrc(src) {
  if (!src || typeof src !== 'string') return null
  if (src.startsWith('data:')) {
    // Strip all whitespace (spaces, newlines, tabs) from base64
    const clean = src.replace(/\s+/g, '')
    const commaIdx = clean.indexOf(',')
    if (commaIdx > 10 && commaIdx < clean.length - 10) return clean
    return null
  }
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  return null
}

/**
 * Returns true only if the string is a safe, usable image src.
 * Kept for backwards compatibility.
 */
export function isValidImageSrc(src) {
  return sanitizeImageSrc(src) !== null
}
