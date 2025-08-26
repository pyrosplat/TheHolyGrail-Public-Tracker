'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Divider,
  LinearProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
} from '@mui/material'
import {
  ArrowBack as BackIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material'
import Link from 'next/link'

interface AchievementDetails {
  achievement: {
    id: string
    key: string
    name: string
    description: string
    icon: string
    category: string
    rarity: string
    points: number
    conditions: any
  }
  stats: {
    totalUnlocks: number
    unlockedPercentage: number
    totalPlayers: number
  }
  unlockedBy: Array<{
    rank: number
    user: {
      id: string
      username: string
      displayName?: string
      avatarUrl?: string
    }
    unlockedAt: string
    progress: number
  }>
}

export default function AchievementDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const achievementId = params.id as string
  const [achievement, setAchievement] = useState<AchievementDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date_asc')

  useEffect(() => {
    fetchAchievementDetails()
  }, [achievementId])

  const fetchAchievementDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/achievements/${achievementId}`)
      const data = await response.json()

      if (data.success) {
        setAchievement(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to load achievement details')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'warning'
      case 'epic': return 'secondary'
      case 'rare': return 'info'
      case 'common': return 'success'
      default: return 'default'
    }
  }

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'warning.main'
      case 'epic': return 'secondary.main'
      case 'rare': return 'info.main'
      case 'common': return 'success.main'
      default: return 'text.primary'
    }
  }

  const getFilteredAndSortedPlayers = () => {
    if (!achievement?.unlockedBy) return []
    
    let filtered = achievement.unlockedBy.filter(unlock => {
      if (!searchQuery) return true
      const displayName = unlock.user.displayName?.toLowerCase() || ''
      const username = unlock.user.username.toLowerCase()
      const query = searchQuery.toLowerCase()
      return displayName.includes(query) || username.includes(query)
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.unlockedAt).getTime() - new Date(b.unlockedAt).getTime()
        case 'date_desc':
          return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
        case 'name_asc':
          const nameA = (a.user.displayName || a.user.username).toLowerCase()
          const nameB = (b.user.displayName || b.user.username).toLowerCase()
          return nameA.localeCompare(nameB)
        case 'name_desc':
          const nameA2 = (a.user.displayName || a.user.username).toLowerCase()
          const nameB2 = (b.user.displayName || b.user.username).toLowerCase()
          return nameB2.localeCompare(nameA2)
        case 'rank':
        default:
          return a.rank - b.rank
      }
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !achievement) {
    return (
      <Box>
        <Button 
          startIcon={<BackIcon />} 
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back to Achievements
        </Button>
        <Alert severity="error">{error || 'Achievement not found'}</Alert>
      </Box>
    )
  }

  return (
    <Box>
      {/* Back Button */}
      <Button 
        startIcon={<BackIcon />} 
        onClick={() => router.back()}
        sx={{ mb: 3 }}
      >
        Back to Achievements
      </Button>

      {/* Achievement Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: '3rem',
                bgcolor: getRarityTextColor(achievement.achievement.rarity),
                color: 'white'
              }}
            >
              {achievement.achievement.icon}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h3" gutterBottom>
                {achievement.achievement.name}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {achievement.achievement.description}
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip
                  label={achievement.achievement.rarity}
                  color={getRarityColor(achievement.achievement.rarity)}
                  variant="filled"
                />
                <Chip
                  label={achievement.achievement.category}
                  variant="outlined"
                />
                <Chip
                  icon={<TrophyIcon />}
                  label={`${achievement.achievement.points} points`}
                  color="primary"
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Achievement Statistics
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body1">
                Unlocked by {achievement.stats.totalUnlocks} of {achievement.stats.totalPlayers} players
              </Typography>
              <Typography variant="body1" color="primary" fontWeight="bold">
                {achievement.stats.unlockedPercentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(achievement.stats.unlockedPercentage, 100)}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Players Who Unlocked This Achievement */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Unlocked By ({achievement.unlockedBy.length})
          </Typography>
          
          {/* Search and Sort Controls */}
          {achievement.unlockedBy.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: 200 }}
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={<SortIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="rank">Rank (Default)</MenuItem>
                  <MenuItem value="date_asc">Date: Oldest First</MenuItem>
                  <MenuItem value="date_desc">Date: Newest First</MenuItem>
                  <MenuItem value="name_asc">Name: A to Z</MenuItem>
                  <MenuItem value="name_desc">Name: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          
          {achievement.unlockedBy.length === 0 ? (
            <Box textAlign="center" py={4}>
              <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No one has unlocked this achievement yet
              </Typography>
              <Typography color="text.secondary">
                Be the first to earn it!
              </Typography>
            </Box>
          ) : (
            <>
              {searchQuery && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Showing {getFilteredAndSortedPlayers().length} of {achievement.unlockedBy.length} players
                </Typography>
              )}
              
              <List>
                {getFilteredAndSortedPlayers().map((unlock, index) => (
                <Box key={unlock.user.id}>
                  <ListItem
                    component={Link}
                    href={`/player/${unlock.user.username}`}
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} mr={2}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: unlock.rank <= 3 ? (
                            unlock.rank === 1 ? '#FFD700' : 
                            unlock.rank === 2 ? '#C0C0C0' : 
                            '#CD7F32'
                          ) : 'grey.600',
                          color: unlock.rank <= 3 ? '#000' : '#fff',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}
                      >
                        #{unlock.rank}
                      </Avatar>
                    </Box>
                    <ListItemAvatar>
                      <Avatar
                        src={unlock.user.avatarUrl}
                        sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
                      >
                        {(unlock.user.displayName || unlock.user.username)[0]?.toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={unlock.user.displayName || unlock.user.username}
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Unlocked on {new Date(unlock.unlockedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < getFilteredAndSortedPlayers().length - 1 && <Divider />}
                </Box>
              ))}
              </List>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}