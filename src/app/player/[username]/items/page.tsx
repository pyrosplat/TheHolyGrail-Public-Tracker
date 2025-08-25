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
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material'

interface PlayerData {
  id: string
  username: string
  displayName?: string
  grailProgress: {
    gameMode: string
    grailType: string
    includeRunes: boolean
    includeRunewords: boolean
    overallCompletion: number
  }
}

interface CategorySummary {
  name: string
  owned: number
  exists: number
  percentage: number
}

interface ItemsData {
  categories: CategorySummary[]
  totalOwned: number
  totalExists: number
  overallPercentage: number
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  actualItems?: any
}

export default function PlayerItemsPage() {
  const params = useParams()
  const username = params.username as string
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [itemsData, setItemsData] = useState<ItemsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPlayerAndItems()
  }, [username])

  const fetchPlayerAndItems = async () => {
    try {
      setLoading(true)
      
      // Fetch player data
      const playerResponse = await fetch(`/api/player/${username}`)
      const playerData = await playerResponse.json()
      
      if (!playerResponse.ok) {
        setError(playerData.error || 'Player not found')
        return
      }
      
      setPlayer(playerData.data)
      
      // Fetch items category data
      const itemsResponse = await fetch(`/api/player/${username}/items`)
      const itemsResponseData = await itemsResponse.json()
      
      if (itemsResponse.ok) {
        setItemsData(itemsResponseData.data)
      } else {
        console.error('Failed to load items:', itemsResponseData.error)
        setError(itemsResponseData.error || 'Failed to load items data')
        return
      }
      
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  if (!itemsData) {
    return null // Will be handled by loading/error states below
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  if (!player) {
    return (
      <Box p={3}>
        <Alert severity="error">Player not found</Alert>
      </Box>
    )
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{ 
            fontFamily: '"Exocet", "serif"',
            textAlign: 'center'
          }}
        >
          {player?.displayName || player?.username}'s Grail Progress
        </Typography>
        <Box mb={2} display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {itemsData.totalOwned} of {itemsData.totalExists} items found
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#CC5F43',
              fontFamily: '"Exocet", "serif"',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {itemsData.overallPercentage.toFixed(1)}% complete
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap" mt={2} justifyContent="center">
            <Chip 
              label={`Grail Type: ${itemsData.grailType}`}
              color="primary" 
              variant="outlined"
            />
            {itemsData.includeRunes && (
              <Chip 
                label="Includes Runes" 
                color="secondary" 
                variant="outlined"
              />
            )}
            {itemsData.includeRunewords && (
              <Chip 
                label="Includes Runewords" 
                color="secondary" 
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Box>

      {/* Category Summary Cards */}
      <Grid container spacing={3}>
        {itemsData.categories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={category.name}>
            <Card 
              sx={{ 
                height: '100%',
                '&:hover': { boxShadow: 6 }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Typography variant="h6" component="h2">
                    {category.name}
                  </Typography>
                  <Chip 
                    label={`${category.percentage.toFixed(1)}%`}
                    color={category.percentage === 100 ? 'success' : category.percentage >= 75 ? 'warning' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="h4" color="primary" gutterBottom>
                  {category.owned}/{category.exists}
                </Typography>
                
                <Box sx={{ width: '100%', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(category.percentage, 100)} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: '#CC5F43'
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {category.exists - category.owned} remaining
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Overall Progress Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontFamily: '"Exocet", "serif"',
              textAlign: 'center'
            }}
          >
            Overall Progress Summary
          </Typography>
          
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} mb={2}>
            <Typography variant="h3" color="primary">
              {itemsData.totalOwned}/{itemsData.totalExists}
            </Typography>
            <Chip 
              label={`${itemsData.overallPercentage.toFixed(1)}% Complete`}
              sx={{ 
                backgroundColor: '#CC5F43',
                color: 'white',
                fontFamily: '"Exocet", "serif"',
                fontSize: '1.1rem'
              }}
              size="large"
            />
          </Box>
          
          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(itemsData.overallPercentage, 100)} 
              sx={{ 
                height: 12, 
                borderRadius: 6,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 6,
                  backgroundColor: '#CC5F43'
                }
              }}
            />
          </Box>
          
          <Typography variant="body1" color="text.secondary">
            {itemsData.totalExists - itemsData.totalOwned} items remaining to complete the grail
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}