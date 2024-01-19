'use client'

import { useContext } from 'react'

import { AuthContext } from '@/components/authContext'
import LoginForm from '@/app/login/loginForm'

export default function Login() {
  const { isLoggedIn, state: authState } = useContext(AuthContext)!

  return (
    <main className="flex flex-col items-center justify-between p-4">
      <div>
        <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
          Login
        </h1>
      </div>
      {isLoggedIn() && (
        <div>
          <div>Logged in as {authState?.user?.name}</div>
        </div>
      )}
      {!isLoggedIn() && <LoginForm />}
    </main>
  )
}
