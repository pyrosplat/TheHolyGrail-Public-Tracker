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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckIcon,
  Schedule as ClockIcon,
  ViewList as ViewListIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  SportsEsports as GamingIcon,
  Badge as BattleNetIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { useTheme } from '@/contexts/ThemeContext'

interface PlayerData {
  id: string
  username: string
  displayName?: string
  createdAt: string
  lastSyncAt?: string
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
  totalAchievementPoints: number
}

export default function PlayerProfilePage() {
  const params = useParams()
  const { mode } = useTheme()
  const username = params.username as string
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [achievementSort, setAchievementSort] = useState<string>('points-desc')

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

  // Sort achievements based on selected criteria
  const getSortedAchievements = () => {
    const sorted = [...achievements]
    
    switch (achievementSort) {
      case 'points-desc':
        return sorted.sort((a, b) => b.achievement.points - a.achievement.points)
      case 'points-asc':
        return sorted.sort((a, b) => a.achievement.points - b.achievement.points)
      case 'rarity-legendary':
        return sorted.filter(a => a.achievement.rarity === 'legendary')
          .concat(sorted.filter(a => a.achievement.rarity !== 'legendary'))
      case 'rarity-epic':
        return sorted.filter(a => a.achievement.rarity === 'epic')
          .concat(sorted.filter(a => a.achievement.rarity !== 'epic'))
      case 'rarity-rare':
        return sorted.filter(a => a.achievement.rarity === 'rare')
          .concat(sorted.filter(a => a.achievement.rarity !== 'rare'))
      case 'rarity-common':
        return sorted.filter(a => a.achievement.rarity === 'common')
          .concat(sorted.filter(a => a.achievement.rarity !== 'common'))
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.unlockedAt).getTime() - new Date(b.unlockedAt).getTime())
      case 'name':
        return sorted.sort((a, b) => a.achievement.name.localeCompare(b.achievement.name))
      default:
        return sorted
    }
  }

  const sortedAchievements = getSortedAchievements()

  return (
    <Box>
      {/* Player Header */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar 
              src={player.avatarUrl} 
              sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: 'primary.main' }}
            >
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
                  label={`${achievements.length} Achievements • ${player.totalAchievementPoints} pts`}
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

      {/* Profile Information */}
      {(player.bio || player.country || player.state || player.diabloExperience || player.hobbies || player.age || player.gender) && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              About {player.displayName || player.username}
            </Typography>
            
            <Grid container spacing={3}>
              {/* Bio */}
              {player.bio && (
                <Grid item xs={12}>
                  <Typography variant="body1" paragraph>
                    {player.bio}
                  </Typography>
                </Grid>
              )}

              {/* Location */}
              {(player.country || player.state) && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationIcon color="primary" />
                    <Typography variant="body1">
                      {[player.state, player.country].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Battle.net ID */}
              {player.hobbies?.startsWith('Battle.net: ') && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BattleNetIcon color="primary" />
                    <Typography variant="body1">
                      {player.hobbies.replace('Battle.net: ', '')}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Age */}
              {player.age && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="primary" />
                    <Typography variant="body1">
                      {player.age} years old
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Gender */}
              {player.gender && (
                <Grid item xs={12} sm={6} md={4}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon color="primary" />
                    <Typography variant="body1">
                      {player.gender === 'male' && 'Male'}
                      {player.gender === 'female' && 'Female'}
                      {player.gender === 'other' && 'Other'}
                    </Typography>
                  </Box>
                </Grid>
              )}

              {/* Diablo Experience */}
              {player.diabloExperience && (
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GamingIcon color="primary" />
                    <Typography variant="body1">
                      {player.diabloExperience === 'new' && 'New to Diablo II (Less than 1 year)'}
                      {player.diabloExperience === 'casual' && 'Casual player (1-3 years)'}
                      {player.diabloExperience === 'experienced' && 'Experienced player (3-10 years)'}
                      {player.diabloExperience === 'veteran' && 'Veteran player (10+ years)'}
                      {player.diabloExperience === 'original' && 'Original D2 player (Since 2000)'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}

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
                      pathColor: mode === 'dark' ? '#ff9800' : '#000000',
                      textColor: mode === 'dark' ? '#ffffff' : '#000000',
                      trailColor: mode === 'dark' ? '#333' : '#e0e0e0',
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
                            backgroundColor: mode === 'dark' ? '#ff9800' : '#000000'
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
                            backgroundColor: mode === 'dark' ? '#ff9800' : '#000000'
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
                              backgroundColor: mode === 'dark' ? '#ff9800' : '#000000'
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
                              backgroundColor: mode === 'dark' ? '#ff9800' : '#000000'
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
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrophyIcon sx={{ fontSize: '1.2rem', color: 'primary.main' }} />
                        <Typography component="span" variant="subtitle1" fontWeight="bold">
                          Profile Score
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography component="span" variant="h6" color="primary.main" fontWeight="bold">
                        {player.totalAchievementPoints} points
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider sx={{ my: 1 }} />
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                  Achievements ({achievements.length})
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={achievementSort}
                    label="Sort by"
                    onChange={(e) => setAchievementSort(e.target.value)}
                  >
                    <MenuItem value="points-desc">Points (High to Low)</MenuItem>
                    <MenuItem value="points-asc">Points (Low to High)</MenuItem>
                    <MenuItem value="rarity-legendary">Legendary First</MenuItem>
                    <MenuItem value="rarity-epic">Epic First</MenuItem>
                    <MenuItem value="rarity-rare">Rare First</MenuItem>
                    <MenuItem value="rarity-common">Common First</MenuItem>
                    <MenuItem value="date-desc">Recently Unlocked</MenuItem>
                    <MenuItem value="date-asc">Oldest First</MenuItem>
                    <MenuItem value="name">Name (A-Z)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              {achievements.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No achievements unlocked yet
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {sortedAchievements.map((userAchievement) => (
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
                          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                            <Box display="flex" gap={1}>
                              <Chip
                                size="small"
                                label={userAchievement.achievement.rarity}
                                className={`achievement-${userAchievement.achievement.rarity}`}
                              />
                              <Chip
                                size="small"
                                label={`${userAchievement.achievement.points} pts`}
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
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