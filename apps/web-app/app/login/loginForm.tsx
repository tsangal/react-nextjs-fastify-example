'use client'

import { useContext, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { AuthContext } from '@/components/authContext'

export default function LoginForm() {
  const authContext = useContext(AuthContext)!

  let [username, setUsername] = useState<string>('')
  let [password, setPassword] = useState<string>('')
  let [errorMessage, setErrorMessage] = useState<string>('')

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
      <Box component="form" onSubmit={handleLogin}>
        {!authContext.isLoggedIn() && (
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              <TextField
                id="usernameInput"
                type="text"
                label="Username"
                onChange={(e) => setUsername(e.target.value)}
              ></TextField>
            </div>
            <div>
              <TextField
                id="passwordInput"
                type="password"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
              ></TextField>
            </div>
            <div>
              <Button type="submit" variant="contained">
                Login
              </Button>
            </div>
            <div>
              {errorMessage.length > 0 && (
                <Alert severity="error">{errorMessage}</Alert>
              )}
            </div>
          </Stack>
        )}
      </Box>
    </>
  )
}
