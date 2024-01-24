'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { AuthContext } from '@/components/authContext'

const DEFAULT_REDIRECT_TO = '/login'

export default function useRequireAuth({
  redirectTo = DEFAULT_REDIRECT_TO,
}: RequireAuthProps = {}) {
  const authContext = useContext(AuthContext)!
  const { state, checkAuth } = authContext
  const router = useRouter()

  useEffect(() => {
    checkAuth().then(() => {
      if (state.checkedAuth && !state.authed) {
        router.push(redirectTo || DEFAULT_REDIRECT_TO)
      }
    })
  }, [state, checkAuth])

  return {
    authContext,
  }
}

interface RequireAuthProps {
  redirectTo?: string
}
