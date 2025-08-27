'use client'

import { AppBar, Toolbar, Typography, Container, Box, Button, Menu, MenuItem, Avatar, IconButton } from '@mui/material'
import { AccountCircle, LightMode, DarkMode } from '@mui/icons-material'
import { useTheme } from '@/contexts/ThemeContext'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession()
  const { mode, toggleTheme } = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: `${window.location.origin}/` })
    handleClose()
  }

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontFamily: 'Exocet Heavy',
              fontSize: '1.8rem',
              fontWeight: 700,
              letterSpacing: '0.02em'
            }}
          >
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
                
                {/* Theme Toggle */}
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                  sx={{ ml: 1 }}
                >
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
                
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {session.user.avatarUrl ? (
                    <Avatar
                      src={session.user.avatarUrl}
                      sx={{ width: 32, height: 32 }}
                    >
                      {session.user.username?.[0]?.toUpperCase()}
                    </Avatar>
                  ) : (
                    <AccountCircle />
                  )}
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
                  <MenuItem onClick={handleClose} component={Link} href={`/player/${session.user.username}/items`}>
                    My Items
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
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button color="inherit" component={Link} href="/auth/signin" size="small">
                  Sign In
                </Button>
                <Button variant="outlined" color="inherit" component={Link} href="/auth/signup" size="small">
                  Sign Up
                </Button>
                
                {/* Theme Toggle */}
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
                  sx={{ ml: 1 }}
                >
                  {mode === 'dark' ? <LightMode /> : <DarkMode />}
                </IconButton>
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