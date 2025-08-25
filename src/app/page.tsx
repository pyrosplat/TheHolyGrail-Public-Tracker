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
} from '@mui/icons-material'
import Link from 'next/link'

// Mock data for development
const mockLeaderboard = [
  { id: '1', username: 'GrailMaster99', completion: 98.5, totalItems: 492, rank: 1 },
  { id: '2', username: 'DiabloHunter', completion: 87.2, totalItems: 436, rank: 2 },
  { id: '3', username: 'LootSeeker', completion: 76.8, totalItems: 384, rank: 3 },
  { id: '4', username: 'RuneCollector', completion: 65.4, totalItems: 327, rank: 4 },
  { id: '5', username: 'SetComplete', completion: 58.9, totalItems: 294, rank: 5 },
]

const mockRecentAchievements = [
  { id: '1', username: 'GrailMaster99', achievement: 'Grail Completed!', rarity: 'legendary', timestamp: '2 hours ago' },
  { id: '2', username: 'DiabloHunter', achievement: 'All Sets Found', rarity: 'epic', timestamp: '5 hours ago' },
  { id: '3', username: 'LootSeeker', achievement: 'Rune Master', rarity: 'rare', timestamp: '8 hours ago' },
  { id: '4', username: 'RuneCollector', achievement: 'First Unique', rarity: 'common', timestamp: '1 day ago' },
]

const mockStats = {
  totalPlayers: 1337,
  activeToday: 89,
  grailsCompleted: 42,
  itemsFound: 15847,
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

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
        {/* Stats Overview */}
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
                      {mockStats.totalPlayers.toLocaleString()}
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
                      {mockStats.activeToday}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Today
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <TrophyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" color="warning.main">
                      {mockStats.grailsCompleted}
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
                      {mockStats.itemsFound.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items Found
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
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
                {mockLeaderboard.slice(0, 5).map((player) => (
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
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        #{player.rank}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={player.username}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {player.totalItems} items • {player.completion}% complete
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={player.completion}
                            sx={{ mt: 1, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Recent Achievements
              </Typography>
              <List>
                {mockRecentAchievements.map((achievement) => (
                  <ListItem
                    key={achievement.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" component="span">
                            {achievement.username}
                          </Typography>
                          <Chip
                            size="small"
                            label={achievement.achievement}
                            className={`achievement-${achievement.rarity}`}
                          />
                        </Box>
                      }
                      secondary={achievement.timestamp}
                    />
                  </ListItem>
                ))}
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
                <Typography color="text.secondary">
                  Get the Holy Grail desktop client to automatically track your item progress.
                </Typography>
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