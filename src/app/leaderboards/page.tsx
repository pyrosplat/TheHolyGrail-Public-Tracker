'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material'
import {
  EmojiEvents as TrophyIcon,
  TrendingUp as TrendingIcon,
  Speed as SpeedIcon,
  Whatshot as FireIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

interface LeaderboardEntry {
  rank: number
  id: string
  username: string
  displayName?: string
  avatarUrl?: string
  lastSyncAt?: string
  gameMode: string
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  progress: {
    overall: number
    normal: number
    ethereal: number
    runes: number
    runewords: number
    totalItems: number
    totalRunes: number
    totalRunewords: number
    armor: number
    weapons: number
    other: number
    sets: number
    ethArmor: number
    ethWeapons: number
    ethOther: number
  }
  statistics: {
    itemsPerDay: number
    currentStreak: number
    longestStreak: number
    grailStartedAt?: string
  }
  achievementCount: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  category: string
}

const categories = [
  { key: 'overall', label: 'Overall Progress', icon: <TrophyIcon /> },
  { key: 'recent', label: 'Most Recent', icon: <TrendingIcon /> },
  { key: 'speed', label: 'Items Per Day', icon: <SpeedIcon /> },
  { key: 'achievements', label: 'Most Achievements', icon: <TrophyIcon /> },
]

export default function LeaderboardsPage() {
  const { mode } = useTheme()
  const [activeTab, setActiveTab] = useState(0)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [gameMode, setGameMode] = useState('all')
  const [grailType, setGrailType] = useState('all')
  const [includeRunes, setIncludeRunes] = useState(false)
  const [includeRunewords, setIncludeRunewords] = useState(false)

  const currentCategory = categories[activeTab]?.key || 'overall'
  const itemsPerPage = 25

  useEffect(() => {
    fetchLeaderboard()
  }, [activeTab, page, gameMode, grailType, includeRunes, includeRunewords])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const offset = (page - 1) * itemsPerPage
      const params = new URLSearchParams({
        category: currentCategory,
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
        gameMode,
        grailType,
        includeRunes: includeRunes.toString(),
        includeRunewords: includeRunewords.toString(),
      })
      const response = await fetch(`/api/leaderboards?${params}`)
      const data = await response.json()

      if (data.success) {
        setLeaderboardData(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to load leaderboards')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    setPage(1) // Reset to first page when changing tabs
  }

  const handleFilterChange = () => {
    setPage(1) // Reset to first page when changing filters
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return '#FFD700' // Gold
      case 2: return '#C0C0C0' // Silver  
      case 3: return '#CD7F32' // Bronze
      default: return 'text.primary'
    }
  }

  const getRankIcon = (rank: number) => {
    return rank
  }

  const getProgressValue = (entry: LeaderboardEntry) => {
    switch (currentCategory) {
      case 'recent':
        // For recent, we'll return a timestamp or days since last sync
        return entry.lastSyncAt ? new Date(entry.lastSyncAt).getTime() : 0
      case 'speed':
        return entry.statistics?.itemsPerDay || 0
      case 'achievements':
        return entry.achievementCount
      default:
        return entry.progress.overall
    }
  }

  const getProgressLabel = (entry: LeaderboardEntry) => {
    switch (currentCategory) {
      case 'recent':
        if (!entry.lastSyncAt) return 'Never synced'
        const lastSync = new Date(entry.lastSyncAt)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff === 0) return 'Today'
        if (daysDiff === 1) return 'Yesterday' 
        return `${daysDiff} days ago`
      case 'speed':
        return `${entry.statistics?.itemsPerDay?.toFixed(1) || '0.0'} items/day`
      case 'achievements':
        return `${entry.achievementCount} achievements`
      default:
        return `${entry.progress.totalItems} items (${entry.progress.overall.toFixed(1)}%)`
    }
  }

  if (loading && !leaderboardData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    )
  }

  const totalPages = leaderboardData ? Math.ceil(leaderboardData.pagination.total / itemsPerPage) : 1

  return (
    <Box>
      <Typography variant="h2" gutterBottom textAlign="center" sx={{ color: mode === 'dark' ? '#ffffff' : 'inherit' }}>
        Leaderboards
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
        See how you stack up against other Holy Grail hunters
      </Typography>

      <Card>
        <CardContent>
          {/* Category Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            {categories.map((category, index) => (
              <Tab
                key={category.key}
                icon={category.icon}
                iconPosition="start"
                label={category.label}
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>

          {/* Filter Controls */}
          <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Game Mode</InputLabel>
                  <Select
                    value={gameMode}
                    label="Game Mode"
                    onChange={(e) => {
                      setGameMode(e.target.value)
                      handleFilterChange()
                    }}
                  >
                    <MenuItem value="all">All Modes</MenuItem>
                    <MenuItem value="softcore">Softcore</MenuItem>
                    <MenuItem value="hardcore">Hardcore</MenuItem>
                    <MenuItem value="manual">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Grail Type</InputLabel>
                  <Select
                    value={grailType}
                    label="Grail Type"
                    onChange={(e) => {
                      setGrailType(e.target.value)
                      handleFilterChange()
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="both">Both (Normal and Ethereal)</MenuItem>
                    <MenuItem value="normal">Normal Only</MenuItem>
                    <MenuItem value="ethereal">Ethereal Only</MenuItem>
                    <MenuItem value="each">Each Separately</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeRunes}
                      onChange={(e) => {
                        setIncludeRunes(e.target.checked)
                        handleFilterChange()
                      }}
                      size="small"
                    />
                  }
                  label="Include Runes"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={includeRunewords}
                      onChange={(e) => {
                        setIncludeRunewords(e.target.checked)
                        handleFilterChange()
                      }}
                      size="small"
                    />
                  }
                  label="Include Runewords"
                />
              </Grid>
            </Grid>
          </Card>

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Leaderboard Table */}
          {!loading && leaderboardData && (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell align="center">Progress</TableCell>
                      <TableCell align="center">Details</TableCell>
                      <TableCell align="center">Last Sync</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaderboardData.leaderboard.map((entry) => (
                      <TableRow
                        key={entry.id}
                        hover
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          },
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: entry.rank <= 3 ? getRankColor(entry.rank) : 'grey.600',
                                color: entry.rank <= 3 ? '#000' : '#fff',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                border: entry.rank <= 3 ? '2px solid rgba(0,0,0,0.2)' : 'none'
                              }}
                            >
                              {getRankIcon(entry.rank)}
                            </Avatar>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={entry.avatarUrl}
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: 'primary.main',
                              }}
                            >
                              {(entry.displayName || entry.username)[0]?.toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {entry.displayName || entry.username}
                              </Typography>
                              {entry.displayName && (
                                <Typography variant="body2" color="text.secondary">
                                  @{entry.username}
                                </Typography>
                              )}
                              <Box display="flex" gap={1} mt={1}>
                                <Chip
                                  size="small"
                                  label={entry.gameMode}
                                  color={entry.gameMode === 'Hardcore' ? 'error' : entry.gameMode === 'Softcore' ? 'primary' : 'default'}
                                  variant="outlined"
                                />
                                <Chip
                                  size="small"
                                  label={entry.grailType}
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Box minWidth={120}>
                            {currentCategory === 'speed' || currentCategory === 'achievements' || currentCategory === 'recent' ? (
                              <Typography variant="h6" color="primary">
                                {currentCategory === 'recent' ? (
                                  getProgressLabel(entry)
                                ) : (
                                  <>
                                    {getProgressValue(entry).toFixed(currentCategory === 'speed' ? 1 : 0)}
                                    {currentCategory === 'speed' && <Typography component="span" variant="body2">/day</Typography>}
                                  </>
                                )}
                              </Typography>
                            ) : (
                              <>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(getProgressValue(entry), 100)}
                                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  {getProgressValue(entry).toFixed(1)}%
                                </Typography>
                              </>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {currentCategory === 'recent' ? 
                              `${entry.progress.totalItems} items (${entry.progress.overall.toFixed(1)}%)` : 
                              getProgressLabel(entry)
                            }
                          </Typography>
                          <Box display="flex" justifyContent="center" gap={1} mt={1}>
                            {entry.statistics.currentStreak > 0 && (
                              <Chip
                                size="small"
                                icon={<FireIcon />}
                                label={`${entry.statistics.currentStreak}d streak`}
                                color="warning"
                                variant="outlined"
                              />
                            )}
                            {entry.achievementCount > 0 && (
                              <Chip
                                size="small"
                                icon={<TrophyIcon />}
                                label={entry.achievementCount}
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {entry.lastSyncAt 
                              ? new Date(entry.lastSyncAt).toLocaleDateString()
                              : 'Never'
                            }
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            href={`/player/${entry.username}`}
                          >
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={3}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}

              {/* Stats Summary */}
              <Box textAlign="center" mt={3} pt={3} borderTop={1} borderColor="divider">
                <Typography variant="body2" color="text.secondary">
                  Showing {leaderboardData.leaderboard.length} of {leaderboardData.pagination.total.toLocaleString()} players
                </Typography>
              </Box>
            </>
          )}

          {/* Empty State */}
          {!loading && leaderboardData && leaderboardData.leaderboard.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No players found
              </Typography>
              <Typography color="text.secondary">
                Be the first to start tracking your Holy Grail progress!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}