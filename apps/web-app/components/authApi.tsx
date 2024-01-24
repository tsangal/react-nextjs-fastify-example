import Cookies from 'js-cookie'

export const AUTH_REFRESH_GRACE_PERIOD_SECONDS = 60

const REFRESH_TOKEN_EXPIRY_COOKIE = 'refresh_token_expiry'

export interface User {
  id: string
  name: string
}

export interface AuthResult {
  success: boolean
  errorMessage?: string
  user?: User
  authToken?: string
  refreshTokenExpiry?: number
}

export function useAuthApi() {
  async function postUserPasswordLogin(
    username: string,
    password: string
  ): Promise<AuthResult> {
    const res = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: 'include',
    })
    if (!res.ok) {
      console.error(res)
    }
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw Error('Login failed.')
    }
    processAuth(data)
    return data
  }

  async function refreshAuthToken(): Promise<AuthResult> {
    const res = await fetch('http://localhost:3001/users/refreshAuth', {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      console.error(res)
    }
    const data = await res.json()
    processAuth(data)
    return data
  }

  async function sendUserLogout(): Promise<void> {
    removeRefreshTokenExpiryCookie()
    await fetch('http://localhost:3001/users/logout', {
      method: 'POST',
      credentials: 'include',
    })
  }

  function getRefreshTokenExpiryCookie(): string | undefined {
    const refreshTokenExpiry = Cookies.get(REFRESH_TOKEN_EXPIRY_COOKIE)
    console.debug(
      'refreshTokenExpiry cookie value',
      refreshTokenExpiry,
      new Date(Number(refreshTokenExpiry) * 1000)
    )

    return refreshTokenExpiry
  }

  function removeRefreshTokenExpiryCookie(): void {
    Cookies.remove(REFRESH_TOKEN_EXPIRY_COOKIE, { path: '/' })
  }

  function processAuth(data: AuthResult): void {
    if (data.refreshTokenExpiry) {
      console.debug(
        'Refresh token expiry:',
        new Date(data.refreshTokenExpiry).toString()
      )
    } else {
      console.error('No refresh token found in auth data.')
    }
  }

  return {
    postUserPasswordLogin,
    refreshAuthToken,
    sendUserLogout,
    getRefreshTokenExpiryCookie,
    removeRefreshTokenExpiryCookie,
  }
}

export default useAuthApi
