'use client'

import { useState } from 'react'
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
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Delete account confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  
  // Clear progress confirmation dialog
  const [clearProgressDialogOpen, setClearProgressDialogOpen] = useState(false)
  const [clearProgressConfirmation, setClearProgressConfirmation] = useState('')
  const [clearProgressLoading, setClearProgressLoading] = useState(false)

  if (!session) {
    router.push('/auth/signin')
    return null
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
      <Typography variant="h3" gutterBottom>
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
              {session.user?.name}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card sx={{ mb: 4, border: '2px solid', borderColor: 'error.main' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="error.main">
            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Danger Zone
          </Typography>
          
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
            <Box component="ul" sx={{ mt: 1, mb: 3 }}>
              <li>All grail progress data</li>
              <li>Statistics and achievements</li>
              <li>Item tracking history</li>
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
            <Box component="ul" sx={{ mt: 1, mb: 3 }}>
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
        </CardContent>
      </Card>

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