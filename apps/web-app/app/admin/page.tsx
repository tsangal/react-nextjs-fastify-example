'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import useRequireAuth from '@/components/useRequireAuth'

export default function AdminPage() {
  const { authContext } = useRequireAuth()

  const { isLoggedIn, state: authState } = authContext

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
        <Typography variant="h1">Administration</Typography>

        {isLoggedIn() && (
          <div>
            <div>Logged in as {authState?.user?.name}</div>
          </div>
        )}
      </Box>
    </Container>
  )
}
