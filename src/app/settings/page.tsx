'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Divider,
  CircularProgress,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  PhotoCamera as PhotoCameraIcon,
  CloudUpload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { useTheme } from '@/contexts/ThemeContext'

interface UserProfile {
  id: string
  username: string
  displayName?: string
  email: string
  bio?: string
  country?: string
  state?: string
  avatarUrl?: string
  avatarType: string
  diabloExperience?: string
  age?: number
  gender?: string
  hobbies?: string
  isPublic: boolean
}

export default function SettingsPage() {
  const { mode } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({})
  const [profileLoading, setProfileLoading] = useState(true)
  
  // Delete account confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Clear progress confirmation dialog
  const [clearProgressDialogOpen, setClearProgressDialogOpen] = useState(false)
  const [clearProgressConfirmation, setClearProgressConfirmation] = useState('')
  const [clearProgressLoading, setClearProgressLoading] = useState(false)

  // Avatar upload state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  
  // Danger zone accordion state
  const [dangerZoneExpanded, setDangerZoneExpanded] = useState(false)

  useEffect(() => {
    console.log('Settings page: session state changed', { session: session?.user })
    if (session?.user?.id) {
      console.log('Loading profile for user:', session.user.id)
      loadProfile()
    } else if (session === null) {
      console.log('No session - user not authenticated')
      setError('Please log in to view settings')
    }
  }, [session])

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const loadProfile = async () => {
    try {
      setProfileLoading(true)
      setError('') // Clear any previous errors
      
      const response = await fetch('/api/user/profile')
      const data = await response.json()
      
      console.log('Profile API response:', { status: response.status, data })
      
      if (response.ok && data.success) {
        setProfile(data.data)
        setProfileForm(data.data)
      } else {
        const errorMessage = data.error || `HTTP ${response.status}: Failed to load profile`
        console.error('Profile API error:', errorMessage)
        setError(errorMessage)
      }
    } catch (error) {
      console.error('Load profile network error:', error)
      setError(`Network error: ${error instanceof Error ? error.message : 'Failed to load profile'}`)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleEditProfile = () => {
    setEditingProfile(true)
    setProfileForm({ ...profile })
    setError('')
    setSuccess('')
  }

  const handleCancelEdit = () => {
    setEditingProfile(false)
    setProfileForm({ ...profile })
    setError('')
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Extract Battle.net ID from hobbies if it exists
      let battlenetId = ''
      let cleanHobbies = profileForm.hobbies || ''
      
      if (cleanHobbies.startsWith('Battle.net: ')) {
        battlenetId = cleanHobbies.replace('Battle.net: ', '')
        cleanHobbies = ''
      }
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileForm,
          hobbies: cleanHobbies,
          battlenetId: battlenetId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setProfile(data.data)
        setProfileForm(data.data)
        setEditingProfile(false)
        setSuccess('Profile updated successfully!')
      } else {
        setError(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Save profile error:', error)
      setError('An error occurred while updating your profile')
    } finally {
      setLoading(false)
    }
  }

  const extractBattlenetId = (hobbies?: string): string => {
    if (hobbies?.startsWith('Battle.net: ')) {
      return hobbies.replace('Battle.net: ', '')
    }
    return ''
  }

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File too large. Maximum size is 5MB.')
        return
      }

      setAvatarFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleUploadAvatar = async () => {
    if (!avatarFile) {
      setError('Please select a file first')
      return
    }

    try {
      setAvatarUploading(true)
      setError('')

      const formData = new FormData()
      formData.append('avatar', avatarFile)

      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        // Update profile state with new avatar
        setProfile(prev => prev ? {
          ...prev,
          avatarUrl: data.data.avatarUrl,
          avatarType: data.data.avatarType
        } : null)
        
        setProfileForm(prev => ({
          ...prev,
          avatarUrl: data.data.avatarUrl,
          avatarType: data.data.avatarType
        }))

        setAvatarPreview(null)
        setAvatarFile(null)
        setSuccess('Profile picture updated successfully!')
        
        // Reset file input
        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
        
        // Refresh session to show new avatar in navigation
        window.location.reload()
      } else {
        setError(data.error || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Upload avatar error:', error)
      setError('An error occurred while uploading your avatar')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleRemoveAvatar = async () => {
    try {
      setAvatarUploading(true)
      setError('')

      const response = await fetch('/api/user/avatar', {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        // Update profile state to remove avatar
        setProfile(prev => prev ? {
          ...prev,
          avatarUrl: data.data.avatarUrl,
          avatarType: data.data.avatarType
        } : null)
        
        setProfileForm(prev => ({
          ...prev,
          avatarUrl: data.data.avatarUrl,
          avatarType: data.data.avatarType
        }))

        setAvatarPreview(null)
        setAvatarFile(null)
        setSuccess('Profile picture removed successfully!')
      } else {
        setError(data.error || 'Failed to remove avatar')
      }
    } catch (error) {
      console.error('Remove avatar error:', error)
      setError('An error occurred while removing your avatar')
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'DELETE') {
      setError('Please type "DELETE" to confirm account deletion')
      return
    }

    setDeleteLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Account deleted successfully. Redirecting...')
        setTimeout(() => {
          router.push('/auth/signin')
        }, 2000)
      } else {
        setError(data.error || 'Failed to delete account')
      }
    } catch (error) {
      console.error('Delete account error:', error)
      setError('An error occurred while deleting your account')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false)
    setConfirmationText('')
    setError('')
  }

  const handleClearProgress = async () => {
    if (clearProgressConfirmation !== 'CLEAR PROGRESS') {
      setError('Please type "CLEAR PROGRESS" to confirm')
      return
    }

    setClearProgressLoading(true)
    setError('')

    try {
      const response = await fetch('/api/user/clear-progress', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Progress cleared successfully!')
        setClearProgressDialogOpen(false)
        setClearProgressConfirmation('')
      } else {
        setError(data.error || 'Failed to clear progress')
      }
    } catch (error) {
      console.error('Clear progress error:', error)
      setError('An error occurred while clearing your progress')
    } finally {
      setClearProgressLoading(false)
    }
  }

  const handleClearProgressDialogClose = () => {
    setClearProgressDialogOpen(false)
    setClearProgressConfirmation('')
    setError('')
  }

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Typography variant="h3" gutterBottom sx={{ color: mode === 'dark' ? '#ffffff' : 'inherit' }}>
        Account Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Account Information */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Account Information
          </Typography>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {session.user?.email}
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Username
            </Typography>
            <Typography variant="body1">
              {session.user?.username}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Profile & Bio Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">
              Profile & Bio
            </Typography>
            {!editingProfile ? (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditProfile}
                disabled={profileLoading}
              >
                Edit Profile
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>

          {profileLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Profile Picture Section */}
              <Box mb={4}>
                <Typography variant="h6" gutterBottom>
                  Profile Picture
                </Typography>
                <Box display="flex" alignItems="flex-start" gap={3}>
                  <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Avatar
                      src={avatarPreview || profile?.avatarUrl}
                      sx={{ width: 80, height: 80 }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    
                    {editingProfile && (
                      <Box display="flex" flexDirection="column" gap={1} alignItems="center">
                        <input
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          style={{ display: 'none' }}
                          id="avatar-upload"
                          type="file"
                          onChange={handleAvatarFileChange}
                        />
                        <label htmlFor="avatar-upload">
                          <Button
                            variant="outlined"
                            component="span"
                            size="small"
                            startIcon={<PhotoCameraIcon />}
                            disabled={avatarUploading}
                          >
                            Choose Image
                          </Button>
                        </label>
                        
                        {avatarPreview && (
                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={avatarUploading ? <CircularProgress size={16} /> : <UploadIcon />}
                              onClick={handleUploadAvatar}
                              disabled={avatarUploading}
                            >
                              Upload
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setAvatarPreview(null)
                                setAvatarFile(null)
                                const fileInput = document.getElementById('avatar-upload') as HTMLInputElement
                                if (fileInput) fileInput.value = ''
                              }}
                              disabled={avatarUploading}
                            >
                              Cancel
                            </Button>
                          </Box>
                        )}
                        
                        {profile?.avatarUrl && !avatarPreview && (
                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleRemoveAvatar}
                            disabled={avatarUploading}
                          >
                            Remove
                          </Button>
                        )}
                      </Box>
                    )}
                  </Box>
                  
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Upload a profile picture to personalize your account. 
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      • Supported formats: JPEG, PNG, WebP
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      • Maximum file size: 5MB
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Square images work best (will be cropped to circle)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {/* Display Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Display Name"
                    value={editingProfile ? (profileForm.displayName || '') : (profile?.displayName || '')}
                    onChange={(e) => editingProfile && setProfileForm({ ...profileForm, displayName: e.target.value })}
                    disabled={!editingProfile}
                    helperText="How your name appears to other users"
                  />
                </Grid>

                {/* Country */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={editingProfile ? (profileForm.country || '') : (profile?.country || '')}
                    onChange={(e) => editingProfile && setProfileForm({ ...profileForm, country: e.target.value })}
                    disabled={!editingProfile}
                  />
                </Grid>

                {/* State */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    value={editingProfile ? (profileForm.state || '') : (profile?.state || '')}
                    onChange={(e) => editingProfile && setProfileForm({ ...profileForm, state: e.target.value })}
                    disabled={!editingProfile}
                  />
                </Grid>

                {/* Battle.net ID */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Battle.net ID"
                    value={editingProfile ? extractBattlenetId(profileForm.hobbies) : extractBattlenetId(profile?.hobbies)}
                    onChange={(e) => editingProfile && setProfileForm({ 
                      ...profileForm, 
                      hobbies: e.target.value ? `Battle.net: ${e.target.value}` : '' 
                    })}
                    disabled={!editingProfile}
                    helperText="Your Battle.net account name"
                  />
                </Grid>

                {/* Age */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={editingProfile ? (profileForm.age || '') : (profile?.age || '')}
                    onChange={(e) => editingProfile && setProfileForm({ ...profileForm, age: parseInt(e.target.value) || undefined })}
                    disabled={!editingProfile}
                    inputProps={{ min: 13, max: 120 }}
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!editingProfile}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={editingProfile ? (profileForm.gender || '') : (profile?.gender || '')}
                      onChange={(e) => editingProfile && setProfileForm({ ...profileForm, gender: e.target.value })}
                      label="Gender"
                    >
                      <MenuItem value="">Prefer not to say</MenuItem>
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Diablo II Experience */}
                <Grid item xs={12}>
                  <FormControl fullWidth disabled={!editingProfile}>
                    <InputLabel>How long have you been playing Diablo II?</InputLabel>
                    <Select
                      value={editingProfile ? (profileForm.diabloExperience || '') : (profile?.diabloExperience || '')}
                      onChange={(e) => editingProfile && setProfileForm({ ...profileForm, diabloExperience: e.target.value })}
                      label="How long have you been playing Diablo II?"
                    >
                      <MenuItem value="">Select experience</MenuItem>
                      <MenuItem value="new">New to Diablo II (Less than 1 year)</MenuItem>
                      <MenuItem value="casual">Casual player (1-3 years)</MenuItem>
                      <MenuItem value="experienced">Experienced (3-10 years)</MenuItem>
                      <MenuItem value="veteran">Veteran (10+ years)</MenuItem>
                      <MenuItem value="original">Original D2 player (Since 2000)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Bio */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={4}
                    value={editingProfile ? (profileForm.bio || '') : (profile?.bio || '')}
                    onChange={(e) => editingProfile && setProfileForm({ ...profileForm, bio: e.target.value })}
                    disabled={!editingProfile}
                    helperText={`Tell others about yourself, your Diablo II journey, favorite builds, etc. (${(editingProfile ? (profileForm.bio?.length || 0) : (profile?.bio?.length || 0))}/500 characters)`}
                    inputProps={{ maxLength: 500 }}
                  />
                </Grid>

                {/* Public Profile Toggle */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingProfile ? (profileForm.isPublic ?? true) : (profile?.isPublic ?? true)}
                        onChange={(e) => editingProfile && setProfileForm({ ...profileForm, isPublic: e.target.checked })}
                        disabled={!editingProfile}
                      />
                    }
                    label="Make my profile public"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    When enabled, other users can view your profile and grail progress. When disabled, your profile is private.
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Accordion 
        expanded={dangerZoneExpanded} 
        onChange={(event, isExpanded) => setDangerZoneExpanded(isExpanded)}
        sx={{ mb: 4, border: '2px solid', borderColor: 'error.main' }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="danger-zone-content"
          id="danger-zone-header"
          sx={{ backgroundColor: 'error.main', color: 'error.contrastText' }}
        >
          <Typography variant="h5">
            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Danger Zone
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          
          {/* Clear Progress Section */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Clear Grail Progress
            </Typography>
            <Typography variant="body1" paragraph>
              Remove all your grail progress data while keeping your account. This will reset your progress to start fresh.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This will clear:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 3, pl: 3, listStyleType: 'disc' }}>
              <li>All grail progress data</li>
              <li>Statistics and achievements</li>
              <li>Item tracking history</li>
              <li><strong>Unlock grail configuration</strong> (allows changing gameMode, grailType, runes/runewords settings)</li>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your account, API keys, and login credentials will remain intact.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteIcon />}
              onClick={() => setClearProgressDialogOpen(true)}
              disabled={loading || clearProgressLoading}
            >
              Clear Progress
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Delete Account Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Delete Account
            </Typography>
            <Typography variant="body1" paragraph>
              Permanently delete your account and all associated data. This action cannot be undone.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This will delete:
            </Typography>
            <Box component="ul" sx={{ mt: 1, mb: 3, pl: 3, listStyleType: 'disc' }}>
              <li>Your user profile</li>
              <li>All grail progress data</li>
              <li>Statistics and achievements</li>
              <li>API keys</li>
              <li>All associated logs</li>
            </Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={loading || deleteLoading}
            >
              Delete Account
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            This action will permanently delete your account and all associated data. 
            This cannot be undone.
          </DialogContentText>
          <DialogContentText sx={{ mb: 3 }}>
            All of the following will be permanently deleted:
          </DialogContentText>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>Your user profile and login credentials</li>
            <li>All Holy Grail progress data</li>
            <li>Statistics and achievement history</li>
            <li>API keys for desktop sync</li>
            <li>All activity logs</li>
          </Box>
          <DialogContentText sx={{ mb: 2 }}>
            To confirm deletion, please type <strong>DELETE</strong> in the field below:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Type DELETE to confirm"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            error={error.includes('DELETE')}
            helperText={error.includes('DELETE') ? error : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteDialogClose}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleteLoading || confirmationText !== 'DELETE'}
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Progress Confirmation Dialog */}
      <Dialog 
        open={clearProgressDialogOpen} 
        onClose={handleClearProgressDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: 'warning.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Clear Progress
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            This action will permanently delete all your grail progress data, but your account will remain active.
          </DialogContentText>
          <DialogContentText sx={{ mb: 3 }}>
            The following will be permanently deleted:
          </DialogContentText>
          <Box component="ul" sx={{ mb: 3, pl: 3 }}>
            <li>All Holy Grail progress and item tracking</li>
            <li>Statistics and achievement history</li>
            <li>Progress history and sync data</li>
          </Box>
          <DialogContentText sx={{ mb: 3 }}>
            Your account, login credentials, and API keys will remain intact. You can start fresh with a new grail.
          </DialogContentText>
          <DialogContentText sx={{ mb: 2 }}>
            To confirm, please type <strong>CLEAR PROGRESS</strong> in the field below:
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Type CLEAR PROGRESS to confirm"
            value={clearProgressConfirmation}
            onChange={(e) => setClearProgressConfirmation(e.target.value)}
            error={error.includes('CLEAR PROGRESS')}
            helperText={error.includes('CLEAR PROGRESS') ? error : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClearProgressDialogClose}
            disabled={clearProgressLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearProgress}
            color="warning"
            variant="contained"
            disabled={clearProgressLoading || clearProgressConfirmation !== 'CLEAR PROGRESS'}
            startIcon={clearProgressLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {clearProgressLoading ? 'Clearing...' : 'Clear Progress'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}