'use client'

import { useContext, useEffect, useState } from 'react'

import AppBar from '@mui/material/AppBar'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import NextLink from 'next/link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { AuthContext } from '@/components/authContext'

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext)!

  const { state, checkAuth } = useContext(AuthContext)!

  const adminPages = ['Permissions', 'Roles', 'Users']

  const [anchorElAdministration, setAnchorElAdministration] =
    useState<null | HTMLElement>(null)

  useEffect(() => {
    if (!state.checkedAuth) {
      checkAuth().finally(() => {
        console.debug('App finished checking auth.')
      })
    }
  }, [state, checkAuth])

  const handleOpenAdministrationMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElAdministration(event.currentTarget)
  }

  const handleCloseAdministrationMenu = () => {
    setAnchorElAdministration(null)
  }

  async function handleLogout(): Promise<void> {
    await logout()
  }

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box>
            <Typography variant="h6" component="div">
              DEMO
            </Typography>
          </Box>

          <Box sx={{ mx: 2, flexGrow: 1 }}>
            <Button href="/" color="inherit" component={NextLink}>
              Home
            </Button>

            {isLoggedIn() && (
              <>
                <Button
                  key="administration"
                  color="inherit"
                  onClick={handleOpenAdministrationMenu}
                >
                  Administration <ArrowDropDownIcon />
                </Button>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElAdministration}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElAdministration)}
                  onClose={handleCloseAdministrationMenu}
                >
                  <MenuItem
                    key="admin-home"
                    component={NextLink}
                    href="/admin"
                    onClick={handleCloseAdministrationMenu}
                  >
                    <Typography sx={{ textAlign: 'center' }}>
                      Admin Home
                    </Typography>
                  </MenuItem>
                  {adminPages.map((adminPage) => (
                    <MenuItem
                      key={adminPage}
                      component={NextLink}
                      href={`/admin/${adminPage.toLowerCase()}`}
                      onClick={handleCloseAdministrationMenu}
                    >
                      <Typography sx={{ textAlign: 'center' }}>
                        {adminPage}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>

          <div>
            {!isLoggedIn() && (
              <Button color="inherit" LinkComponent={NextLink} href="/login">
                Login
              </Button>
            )}
            {isLoggedIn() && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
