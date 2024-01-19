'use client'

import { useContext, useState } from 'react'
import { TEAlert, TEInput } from 'tw-elements-react'

import { AuthContext } from '@/components/authContext'

export default function LoginForm() {
  const authContext = useContext(AuthContext)!

  let [username, setUsername] = useState<string>('')
  let [password, setPassword] = useState<string>('')
  let [errorMessage, setErrorMessage] = useState<string>('')

  async function handleLogin() {
    setErrorMessage('')
    try {
      await authContext!.passwordLogin(username, password)
    } catch (ex: any) {
      console.error('Error message:', ex.message)
      setErrorMessage(ex.message)
    }
  }

  return (
    <>
      {authContext.isLoggedIn() && (
        <div>Logged in as {authContext!.state.user!.name}</div>
      )}
      {!authContext.isLoggedIn() && (
        <div>
          <TEInput
            className="my-2"
            type="text"
            id="passwordInput"
            label="Username"
            onChange={(e) => setUsername(e.target.value)}
          ></TEInput>
          <TEInput
            className="my-2"
            type="password"
            id="passwordInput"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></TEInput>
          <button
            type="button"
            className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="my-3">
            {errorMessage.length > 0 && (
              <TEAlert staticAlert open={true} color="bg-danger-100">
                {errorMessage}
              </TEAlert>
            )}
          </div>
        </div>
      )}
    </>
  )
}
