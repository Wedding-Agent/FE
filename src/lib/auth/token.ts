const ACCESS_TOKEN_KEY = 'promise-marry-access-token'
const REFRESH_TOKEN_KEY = 'promise-marry-refresh-token'

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function clearAllTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// JWT payload 파싱 (base64)
function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload) as Record<string, unknown>
  } catch {
    return null
  }
}

export function isAccessTokenExpired(): boolean {
  const token = getAccessToken()
  if (!token) return true
  const payload = parseJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return true
  // 30초 버퍼
  return payload.exp * 1000 < Date.now() + 30_000
}

export function getUserIdFromAccessToken(): number | null {
  const token = getAccessToken()
  if (!token) return null
  const payload = parseJwtPayload(token)
  if (!payload) return null
  const id = payload.sub ?? payload.userId ?? payload.id
  return typeof id === 'number' ? id : typeof id === 'string' ? parseInt(id, 10) : null
}
