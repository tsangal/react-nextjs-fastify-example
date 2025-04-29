'use client'

import { useContext } from 'react'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import { AuthContext } from '@/components/authContext'
import LoginForm from '@/app/login/loginForm'

export default function Login() {
  const { isLoggedIn, state: authState } = useContext(AuthContext)!

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1">Login</Typography>

        {isLoggedIn() && (
          <div>
            <div>Logged in as {authState?.user?.name}</div>
          </div>
        )}
        {!isLoggedIn() && <LoginForm />}
      </Box>
    </Container>
  )
}
