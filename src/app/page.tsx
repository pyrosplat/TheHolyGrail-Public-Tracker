'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
} from '@mui/material'
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  Download as DownloadIcon,
} from '@mui/icons-material'
import Link from 'next/link'

interface LeaderboardEntry {
  id: string
  username: string
  displayName?: string
  avatarUrl?: string
  rank: number
  progress: {
    overall: number
    totalItems: number
  }
}

interface PageStats {
  totalUsers: number
  activeUsers: number
  completedGrails: number
  totalItems: number
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<PageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    loadPageData()
  }, [])

  const loadPageData = async () => {
    try {
      setLoading(true)
      
      // Load top 5 players from leaderboards
      const leaderboardResponse = await fetch('/api/leaderboards?limit=5&offset=0&category=overall')
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json()
        if (leaderboardData.success) {
          setLeaderboard(leaderboardData.data.leaderboard || [])
        }
      }

      // Load basic stats - we'll implement this API endpoint next
      // const statsResponse = await fetch('/api/stats')
      // if (statsResponse.ok) {
      //   const statsData = await statsResponse.json()
      //   if (statsData.success) {
      //     setStats(statsData.data)
      //   }
      // }
      
    } catch (error) {
      console.error('Failed to load page data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to player profile
      router.push(`/player/${searchQuery.trim()}`)
    }
  }

  if (!mounted) {
    return null // Prevent SSR/hydration mismatch
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h1" component="h1" gutterBottom>
          The Holy Grail
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Track and share your Diablo II: Resurrected item collection progress
        </Typography>
        
        {/* Search Bar */}
        <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for a player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Stats Overview - Only show when we have stats data */}
        {stats && (
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Community Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <GroupIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h4" color="primary">
                        {stats.totalUsers.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Players
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <TimelineIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {stats.activeUsers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <TrophyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                      <Typography variant="h4" color="warning.main">
                        {stats.completedGrails}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Grails Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        {stats.totalItems.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Items
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12} md={stats ? 4 : 6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  href="/auth/signup"
                  startIcon={<SearchIcon />}
                >
                  Create Account
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  href="/leaderboards"
                  startIcon={<TrendingUpIcon />}
                >
                  View Leaderboards
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  component={Link}
                  href="/achievements"
                  startIcon={<TrophyIcon />}
                >
                  Browse Achievements
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Players */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Top Players
              </Typography>
              <List>
                {leaderboard.length > 0 ? (
                  leaderboard.map((player) => (
                    <ListItem
                      key={player.id}
                      component={Link}
                      href={`/player/${player.username}`}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mr={2}>
                        <Avatar 
                          src={player.avatarUrl}
                          sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                        >
                          {player.username[0]?.toUpperCase()}
                        </Avatar>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          color: 'primary.contrastText',
                          width: 28,
                          height: 28,
                          fontSize: '0.75rem'
                        }}>
                          #{player.rank}
                        </Avatar>
                      </Box>
                      <ListItemText
                        primary={player.displayName || player.username}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {player.progress.totalItems} items • {player.progress.overall.toFixed(1)}% complete
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(player.progress.overall, 100)}
                              sx={{ mt: 1, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No players yet
                    </Typography>
                    <Typography color="text.secondary">
                      Be the first to start tracking your Holy Grail progress!
                    </Typography>
                  </Box>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Getting Started */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Getting Started
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  1. Download the Desktop App
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Get the Holy Grail desktop client to automatically track your item progress.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  href="https://github.com/pyrosplat/TheHolyGrail/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 2 }}
                >
                  Download Client
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  2. Create Account & Generate API Key
                </Typography>
                <Typography color="text.secondary">
                  Sign up and create your unique API key to sync your progress with the web tracker.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  3. Start Your Grail!
                </Typography>
                <Typography color="text.secondary">
                  Begin collecting items and watch your progress appear here in real-time.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}