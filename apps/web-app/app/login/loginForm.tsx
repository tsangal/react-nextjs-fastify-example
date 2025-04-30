'use client'

import { useContext, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'

import { AuthContext } from '@/components/authContext'

interface IFormInputs {
  username: string
  password: string
}

export default function LoginForm() {
  const authContext = useContext(AuthContext)!

  const {
    handleSubmit,
    control: formControl,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  let [errorMessage, setErrorMessage] = useState<string>('')

  const onSubmit: SubmitHandler<IFormInputs> = async function handleLogin(
    data: IFormInputs
  ) {
    const { username, password } = data
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
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {!authContext.isLoggedIn() && (
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Controller
              name="username"
              control={formControl}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id="usernameInput"
                  type="text"
                  label="Username"
                  {...field}
                  error={!!errors.username}
                  helperText={
                    errors.username?.type === 'required'
                      ? 'Username is required'
                      : ''
                  }
                ></TextField>
              )}
            />
            <Controller
              name="password"
              control={formControl}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id="passwordInput"
                  type="password"
                  label="Password"
                  {...field}
                  error={!!errors.password}
                  helperText={
                    errors.password?.type === 'required'
                      ? 'Password is required'
                      : ''
                  }
                ></TextField>
              )}
            />
            <Button type="submit" variant="contained">
              Login
            </Button>
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
