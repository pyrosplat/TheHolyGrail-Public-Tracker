'use client'

import { AppBar, Toolbar, Typography, Container, Box, Button, Menu, MenuItem, Avatar, IconButton } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
    handleClose()
  }

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Exocet Heavy' }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              D2R Holy Grail Tracker
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} href="/leaderboards">
              Leaderboards
            </Button>
            <Button color="inherit" component={Link} href="/achievements">
              Achievements
            </Button>
            
            {session ? (
              <>
                <Button color="inherit" component={Link} href="/dashboard">
                  Dashboard
                </Button>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose} component={Link} href="/dashboard">
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} href={`/player/${session.user.username}`}>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleClose} component={Link} href="/settings">
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button color="inherit" component={Link} href="/auth/signin" size="small">
                  Sign In
                </Button>
                <Button variant="outlined" color="inherit" component={Link} href="/auth/signup" size="small">
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {children}
      </Container>
    </>
  )
}