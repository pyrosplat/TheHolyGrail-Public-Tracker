'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from '@mui/material'
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

interface PlayerData {
  id: string
  username: string
  displayName?: string
  createdAt: string
  lastSyncAt?: string
  grailProgress: {
    gameMode: string
    grailType: string
    includeRunes: boolean
    includeRunewords: boolean
    totalItems: number
    totalEthItems: number
    totalRunes: number
    totalRunewords: number
    overallCompletion: number
    normalCompletion: number
    etherealCompletion: number
    runeCompletion: number
    runewordCompletion: number
  }
  achievements: Array<{
    id: string
    achievement: {
      id: string
      name: string
      description: string
      category: string
      rarity: string
      points: number
    }
    unlockedAt: string
    progress: number
  }>
  statistics: {
    firstItemAt?: string
    lastItemAt?: string
    grailStartedAt?: string
    grailCompletedAt?: string
    itemsPerDay: number
    currentStreak: number
    longestStreak: number
  }
}

export default function PlayerProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlayerData()
  }, [username])

  const fetchPlayerData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/player/${username}`)
      const data = await response.json()

      if (data.success) {
        setPlayer(data.data)
        setError(null)
      } else {
        setError(data.error || 'Player not found')
      }
    } catch (err) {
      setError('Failed to load player data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error || !player) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Player not found'}
        </Alert>
      </Box>
    )
  }

  const { grailProgress, achievements, statistics } = player

  return (
    <Box>
      {/* Player Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'primary.main' }}>
              {player.displayName?.[0]?.toUpperCase() || player.username[0]?.toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h3" gutterBottom>
                {player.displayName || player.username}
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Chip
                  icon={<CheckIcon />}
                  label={`${grailProgress.overallCompletion.toFixed(1)}% Complete`}
                  color="primary"
                />
                <Chip
                  icon={<TrophyIcon />}
                  label={`${achievements.length} Achievements`}
                  color="secondary"
                />
                <Chip
                  icon={<ClockIcon />}
                  label={`Last sync: ${player.lastSyncAt ? new Date(player.lastSyncAt).toLocaleDateString() : 'Never'}`}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Progress Overview */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  fontFamily: '"Exocet", "serif"',
                  textAlign: 'center'
                }}
              >
                Grail Progress
              </Typography>
              
              {/* Main Progress Circle */}
              <Box display="flex" justifyContent="center" mb={4}>
                <Box width={220} height={220} position="relative" display="flex" alignItems="center" justifyContent="center">
                  <CircularProgressbar
                    value={grailProgress.overallCompletion}
                    text={`${grailProgress.overallCompletion.toFixed(1)}%`}
                    styles={buildStyles({
                      pathColor: '#CC5F43',
                      textColor: '#ffffff',
                      trailColor: '#333',
                      textSize: '16px',
                    })}
                  />
                </Box>
              </Box>

              {/* Progress Breakdown */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Normal Items
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress
                        variant="determinate"
                        value={grailProgress.normalCompletion}
                        sx={{ 
                          flex: 1, 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#CC5F43'
                          }
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" minWidth="50px">
                        {grailProgress.normalCompletion.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {grailProgress.totalItems} items found
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Ethereal Items
                    </Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                      <LinearProgress
                        variant="determinate"
                        value={grailProgress.etherealCompletion}
                        sx={{ 
                          flex: 1, 
                          height: 8, 
                          borderRadius: 4,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: '#CC5F43'
                          }
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" minWidth="50px">
                        {grailProgress.etherealCompletion.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      {grailProgress.totalEthItems} eth items found
                    </Typography>
                  </Box>
                </Grid>

                {grailProgress.includeRunes && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Runes
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <LinearProgress
                          variant="determinate"
                          value={grailProgress.runeCompletion}
                          sx={{ 
                            flex: 1, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#CC5F43'
                            }
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" minWidth="50px">
                          {grailProgress.runeCompletion.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {grailProgress.totalRunes}/33 runes found
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {grailProgress.includeRunewords && (
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Runewords
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <LinearProgress
                          variant="determinate"
                          value={grailProgress.runewordCompletion}
                          sx={{ 
                            flex: 1, 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#CC5F43'
                            }
                          }}
                        />
                        <Typography variant="body2" color="text.secondary" minWidth="50px">
                          {grailProgress.runewordCompletion.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {grailProgress.totalRunewords} runewords created
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              {/* View Items Button */}
              <Box mt={4} textAlign="center">
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ViewListIcon />}
                  component={Link}
                  href={`/player/${player.username}/items`}
                >
                  View All Items
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Statistics
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Items per day"
                    secondary={statistics.itemsPerDay.toFixed(1)}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Current streak"
                    secondary={`${statistics.currentStreak} days`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Longest streak"
                    secondary={`${statistics.longestStreak} days`}
                  />
                </ListItem>
                {statistics.grailStartedAt && (
                  <ListItem>
                    <ListItemText
                      primary="Grail started"
                      secondary={new Date(statistics.grailStartedAt).toLocaleDateString()}
                    />
                  </ListItem>
                )}
                {statistics.firstItemAt && (
                  <ListItem>
                    <ListItemText
                      primary="First item found"
                      secondary={new Date(statistics.firstItemAt).toLocaleDateString()}
                    />
                  </ListItem>
                )}
                {statistics.lastItemAt && (
                  <ListItem>
                    <ListItemText
                      primary="Last item found"
                      secondary={new Date(statistics.lastItemAt).toLocaleDateString()}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Achievements ({achievements.length})
              </Typography>
              
              {achievements.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No achievements unlocked yet
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {achievements.map((userAchievement) => (
                    <Grid item xs={12} sm={6} md={4} key={userAchievement.id}>
                      <Card
                        variant="outlined"
                        className={`achievement-${userAchievement.achievement.rarity}`}
                        sx={{
                          border: '2px solid',
                          borderColor: 'divider',
                          '&.achievement-common': { borderColor: 'success.main' },
                          '&.achievement-rare': { borderColor: 'info.main' },
                          '&.achievement-epic': { borderColor: 'secondary.main' },
                          '&.achievement-legendary': { borderColor: 'warning.main' },
                        }}
                      >
                        <CardContent>
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <TrophyIcon
                              sx={{
                                color:
                                  userAchievement.achievement.rarity === 'legendary'
                                    ? 'warning.main'
                                    : userAchievement.achievement.rarity === 'epic'
                                    ? 'secondary.main'
                                    : userAchievement.achievement.rarity === 'rare'
                                    ? 'info.main'
                                    : 'success.main',
                              }}
                            />
                            <Typography variant="h6" component="div">
                              {userAchievement.achievement.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {userAchievement.achievement.description}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Chip
                              size="small"
                              label={userAchievement.achievement.rarity}
                              className={`achievement-${userAchievement.achievement.rarity}`}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {new Date(userAchievement.unlockedAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}