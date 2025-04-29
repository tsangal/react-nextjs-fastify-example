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
import { usePermissionsApi } from '@/components/permissionsApi'

export default function PermissionsPage() {
  const { authContext } = useRequireAuth()

  const [permissions, setPermissions] = useState<Array<any> | null>()
  const { getPermissions, deletePermission } = usePermissionsApi()

  useEffect(() => {
    if (authContext.isLoggedIn()) {
      loadPermissions()
    }
  }, [authContext])

  async function loadPermissions() {
    return getPermissions()
      .then((result) => setPermissions(result.data?.permissions))
      .catch(() => setPermissions(null))
  }

  function handleDeletePermission(id: string): void {
    deletePermission(id).then((result) => {
      console.debug(result)
      loadPermissions()
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
        <Typography variant="h1">Permissions</Typography>

        {permissions && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions?.map((permission) => (
                  <TableRow
                    key={permission.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>{permission.id}</TableCell>
                    <TableCell>{permission.name}</TableCell>
                    <TableCell>{permission.description}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        onClick={() => handleDeletePermission(permission.id)}
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
