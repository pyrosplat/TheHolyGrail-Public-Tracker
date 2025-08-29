'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  Grid,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  List as ListIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material'
import ClientOnly from '@/components/ClientOnly'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

interface ApiKey {
  id: string
  key: string
  name: string
  lastUsedAt: string | null
  createdAt: string
}

export default function DashboardPage() {
  const { mode } = useTheme()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialog, setCreateDialog] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [showKeyDialog, setShowKeyDialog] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchApiKeys()
    }
  }, [status, router])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys)
      } else {
        setError('Failed to fetch API keys')
      }
    } catch (error) {
      setError('Network error while fetching API keys')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      setError('API key name is required')
      return
    }

    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setNewlyCreatedKey(data.apiKey.key)
        setShowKeyDialog(true)
        setCreateDialog(false)
        setNewKeyName('')
        setSuccess('API key created successfully')
        await fetchApiKeys()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create API key')
      }
    } catch (error) {
      setError('Network error while creating API key')
    }
  }

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This will also permanently delete all your grail progress and achievements. This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSuccess('API key deleted and grail progress cleared successfully')
        await fetchApiKeys()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete API key')
      }
    } catch (error) {
      setError('Network error while deleting API key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess('API key copied to clipboard')
  }

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys)
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId)
    } else {
      newVisible.add(keyId)
    }
    setVisibleKeys(newVisible)
  }

  const maskApiKey = (key: string) => {
    return key.substring(0, 7) + '••••••••••••••••••••••••••••' + key.substring(key.length - 4)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  if (status === 'loading' || loading) {
    return (
      <ClientOnly>
        <Box sx={{ p: 3 }}>Loading...</Box>
      </ClientOnly>
    )
  }

  if (!session) {
    return null
  }

  return (
    <ClientOnly>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {session.user.displayName || session.user.username}!
          </Typography>
        </Box>

        {/* Quick Navigation */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Link href={`/player/${session.user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <PersonIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>
                    My Profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    View your public profile and grail progress
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Link href={`/player/${session.user.username}/items`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>
                    My Items
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Browse your found and missing items
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Link href="/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <SettingsIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
                  <Typography variant="h6" gutterBottom>
                    Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Manage your account and preferences
                  </Typography>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* API Keys Section */}
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    API Keys
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setCreateDialog(true)}
                    disabled={apiKeys.length >= 1}
                    sx={{
                      color: '#ffffff'
                    }}
                  >
                    Create API Key
                  </Button>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use API keys to connect your desktop application to sync grail progress. Only one API key is allowed per account.
                </Typography>

                {apiKeys.length > 0 && (
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mb: 3,
                      ...(mode === 'dark' && {
                        backgroundColor: 'rgba(255, 193, 7, 0.1)', // Semi-transparent yellow background
                        borderColor: 'warning.main',
                        color: 'warning.light',
                        '& .MuiAlert-icon': {
                          color: 'warning.main'
                        }
                      })
                    }}
                  >
                    <Typography variant="body2">
                      <strong>⚠️ Important:</strong> Deleting your API key will permanently clear all your grail progress, achievements, and statistics. This action cannot be undone.
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>💡 Tip:</strong> After deleting your API key or clearing your grail, restart your desktop client to unlock the configuration settings.
                    </Typography>
                  </Alert>
                )}

                {apiKeys.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      No API keys created yet. Create one to start syncing with the desktop app.
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {apiKeys.map((apiKey, index) => (
                      <div key={apiKey.id}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1">
                                  {apiKey.name}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={apiKey.lastUsedAt ? 'Active' : 'Unused'}
                                  color={apiKey.lastUsedAt ? 'success' : 'default'}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', my: 1 }}>
                                  {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Created: {formatDate(apiKey.createdAt)} • Last used: {formatDate(apiKey.lastUsedAt)}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                            >
                              {visibleKeys.has(apiKey.id) ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => copyToClipboard(apiKey.key)}
                              title="Copy to clipboard"
                            >
                              <CopyIcon />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => deleteApiKey(apiKey.id)}
                              title="Delete API key"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < apiKeys.length - 1 && <Divider />}
                      </div>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Info */}
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Username
                    </Typography>
                    <Typography variant="body1">
                      {session.user.username}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {session.user.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Display Name
                    </Typography>
                    <Typography variant="body1">
                      {session.user.displayName || session.user.username}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Sign Out Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => signOut({ callbackUrl: '/' })}
            sx={{ px: 3 }}
          >
            Sign Out
          </Button>
        </Box>

        {/* GitHub Link for Issues */}
        <Box sx={{ mt: 4, textAlign: 'center', py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Found a bug or have a suggestion?
          </Typography>
          <Button
            variant="text"
            href="https://github.com/pyrosplat/TheHolyGrail-Public-Tracker"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'underline' }}
          >
            Report an Issue on GitHub
          </Button>
        </Box>

        {/* Create API Key Dialog */}
        <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Give your API key a descriptive name to help you identify it later.
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="API Key Name"
              fullWidth
              variant="outlined"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="e.g., Desktop App, Laptop, Main PC"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
            <Button onClick={createApiKey} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Show New API Key Dialog */}
        <Dialog open={showKeyDialog} onClose={() => setShowKeyDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>API Key Created Successfully</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Important:</strong> This is the only time you'll see this API key. 
                Copy it now and store it securely.
              </Typography>
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newlyCreatedKey || ''}
              InputProps={{
                readOnly: true,
                sx: { fontFamily: 'monospace' }
              }}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              startIcon={<CopyIcon />}
              onClick={() => newlyCreatedKey && copyToClipboard(newlyCreatedKey)}
              fullWidth
            >
              Copy to Clipboard
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowKeyDialog(false)} variant="contained">
              I've Saved the Key
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  )
}