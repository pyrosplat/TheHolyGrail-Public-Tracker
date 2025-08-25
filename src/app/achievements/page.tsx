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
import {
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'

// Mock achievements data - in real app this would come from the API
const mockAchievements = [
  {
    id: '1',
    key: 'first_unique',
    name: 'First Blood',
    description: 'Find your first unique item',
    icon: '🏆',
    category: 'milestone',
    rarity: 'common',
    points: 10,
    unlockedBy: 1245,
  },
  {
    id: '2',
    key: 'grail_25',
    name: 'Quarter Master',
    description: 'Reach 25% Holy Grail completion',
    icon: '🌟',
    category: 'milestone',
    rarity: 'common',
    points: 50,
    unlockedBy: 892,
  },
  {
    id: '3',
    key: 'grail_50',
    name: 'Halfway There',
    description: 'Reach 50% Holy Grail completion',
    icon: '⭐',
    category: 'milestone',
    rarity: 'rare',
    points: 100,
    unlockedBy: 456,
  },
  {
    id: '4',
    key: 'grail_complete',
    name: 'Holy Grail Master',
    description: 'Complete the Holy Grail - find every item!',
    icon: '👑',
    category: 'completion',
    rarity: 'legendary',
    points: 2000,
    unlockedBy: 42,
  },
  {
    id: '5',
    key: 'all_runes',
    name: 'Rune Master',
    description: 'Find all 33 runes',
    icon: '🗿',
    category: 'completion',
    rarity: 'epic',
    points: 500,
    unlockedBy: 189,
  },
  {
    id: '6',
    key: 'speed_demon',
    name: 'Speed Demon',
    description: 'Find 10 items in a single day',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    points: 100,
    unlockedBy: 334,
  },
  {
    id: '7',
    key: 'dedication',
    name: 'Dedication',
    description: 'Find items for 100 consecutive days',
    icon: '🔥',
    category: 'speed',
    rarity: 'legendary',
    points: 1000,
    unlockedBy: 23,
  },
  {
    id: '8',
    key: 'rainbow_facets',
    name: 'Rainbow Collection',
    description: 'Find all 8 Rainbow Facet variants',
    icon: '🌈',
    category: 'special',
    rarity: 'legendary',
    points: 750,
    unlockedBy: 67,
  },
]

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
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const currentCategory = categories[activeTab]?.key || 'all'

  const filteredAchievements = mockAchievements.filter(achievement => 
    currentCategory === 'all' || achievement.category === currentCategory
  )

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const getRarityStats = () => {
    const stats = mockAchievements.reduce((acc, achievement) => {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(stats).map(([rarity, count]) => ({
      rarity: rarity.charAt(0).toUpperCase() + rarity.slice(1),
      count,
      color: rarityColors[rarity as keyof typeof rarityColors],
    }))
  }

  const totalPoints = mockAchievements.reduce((sum, achievement) => sum + achievement.points, 0)
  const totalUnlocks = mockAchievements.reduce((sum, achievement) => sum + achievement.unlockedBy, 0)

  return (
    <Box>
      <Typography variant="h2" gutterBottom textAlign="center">
        Achievements
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
        Unlock achievements by reaching milestones in your Holy Grail journey
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {mockAchievements.length}
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
                Rarity Distribution
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {getRarityStats().map((stat) => (
                  <Box key={stat.rarity} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      size="small"
                      label={stat.rarity}
                      sx={{ 
                        backgroundColor: stat.color, 
                        color: stat.rarity === 'Legendary' ? 'black' : 'white',
                        minWidth: '70px'
                      }}
                    />
                    <Typography variant="body2">{stat.count}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                    variant="outlined"
                    sx={{
                      border: '2px solid',
                      borderColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${rarityColors[achievement.rarity as keyof typeof rarityColors]}30`,
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
                          value={(achievement.unlockedBy / 1500) * 100} // Assuming 1500 total players
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: rarityColors[achievement.rarity as keyof typeof rarityColors],
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                          {((achievement.unlockedBy / 1500) * 100).toFixed(1)}% of players
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!loading && filteredAchievements.length === 0 && (
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