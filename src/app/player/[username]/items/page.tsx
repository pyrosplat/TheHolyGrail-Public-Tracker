'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { useTheme } from '@/contexts/ThemeContext'

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

interface ItemData {
  name: string
  found: boolean
  type?: string
  key?: string
}

interface ItemsData {
  categories: CategorySummary[]
  totalOwned: number
  totalExists: number
  overallPercentage: number
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  actualItems?: {
    items: any
    ethItems: any
    runes: any
    runewords: any
  }
  categorizedItems?: {
    uniqueArmor: any[]
    uniqueWeapons: any[]
    uniqueOther: any[]
    sets: any[]
    ethUniqueArmor: any[]
    ethUniqueWeapons: any[]
    ethUniqueOther: any[]
    runes: any[]
    runewords: any[]
  }
}

export default function PlayerItemsPage() {
  const params = useParams()
  const { mode } = useTheme()
  const username = params.username as string
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [itemsData, setItemsData] = useState<ItemsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMissingItems, setShowMissingItems] = useState(false)
  const [sortBy, setSortBy] = useState<'itemCode' | 'alphabetical'>('itemCode')

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

  // Helper function to clean up item names
  const cleanItemName = (name: string): string => {
    return name.replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace(/([a-z])'([A-Z])/g, '$1\'$2')
      .replace(/\bOf\b/g, 'of')
      .replace(/\bThe\b/g, 'the')
      .replace(/\bAnd\b/g, 'and')
      .trim()
  }

  const processItemsForCategory = (categoryName: string): ItemData[] => {
    if (!itemsData?.categorizedItems) return []

    const items: ItemData[] = []
    const { categorizedItems } = itemsData
    
    // Get the category info to determine missing items count
    const categoryInfo = itemsData.categories.find(cat => cat.name === categoryName)

    // Use the server-side categorization directly
    switch (categoryName) {
      case 'Unique Armor':
        categorizedItems.uniqueArmor.forEach(item => {
          items.push({
            name: cleanItemName(item.name),
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Unique Weapons':
        categorizedItems.uniqueWeapons.forEach(item => {
          items.push({
            name: cleanItemName(item.name),
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Unique Other':
        categorizedItems.uniqueOther.forEach(item => {
          items.push({
            name: cleanItemName(item.name),
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Sets':
        categorizedItems.sets.forEach(item => {
          items.push({
            name: cleanItemName(item.name),
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Ethereal Unique Armor':
        categorizedItems.ethUniqueArmor.forEach(item => {
          items.push({
            name: `${cleanItemName(item.name)} (Ethereal)`,
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Ethereal Unique Weapons':
        categorizedItems.ethUniqueWeapons.forEach(item => {
          items.push({
            name: `${cleanItemName(item.name)} (Ethereal)`,
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Ethereal Unique Other':
        categorizedItems.ethUniqueOther.forEach(item => {
          items.push({
            name: `${cleanItemName(item.name)} (Ethereal)`,
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Runes':
        categorizedItems.runes.forEach(item => {
          items.push({
            name: cleanItemName(item.name),
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      case 'Runewords':
        categorizedItems.runewords.forEach(item => {
          const cleanName = cleanItemName(item.name).replace(/^Runeword\s*/i, '').trim()
          items.push({
            name: cleanName,
            found: true,
            type: item.type,
            key: item.key
          })
        })
        break

      default:
        break
    }

    // Add placeholder missing items if toggle is enabled
    if (showMissingItems && categoryInfo) {
      const missingCount = categoryInfo.exists - categoryInfo.owned
      for (let i = 0; i < missingCount; i++) {
        items.push({
          name: `Missing Item ${i + 1}`,
          found: false,
          type: 'unknown'
        })
      }
    }

    // Apply search filter
    let filteredItems = items
    if (searchTerm) {
      filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort items based on selected sorting method
    console.log(`Sorting ${categoryName} with sortBy=${sortBy}, items:`, filteredItems.map(i => ({ name: i.name, key: i.key })))
    
    return filteredItems.sort((a, b) => {
      // Always show found items first
      if (a.found !== b.found) {
        return a.found ? -1 : 1
      }
      
      if (sortBy === 'alphabetical') {
        // Alphabetical sorting by name
        return a.name.localeCompare(b.name)
      } else {
        // Item code sorting (default)
        
        // For runes, always sort by key if available (r01, r02, r03, etc.)
        if (categoryName === 'Runes' && a.key && b.key) {
          return a.key.localeCompare(b.key, undefined, { numeric: true })
        }
        
        // For all other categories, sort by item key if available, otherwise by name
        if (a.key && b.key) {
          return a.key.localeCompare(b.key, undefined, { numeric: true })
        }
        
        // Fallback to alphabetical if no keys
        return a.name.localeCompare(b.name)
      }
    })
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
            textAlign: 'center',
            color: mode === 'dark' ? '#ffffff' : 'inherit'
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

      {/* Search and Filter Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ flex: 1, minWidth: '300px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: '160px' }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as 'itemCode' | 'alphabetical')}
              >
                <MenuItem value="itemCode">Item Code</MenuItem>
                <MenuItem value="alphabetical">Alphabetical</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={showMissingItems}
                  onChange={(e) => setShowMissingItems(e.target.checked)}
                  color="primary"
                />
              }
              label="Show Missing Items"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Desktop Client Style Item Lists */}
      <Box>
        {itemsData.categories.map((category, index) => (
          <Card key={category.name} sx={{ mb: 3 }}>
            <CardContent>
              {/* Category Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography 
                  variant="h5" 
                  component="h2"
                  sx={{ 
                    fontFamily: '\"Exocet\", \"serif\"',
                    color: '#CC5F43'
                  }}
                >
                  {category.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
                    }}
                  >
                    {category.owned}/{category.exists}
                  </Typography>
                  <Chip 
                    label={`${category.percentage.toFixed(1)}%`}
                    color={category.percentage === 100 ? 'success' : category.percentage >= 75 ? 'warning' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>

              {/* Progress Bar */}
              <Box sx={{ width: '100%', mb: 3 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(category.percentage, 100)} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundColor: '#CC5F43'
                    }
                  }}
                />
              </Box>

              {/* Items List - Desktop Client Style */}
              <Box>
                {(() => {
                  const items = processItemsForCategory(category.name)
                  const foundItems = items.filter(item => item.found)
                  const missingItems = items.filter(item => !item.found)
                  
                  return items.length > 0 ? (
                    <Box>
                      {/* Results Summary */}
                      {(searchTerm || showMissingItems) && (
                        <Box sx={{ mb: 1, px: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm && `Search results: ${items.length} items found`}
                            {searchTerm && showMissingItems && ' • '}
                            {showMissingItems && `Found: ${foundItems.length}, Missing: ${missingItems.length}`}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Items Grid */}
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 1,
                        maxHeight: '300px',
                        overflow: 'auto',
                        border: `1px solid ${mode === 'dark' ? '#333' : '#ddd'}`,
                        borderRadius: 1,
                        p: 1,
                        backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f9f9f9'
                      }}
                    >
                      {items.map((item, itemIndex) => (
                        <Box 
                          key={`${item.name}-${itemIndex}`}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 0.5,
                            opacity: item.found ? 1 : 0.6,
                            '&:hover': {
                              backgroundColor: mode === 'dark' ? '#2a2a2a' : '#f0f0f0'
                            }
                          }}
                        >
                          {item.found ? (
                            <CheckCircleIcon 
                              sx={{ 
                                color: mode === 'dark' ? '#4caf50' : '#2e7d32',
                                fontSize: '18px'
                              }} 
                            />
                          ) : (
                            <RadioButtonUncheckedIcon 
                              sx={{ 
                                color: mode === 'dark' ? '#666' : '#ccc',
                                fontSize: '18px'
                              }} 
                            />
                          )}
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: item.found 
                                ? (mode === 'dark' ? '#ffffff' : '#000000')
                                : (mode === 'dark' ? '#999' : '#666'),
                              fontSize: '0.9rem',
                              fontStyle: item.found ? 'normal' : 'italic'
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                      ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box 
                      sx={{ 
                        p: 2, 
                        textAlign: 'center',
                        border: `1px dashed ${mode === 'dark' ? '#555' : '#ccc'}`,
                        borderRadius: 1,
                        backgroundColor: mode === 'dark' ? '#1a1a1a' : '#f9f9f9'
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No items found in this category yet
                      </Typography>
                    </Box>
                  )
                })()}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

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
            <Typography 
              variant="h3" 
              sx={{ 
                color: (theme) => theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
              }}
            >
              {itemsData.totalOwned}/{itemsData.totalExists}
            </Typography>
            <Chip 
              label={`${itemsData.overallPercentage.toFixed(1)}% Complete`}
              sx={{ 
                backgroundColor: '#CC5F43',
                color: 'white',
                fontFamily: '"Exocet", "serif"',
                fontSize: '1.1rem',
                height: '36px'
              }}
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