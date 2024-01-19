'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { AuthContext } from '@/components/authContext'

const DEFAULT_REDIRECT_TO = '/login'

export default function RequireAuth({
  children,
  redirectTo = DEFAULT_REDIRECT_TO,
}: RequireAuthProps) {
  const { state, checkAuth } = useContext(AuthContext)!
  const router = useRouter()

  useEffect(() => {
    checkAuth().then(() => {
      if (state.checkedAuth && !state.authed) {
        router.push(redirectTo || DEFAULT_REDIRECT_TO)
      }
    })
  }, [state, checkAuth])

  return state.checkedAuth && state.authed ? <>{children}</> : <></>
}

interface RequireAuthProps {
  children: React.ReactNode
  redirectTo?: string
}
