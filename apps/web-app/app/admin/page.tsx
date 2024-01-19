'use client'

import { useContext } from 'react'

import { AuthContext } from '@/components/authContext'
import RequireAuth from '@/components/requireAuth'

export default function AdminPage() {
  const { isLoggedIn, state: authState } = useContext(AuthContext)!

  return (
    <RequireAuth>
      <main className="flex flex-col items-center justify-between p-4">
        <div>
          <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
            Administration
          </h1>
        </div>
        {isLoggedIn() && (
          <div>
            <div>Logged in as {authState?.user?.name}</div>
          </div>
        )}
      </main>
    </RequireAuth>
  )
}
