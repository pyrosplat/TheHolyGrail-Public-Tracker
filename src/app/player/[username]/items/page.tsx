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
import { categorizeItem, getItemInfo, cleanItemName, itemMappings } from '@/lib/itemMappings'
import { runesMapping, reverseRunesMap } from '@/lib/runesMapping'
import { runewordsMapping } from '@/lib/runewordsMapping'
import { silospenMapping } from '@/lib/silospenMapping'

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
  subCategory?: string
}

interface ItemsData {
  categories: CategorySummary[]
  totalOwned: number
  totalExists: number
  overallPercentage: number
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  rawItems: {
    items: any
    ethItems: any
    runes: any
    runewords: any
  }
}

interface CategorizedItems {
  uniqueArmor: ItemData[]
  uniqueWeapons: ItemData[]
  uniqueOther: ItemData[]
  sets: ItemData[]
  ethUniqueArmor: ItemData[]
  ethUniqueWeapons: ItemData[]
  ethUniqueOther: ItemData[]
  runes: ItemData[]
  runewords: ItemData[]
}

export default function PlayerItemsPage() {
  const params = useParams()
  const { mode } = useTheme()
  const username = params.username as string
  const [player, setPlayer] = useState<PlayerData | null>(null)
  const [itemsData, setItemsData] = useState<ItemsData | null>(null)
  const [categorizedItems, setCategorizedItems] = useState<CategorizedItems | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMissingItems, setShowMissingItems] = useState(false)

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
        const data = itemsResponseData.data
        setItemsData(data)
        
        // Perform client-side categorization
        const categorized = categorizeRawItems(data.rawItems)
        setCategorizedItems(categorized)
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

  // Helper function to detect set items using desktop client mapping
  const isSetItem = (key: string): boolean => {
    // First check if it's explicitly a unique item that should never be a set
    const uniqueItems = [
      'thecatseye', 'tyraelsmight', 'verdungosheartycord', 'thereaperstoll', 
      'blackhornsface', 'naturespeace', 'gheedsfortune', 'credendum'
    ];
    
    // Also exclude all Immortal King items (they're uniques, not sets)
    const keyLower = key.toLowerCase();
    if (uniqueItems.includes(keyLower) || keyLower.includes('immortalking')) {
      return false;
    }
    
    // Check if the item is in silospenMapping and has a set-like name
    const displayName = silospenMapping[keyLower]
    if (displayName) {
      const nameLower = displayName.toLowerCase()
      // Only check for specific set name patterns, not generic possessives
      const setPatterns = [
        "aldur's", "angelic", "arctic gear", "berserker", "bul-kathos'", 
        "cathan's", "civerb's", "cleglaw's", "cow king's", "death's disguise", 
        "griswold's", "hsarus'", "hwanin's", "infernal tools", "iratha's", 
        "isenhart's", "m'avina's", "milabrega's", "naj's", "natalya's", 
        "orphan's", "sander's", "sazabi's", "sigon's", "tal rasha's", 
        "tancred's", "trang-oul's", "vidala's"
      ]
      return setPatterns.some(pattern => nameLower.includes(pattern))
    }
    
    // Fallback to key-based detection
    const setKeyPatterns = [
      'aldur', 'angelic', 'arctic', 'berserker', 'bulkathos', 'cathan', 
      'civerb', 'cleglaw', 'cow', 'griswold', 'hsarus',
      'hwanin', 'infernal', 'iratha', 'isenhart', 
      'mavina', 'milabrega', 'naj', 'natalya', 'orphan', 'sander', 
      'sazabi', 'sigon', 'tal', 'tancred', 'trang', 'vidala'
    ]
    return setKeyPatterns.some(pattern => keyLower.includes(pattern))
  }

  // Helper function to detect runes using desktop client mapping
  const isRune = (key: string): boolean => {
    const keyLower = key.toLowerCase()
    
    // Check if it's in the reverse runes map (rune name to ID)
    if (reverseRunesMap[keyLower]) {
      return true
    }
    
    // Check if it's a rune ID (r01, r02, etc) in the runesMapping
    if (runesMapping[key as any]) {
      return true
    }
    
    // Check if it's in the silospenMapping and matches a rune name
    const displayName = silospenMapping[keyLower]
    if (displayName) {
      const displayLower = displayName.toLowerCase()
      if (reverseRunesMap[displayLower]) {
        return true
      }
      
      // Check if it matches any rune name in runesMapping
      for (const runeId in runesMapping) {
        if (runesMapping[runeId].name.toLowerCase() === displayLower) {
          return true
        }
      }
    }
    
    return false
  }

  // Helper function to detect runewords using desktop client mapping
  const isRuneword = (key: string): boolean => {
    // Check if the key exists in the runewords mapping (exact match)
    if (runewordsMapping[key]) {
      return true
    }
    
    const keyLower = key.toLowerCase()
    
    // Check for runeword prefix pattern (runewordblack, runewordinsight, etc.)
    if (keyLower.startsWith('runeword')) {
      const runewordName = keyLower.replace(/^runeword/, '') // Remove "runeword" prefix
      
      // Check if the remaining part matches any runeword name
      for (const mappingName in runewordsMapping) {
        // Direct match
        if (mappingName.toLowerCase() === runewordName) {
          return true
        }
        
        // Match with spaces and special characters removed
        const normalizedMappingName = mappingName.toLowerCase().replace(/[\s\-']/g, '')
        if (normalizedMappingName === runewordName) {
          return true
        }
      }
    }
    
    // Check case-insensitive match
    for (const runewordName in runewordsMapping) {
      if (runewordName.toLowerCase() === keyLower) {
        return true
      }
    }
    
    // Check if it's in the silospenMapping and looks like a runeword
    const displayName = silospenMapping[keyLower]
    if (displayName) {
      // Check if this display name matches any runeword name
      for (const runewordName in runewordsMapping) {
        if (runewordsMapping[runewordName].name.toLowerCase() === displayName.toLowerCase()) {
          return true
        }
      }
    }
    
    return false
  }

  // Helper function to get all possible items for a category
  const getAllPossibleItemsForCategory = (categoryName: string): ItemData[] => {
    const items: ItemData[] = []
    
    switch (categoryName) {
      case 'Unique Weapons':
        Object.entries(itemMappings).forEach(([key, itemInfo]) => {
          if (itemInfo.category === 'weapons') {
            items.push({
              key,
              name: silospenMapping[key] || itemInfo.name,
              found: false, // Will be updated later
              type: 'weapon',
              subCategory: itemInfo.subCategory
            })
          }
        })
        break
        
      case 'Unique Armor':
        Object.entries(itemMappings).forEach(([key, itemInfo]) => {
          if (itemInfo.category === 'armor') {
            items.push({
              key,
              name: silospenMapping[key] || itemInfo.name,
              found: false,
              type: 'armor',
              subCategory: itemInfo.subCategory
            })
          }
        })
        break
        
      case 'Unique Other':
        Object.entries(itemMappings).forEach(([key, itemInfo]) => {
          if (itemInfo.category === 'other') {
            items.push({
              key,
              name: silospenMapping[key] || itemInfo.name,
              found: false,
              type: 'other',
              subCategory: itemInfo.subCategory
            })
          }
        })
        break
        
      case 'Sets':
        // Add all set items from silospenMapping that match set patterns
        Object.entries(silospenMapping).forEach(([key, displayName]) => {
          if (isSetItem(key)) {
            items.push({
              key,
              name: displayName,
              found: false,
              type: 'set',
              subCategory: 'Sets'
            })
          }
        })
        break
        
      case 'Runes':
        Object.entries(runesMapping).forEach(([runeId, runeInfo]) => {
          items.push({
            key: runeId,
            name: runeInfo.name,
            found: false,
            type: 'rune',
            subCategory: 'Runes'
          })
        })
        break
        
      case 'Runewords':
        Object.entries(runewordsMapping).forEach(([runewordName, runewordInfo]) => {
          items.push({
            key: runewordName.toLowerCase(),
            name: runewordInfo.name,
            found: false,
            type: 'runeword',
            subCategory: 'Runewords'
          })
        })
        break
        
      // Handle ethereal categories
      case 'Ethereal Unique Weapons':
        Object.entries(itemMappings).forEach(([key, itemInfo]) => {
          if (itemInfo.category === 'weapons') {
            items.push({
              key: `eth_${key}`,
              name: `${silospenMapping[key] || itemInfo.name} (Ethereal)`,
              found: false,
              type: 'ethweapon',
              subCategory: itemInfo.subCategory
            })
          }
        })
        break
        
      case 'Ethereal Unique Armor':
        Object.entries(itemMappings).forEach(([key, itemInfo]) => {
          if (itemInfo.category === 'armor') {
            items.push({
              key: `eth_${key}`,
              name: `${silospenMapping[key] || itemInfo.name} (Ethereal)`,
              found: false,
              type: 'etharmor',
              subCategory: itemInfo.subCategory
            })
          }
        })
        break
        
      case 'Ethereal Unique Other':
        Object.entries(itemMappings).forEach(([key, itemInfo]) => {
          if (itemInfo.category === 'other') {
            items.push({
              key: `eth_${key}`,
              name: `${silospenMapping[key] || itemInfo.name} (Ethereal)`,
              found: false,
              type: 'ethother',
              subCategory: itemInfo.subCategory
            })
          }
        })
        break
    }
    
    return items
  }

  // Client-side categorization function
  const categorizeRawItems = (rawItems: any): CategorizedItems => {
    const result: CategorizedItems = {
      uniqueArmor: [],
      uniqueWeapons: [],
      uniqueOther: [],
      sets: [],
      ethUniqueArmor: [],
      ethUniqueWeapons: [],
      ethUniqueOther: [],
      runes: [],
      runewords: []
    }

    // Process regular items
    if (rawItems.items) {
      Object.entries(rawItems.items).forEach(([key, item]: [string, any]) => {
        // Skip runes and runewords - they should only be processed from their dedicated sections
        if (isRune(key) || isRuneword(key)) {
          return
        }
        
        // First check if it's a set item
        if (isSetItem(key)) {
          let displayName = cleanItemName(key)
          
          // Try to get name from desktop client mapping
          if (silospenMapping[key.toLowerCase()]) {
            displayName = silospenMapping[key.toLowerCase()]
          }
          
          result.sets.push({
            key,
            name: displayName,
            found: true,
            type: 'set',
            subCategory: 'Sets'
          })
          return
        }
        
        // Then use our categorization logic for unique items
        const categorized = categorizeItem(key, false)
        const itemData: ItemData = {
          key,
          name: categorized.displayName,
          found: true,
          type: categorized.category,
          subCategory: categorized.subCategory
        }
        
        if (categorized.category === 'armor') {
          result.uniqueArmor.push(itemData)
        } else if (categorized.category === 'weapons') {
          result.uniqueWeapons.push(itemData)
        } else {
          // Debug: Log items going to "Unique Other" to identify misplaced items
          console.warn(`Item "${key}" (${categorized.displayName}) categorized as "other"`)
          result.uniqueOther.push(itemData)
        }
      })
    }

    // Process ethereal items (only unique items can be ethereal, not sets)
    if (rawItems.ethItems) {
      Object.entries(rawItems.ethItems).forEach(([key, item]: [string, any]) => {
        // Skip runes and runewords - they should only be processed from their dedicated sections
        if (isRune(key) || isRuneword(key)) {
          return
        }
        
        const categorized = categorizeItem(key, true)
        const itemData: ItemData = {
          key,
          name: categorized.displayName,
          found: true,
          type: categorized.category,
          subCategory: categorized.subCategory
        }
        
        if (categorized.category === 'etharmor') {
          result.ethUniqueArmor.push(itemData)
        } else if (categorized.category === 'ethweapons') {
          result.ethUniqueWeapons.push(itemData)
        } else {
          result.ethUniqueOther.push(itemData)
        }
      })
    }

    // Process runes using desktop client mapping
    if (rawItems.runes) {
      Object.entries(rawItems.runes).forEach(([key, rune]: [string, any]) => {
        let displayName = cleanItemName(key)
        let standardizedKey = key
        
        // Try to get name from desktop client mapping
        const runeId = reverseRunesMap[key.toLowerCase()]
        if (runeId && runesMapping[runeId]) {
          displayName = runesMapping[runeId].name
          standardizedKey = runeId // Use the standardized rune ID (r01, r02, etc.)
        } else if (runesMapping[key as any]) {
          displayName = runesMapping[key as any].name
          standardizedKey = key // Already in correct format
        }
        
        result.runes.push({
          key: standardizedKey,
          name: displayName,
          found: true,
          type: 'rune',
          subCategory: 'Runes'
        })
      })
    }

    // Process runewords using desktop client mapping
    if (rawItems.runewords) {
      Object.entries(rawItems.runewords).forEach(([key, runeword]: [string, any]) => {
        let displayName = cleanItemName(key)
        
        // Try to get name from desktop client mapping
        if (runewordsMapping[key]) {
          displayName = runewordsMapping[key].name
        } else {
          // Handle runeword prefix pattern (runewordblack -> Black, runewordcalltoarms -> Call to Arms, etc.)
          const keyLower = key.toLowerCase()
          if (keyLower.startsWith('runeword')) {
            const runewordName = keyLower.replace(/^runeword/, '')
            
            // Find matching runeword by name
            for (const mappingName in runewordsMapping) {
              // Direct match
              if (mappingName.toLowerCase() === runewordName) {
                displayName = runewordsMapping[mappingName].name
                break
              }
              
              // Match with spaces and special characters removed (calltoarms -> Call to Arms)
              const normalizedMappingName = mappingName.toLowerCase().replace(/[\s\-']/g, '')
              if (normalizedMappingName === runewordName) {
                displayName = runewordsMapping[mappingName].name
                break
              }
            }
          }
        }
        
        result.runewords.push({
          key,
          name: displayName,
          found: true,
          type: 'runeword',
          subCategory: 'Runewords'
        })
      })
    }

    return result
  }

  // Use the helper function from itemMappings for consistent item name cleaning


  const processItemsForCategory = (categoryName: string): ItemData[] => {
    if (!categorizedItems || !itemsData) return []

    const items: ItemData[] = []
    
    // Get the category info - trust server-side counts completely
    const categoryInfo = itemsData.categories.find(cat => cat.name === categoryName)
    if (!categoryInfo) return []

    // Use the server-side categorization directly
    switch (categoryName) {
      case 'Unique Armor':
        categorizedItems.uniqueArmor.forEach(item => {
          items.push({
            name: item.name, // Already properly formatted from categorization
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Unique Weapons':
        categorizedItems.uniqueWeapons.forEach(item => {
          items.push({
            name: item.name, // Already properly formatted from categorization
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Unique Other':
        categorizedItems.uniqueOther.forEach(item => {
          items.push({
            name: item.name, // Already properly formatted from categorization
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Sets':
        categorizedItems.sets.forEach(item => {
          items.push({
            name: item.name, // Already properly formatted from categorization
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Ethereal Unique Armor':
        categorizedItems.ethUniqueArmor.forEach(item => {
          items.push({
            name: `${item.name} (Ethereal)`, // Already properly formatted
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Ethereal Unique Weapons':
        categorizedItems.ethUniqueWeapons.forEach(item => {
          items.push({
            name: `${item.name} (Ethereal)`, // Already properly formatted
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Ethereal Unique Other':
        categorizedItems.ethUniqueOther.forEach(item => {
          items.push({
            name: `${item.name} (Ethereal)`, // Already properly formatted
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Runes':
        categorizedItems.runes.forEach(item => {
          items.push({
            name: item.name, // Already properly formatted from categorization
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      case 'Runewords':
        categorizedItems.runewords.forEach(item => {
          items.push({
            name: item.name.replace(/^Runeword\s*/i, '').trim(), // Remove runeword prefix if present
            found: true,
            type: item.type,
            key: item.key,
            subCategory: item.subCategory
          })
        })
        break

      default:
        break
    }

    // Add actual missing items if toggle is enabled
    if (showMissingItems) {
      // Get all possible items for this category
      const allPossibleItems = getAllPossibleItemsForCategory(categoryName)
      
      // Create comprehensive sets for found item matching
      const foundItemKeys = new Set(items.map(item => (item as any).key).filter(Boolean))
      const foundItemNames = new Set(items.map(item => item.name.toLowerCase()))
      
      // Add missing items with their actual names
      allPossibleItems.forEach(possibleItem => {
        // Check multiple ways the item might be identified
        const isFoundByKey = possibleItem.key && foundItemKeys.has(possibleItem.key)
        const isFoundByName = foundItemNames.has(possibleItem.name.toLowerCase())
        const isFoundBySimilarName = items.some(item => {
          // Remove common variations like (Ethereal) suffix for comparison
          const cleanFoundName = item.name.replace(/\s*\(Ethereal\)\s*$/i, '').toLowerCase()
          const cleanPossibleName = possibleItem.name.replace(/\s*\(Ethereal\)\s*$/i, '').toLowerCase()
          return cleanFoundName === cleanPossibleName
        })
        
        const isFound = isFoundByKey || isFoundByName || isFoundBySimilarName
        
        if (!isFound) {
          items.push({
            ...possibleItem,
            found: false
          })
        }
      })
      
      // Debug: Log when client-side count doesn't match server-side count
      const clientFoundCount = items.filter(item => item.found).length
      if (clientFoundCount !== categoryInfo.owned) {
        console.warn(`Count mismatch for ${categoryName}: Client found ${clientFoundCount}, Server reports ${categoryInfo.owned}`)
        console.warn('Client found items:', items.filter(item => item.found).map(item => item.name))
      }
    }

    // Apply search filter and subcategory filter
    let filteredItems = items
    if (searchTerm) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Simple sorting: found items first, then by type-specific order
    return filteredItems.sort((a, b) => {
      // Always show found items first
      if (a.found !== b.found) {
        return a.found ? -1 : 1
      }
      
      // Special sorting for runes: by rune number instead of alphabetical
      if (a.type === 'rune' && b.type === 'rune') {
        const runeIdA = a.key || ''
        const runeIdB = b.key || ''
        
        // Extract numeric part from rune IDs (r01, r02, etc.) for proper numeric sorting
        const getRuneNumber = (runeId: string) => {
          const match = runeId.match(/r(\d+)/)
          return match ? parseInt(match[1], 10) : 0
        }
        
        const numA = getRuneNumber(runeIdA)
        const numB = getRuneNumber(runeIdB)
        
        return numA - numB
      }
      
      // Then alphabetical by name for other items
      return a.name.localeCompare(b.name)
    })
  }


  if (!itemsData || !categorizedItems) {
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
                            {showMissingItems && `Found: ${category.owned}, Missing: ${category.exists - category.owned} (Server counts)`}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Items Grid */}
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 1,
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