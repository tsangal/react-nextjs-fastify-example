'use client'

import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

import useRequireAuth from '@/components/useRequireAuth'
import { useUsersApi } from '@/components/usersApi'

export default function UsersPage() {
  const { authContext } = useRequireAuth()

  const [users, setUsers] = useState<Array<any> | null>()
  const { getUsers, deleteUser } = useUsersApi()

  useEffect(
    () => {
      if (authContext.isLoggedIn()) {
        loadUsers()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authContext]
  )

  async function loadUsers() {
    return getUsers()
      .then((result) => setUsers(result.data?.users))
      .catch(() => setUsers(null))
  }

  function handleDeleteUser(id: string): void {
    deleteUser(id).then((result) => {
      console.debug(result)
      loadUsers()
    })
  }

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
        <Typography variant="h1">Users</Typography>

        {users && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Roles</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users?.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.roles?.map((role: any) => role.name).join(', ')}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  )
}
