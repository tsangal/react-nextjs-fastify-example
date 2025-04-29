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
import { useRolesApi } from '@/components/rolesApi'

export default function RolesPage() {
  const { authContext } = useRequireAuth()

  const [roles, setRoles] = useState<Array<any> | null>()
  const { getRoles, deleteRole } = useRolesApi()

  useEffect(() => {
    if (authContext.isLoggedIn()) {
      loadRoles()
    }
  }, [authContext])

  async function loadRoles() {
    return getRoles()
      .then((result) => setRoles(result.data?.roles))
      .catch(() => setRoles(null))
  }

  function handleDeleteRole(id: string): void {
    deleteRole(id).then((result) => {
      console.debug(result)
      loadRoles()
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
        <Typography variant="h1">Roles</Typography>

        {roles && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles?.map((role) => (
                  <TableRow
                    key={role.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>{role.id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      {role.permissions
                        ?.map((permission: any) => permission.name)
                        .sort()
                        .join(', ')}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        onClick={() => handleDeleteRole(role.id)}
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
