'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Tabs,
  Tab,
  LinearProgress,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { useTheme } from '@/contexts/ThemeContext'
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'
import Link from 'next/link'

interface Achievement {
  id: string
  key: string
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  points: number
  unlockedBy: number
  unlockedPercentage: number
}

const categories = [
  { key: 'all', label: 'All Achievements', icon: <TrophyIcon /> },
  { key: 'milestone', label: 'Milestones', icon: <TimelineIcon /> },
  { key: 'completion', label: 'Completion', icon: <CheckIcon /> },
  { key: 'speed', label: 'Speed', icon: <SpeedIcon /> },
  { key: 'special', label: 'Special', icon: <StarIcon /> },
]

const rarityColors = {
  common: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
}

export default function AchievementsPage() {
  const { mode } = useTheme()
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null)
  
  const currentCategory = categories[activeTab]?.key || 'all'

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = currentCategory === 'all' || achievement.category === currentCategory
    const rarityMatch = !selectedRarity || achievement.rarity === selectedRarity
    return categoryMatch && rarityMatch
  })

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/achievements')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAchievements(data.data)
        } else {
          setError(data.error)
        }
      } else {
        setError('Failed to load achievements')
      }
      
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const getRarityStats = () => {
    if (achievements.length === 0) return []
    
    const stats = achievements.reduce((acc, achievement) => {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(stats).map(([rarity, count]) => ({
      rarity: rarity.charAt(0).toUpperCase() + rarity.slice(1),
      count,
      color: rarityColors[rarity as keyof typeof rarityColors],
    }))
  }

  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0)
  const totalUnlocks = achievements.reduce((sum, achievement) => sum + achievement.unlockedBy, 0)

  return (
    <Box>
      <Typography variant="h2" gutterBottom textAlign="center">
        Achievements
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
        Unlock achievements by reaching milestones in your Holy Grail journey
      </Typography>

      {/* Stats Overview - Only show when we have achievements */}
      {achievements.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {achievements.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Achievements
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="warning.main" gutterBottom>
                  {totalPoints.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Points Available
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" gutterBottom>
                  {totalUnlocks.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Unlocks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom textAlign="center">
                  Rarity Filter
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* All Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label="All"
                      clickable
                      variant={selectedRarity === null ? 'filled' : 'outlined'}
                      onClick={() => setSelectedRarity(null)}
                      sx={{ 
                        backgroundColor: selectedRarity === null ? 'white' : 'transparent',
                        color: selectedRarity === null ? 'black' : 'text.primary',
                        minWidth: '70px',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: selectedRarity === null ? '#f5f5f5' : 'action.hover',
                        }
                      }}
                    />
                    <Typography variant="body2">{achievements.length}</Typography>
                  </Box>
                  
                  {/* Rarity Chips */}
                  {getRarityStats().map((stat) => (
                    <Box key={stat.rarity} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={stat.rarity}
                        clickable
                        onClick={() => setSelectedRarity(stat.rarity.toLowerCase())}
                        sx={{ 
                          backgroundColor: selectedRarity === stat.rarity.toLowerCase() 
                            ? stat.color 
                            : selectedRarity === null 
                              ? stat.color 
                              : 'rgba(128, 128, 128, 0.3)',
                          color: selectedRarity === stat.rarity.toLowerCase() || selectedRarity === null
                            ? (stat.rarity === 'Legendary' ? 'black' : 'white')
                            : 'text.secondary',
                          minWidth: '70px',
                          cursor: 'pointer',
                          opacity: selectedRarity === null || selectedRarity === stat.rarity.toLowerCase() ? 1 : 0.5,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: stat.color,
                            color: stat.rarity === 'Legendary' ? 'black' : 'white',
                            opacity: 1,
                            transform: 'scale(1.05)',
                          }
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: selectedRarity === null || selectedRarity === stat.rarity.toLowerCase() ? 1 : 0.5,
                          transition: 'opacity 0.2s ease'
                        }}
                      >
                        {stat.count}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

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

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          )}

          {/* Achievements Grid */}
          {!loading && (
            <Grid container spacing={3}>
              {filteredAchievements.map((achievement) => (
                <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                  <Card
                    component={Link}
                    href={`/achievements/${achievement.id}`}
                    variant="outlined"
                    sx={{
                      border: '2px solid',
                      borderColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                      height: '100%',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 12px 30px ${rarityColors[achievement.rarity as keyof typeof rarityColors]}50`,
                        borderColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                        borderWidth: '3px',
                      },
                      '&:active': {
                        transform: 'translateY(-4px) scale(1.01)',
                      },
                    }}
                  >
                    <CardContent>
                      {/* Achievement Header */}
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                            borderRadius: '50%',
                            fontSize: '24px',
                          }}
                        >
                          {achievement.icon}
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" component="div" gutterBottom>
                            {achievement.name}
                          </Typography>
                          <Chip
                            size="small"
                            label={achievement.rarity}
                            sx={{
                              backgroundColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                              color: achievement.rarity === 'legendary' ? 'black' : 'white',
                              textTransform: 'capitalize',
                            }}
                          />
                        </Box>
                      </Box>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary" mb={3} minHeight="2.5em">
                        {achievement.description}
                      </Typography>

                      {/* Footer */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <TrophyIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2" fontWeight="bold">
                            {achievement.points} pts
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {achievement.unlockedBy.toLocaleString()} unlocked
                        </Typography>
                      </Box>

                      {/* Progress bar for unlock rate */}
                      <Box mt={2}>
                        <LinearProgress
                          variant="determinate"
                          value={achievement.unlockedPercentage}
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                          {achievement.unlockedPercentage.toFixed(1)}% of players ({achievement.unlockedBy} users)
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && achievements.length === 0 && (
            <Box textAlign="center" py={8}>
              <TrophyIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h4" color="text.secondary" gutterBottom>
                Achievements Coming Soon!
              </Typography>
              <Typography color="text.secondary" mb={4}>
                The achievement system is being built. Soon you'll be able to unlock achievements for completing milestones in your Holy Grail journey.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Achievement categories will include milestones, completion challenges, speed runs, and special accomplishments.
              </Typography>
            </Box>
          )}
          
          {!loading && achievements.length > 0 && filteredAchievements.length === 0 && (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No achievements in this category
              </Typography>
              <Typography color="text.secondary">
                Try selecting a different category above
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Achievement Categories Info */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Achievement Categories
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText
                primary="Milestones"
                secondary="Progress-based achievements for reaching completion percentages and first items"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CheckIcon />
              </ListItemIcon>
              <ListItemText
                primary="Completion"
                secondary="Achievements for completing entire categories like all sets, all runes, or the full grail"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <SpeedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Speed"
                secondary="Time-based achievements for finding items quickly or maintaining streaks"
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <StarIcon />
              </ListItemIcon>
              <ListItemText
                primary="Special"
                secondary="Unique achievements for rare finds, community participation, and exceptional accomplishments"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}