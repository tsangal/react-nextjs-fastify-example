'use client'

import { Reducer, createContext, useContext, useReducer, useState } from 'react'

import { ServiceRegistryContext } from '@/components/serviceRegistry'
import type { AuthResult, User } from '@/components/authApi'

const AUTH_REFRESH_GRACE_PERIOD_SECONDS = 60

interface AuthReducerAction {
  type: string
  payload?: any
}

export interface AuthState {
  authed: boolean
  checkedAuth: boolean
  user?: User | null
  authToken?: string | null
  authTokenExpiry?: number | null
  refreshTokenExpiry?: number | null
}

interface AuthContext {
  state: AuthState
  checkAuth: () => Promise<boolean>
  isLoggedIn: () => boolean
  logout: () => Promise<void>
  passwordLogin: (username: string, password: string) => any
  refreshAuth: () => Promise<AuthResult>
}

export const AuthContext = createContext<AuthContext | null>(null)

let pendingCheckAuthPromise: Promise<boolean> | null

export interface AuthContextProviderProps {
  children: React.ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const serviceRegistryContext = useContext(ServiceRegistryContext)
  const authApi = serviceRegistryContext?.getService('authApi')

  const initialState: AuthState = {
    authed: false,
    checkedAuth: false,
    user: null,
    authToken: null,
    authTokenExpiry: null,
    refreshTokenExpiry: authApi.getRefreshTokenExpiryCookie(),
  }
  const [state, dispatch] = useReducer<Reducer<AuthState, AuthReducerAction>>(
    reducer,
    initialState
  )

  function reducer(state: AuthState, action: AuthReducerAction): AuthState {
    switch (action.type) {
      case 'authed':
        return {
          ...state,
          user: action.payload.user,
          authToken: action.payload.authToken,
          authTokenExpiry: action.payload.authTokenExpiry,
          refreshTokenExpiry: action.payload.refreshTokenExpiry,
          authed: true,
          checkedAuth: true,
        }

      case 'unauthed':
        return {
          ...state,
          user: null,
          authToken: null,
          authTokenExpiry: null,
          refreshTokenExpiry: null,
          authed: false,
          checkedAuth: true,
        }

      case 'noRefresh':
        return {
          ...state,
          refreshTokenExpiry: null,
        }

      default:
        throw new Error(`Unknown action type "${action.type}"`)
    }
  }

  const isAuthed = () => state.user != null && !authTokenExpired()

  const isLoggedIn = () => state != null && state.user != null && state.authed

  function authTokenExpired() {
    if (!state.authToken || !state.authTokenExpiry) {
      console.debug('authTokenExpired(): no token')
      return true
    }

    // Check if auth token has expired, excluding a grace period so
    // we have enough time to run operations after this check before it
    // actually expires.
    const authExpiryMinusGrace = new Date(
      state.authTokenExpiry - AUTH_REFRESH_GRACE_PERIOD_SECONDS * 1000
    )
    const now = new Date()

    return authExpiryMinusGrace < now
  }

  function canRefreshAuth() {
    const tokenExpiry = state.refreshTokenExpiry
    if (!tokenExpiry) {
      return false
    }

    let tokenExpiryDate: Date
    try {
      tokenExpiryDate = new Date(Number(tokenExpiry) * 1000)
    } catch {
      return false
    }
    return new Date() <= tokenExpiryDate
  }

  /**
   * Checks if the user's auth is currently valid. If not,
   * tries to perform a silent refresh if possible.
   */
  function checkAuth(): Promise<boolean> {
    console.info('Checking auth...')
    if (pendingCheckAuthPromise) {
      console.info('Auth check already pending...')
      return pendingCheckAuthPromise
    }

    pendingCheckAuthPromise = new Promise<boolean>((resolve) => {
      console.debug('Creating checkAuth promise.')

      if (isAuthed()) {
        console.info('Still authenticated.')
        return resolve(true)
      }
      if (canRefreshAuth()) {
        console.info('Refreshing auth...')
        return resolve(refreshAuth().then((result) => result.success))
      } else {
        console.info('Auth cannot be refreshed.')
        dispatch({ type: 'unauthed' })
        return resolve(false)
      }
    })
      .catch((error) => {
        console.error('checkAuth promise error', error)
        dispatch({ type: 'unauthed' })
        throw error
      })
      .finally(() => {
        console.debug('Cleaning up checkAuth promise.')
        pendingCheckAuthPromise = null
      })

    return pendingCheckAuthPromise
  }

  function logout(): Promise<void> {
    // Prevent auth refresh while logging out.
    dispatch({ type: 'noRefresh' })

    return authApi
      .sendUserLogout()
      .catch((error: Error) => {
        // Ignore API logout errors.
      })
      .finally(() => {
        processAuthResponseData(null)
      })
  }

  function passwordLogin(
    username: string,
    password: string
  ): Promise<Record<string, unknown>> {
    return authApi
      .postUserPasswordLogin(username, password)
      .then((data: any) => {
        processAuthResponseData(data)
        return data
      })
      .catch((error: Error) => {
        console.error('passwordLogin error', error)
        dispatch({ type: 'unauthed' })
        return Promise.reject(error)
      })
  }

  function refreshAuth(): Promise<AuthResult> {
    return authApi
      .refreshAuthToken()
      .then((data: any) => {
        processAuthResponseData(data)
        return data
      })
      .catch((error: any) => {
        processAuthResponseData(null)
      })
  }

  function processAuthResponseData(data: any) {
    if (data && data.success) {
      dispatch({ type: 'authed', payload: data })
    } else {
      dispatch({ type: 'unauthed' })
    }
  }

  const value: AuthContext = {
    state,
    checkAuth,
    isLoggedIn,
    logout,
    passwordLogin,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
