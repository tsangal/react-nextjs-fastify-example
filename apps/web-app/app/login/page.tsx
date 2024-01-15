'use client'

import { useState } from 'react'
import { TEInput } from 'tw-elements-react'

export default function Login() {
  let [data, setData] = useState<{ users: Array<object> } | null>()
  let [username, setUsername] = useState<string | undefined>('')
  let [password, setPassword] = useState<string | undefined>('')

  async function handleLogin() {
    console.debug('handleLogin()', username, password)

    const res = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
    if (!res.ok) {
      console.error(res)
    }

    const result = await res.json()
    console.debug(result)

    setData(result)

    return data
  }

  return (
    <main className="flex flex-col items-center justify-between p-4">
      <div>
        <h1 className="mb-2 mt-0 text-5xl font-medium leading-tight text-primary">
          Login
        </h1>
      </div>
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
      </div>
    </main>
  )
}
