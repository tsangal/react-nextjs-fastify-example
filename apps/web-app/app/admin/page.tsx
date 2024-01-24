'use client'

import useRequireAuth from '@/components/useRequireAuth'

export default function AdminPage() {
  const { authContext } = useRequireAuth()

  const { isLoggedIn, state: authState } = authContext

  return (
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
  )
}
