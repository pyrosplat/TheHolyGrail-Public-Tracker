import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface CategorySummary {
  name: string
  owned: number
  exists: number
  percentage: number
}

interface ItemsResponse {
  categories: CategorySummary[]
  totalOwned: number
  totalExists: number
  overallPercentage: number
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  // Raw item data for client-side categorization
  rawItems: {
    items: any
    ethItems: any
    runes: any
    runewords: any
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    // Get player data
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        grailProgress: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    // If no grail progress, return default categories with 0 owned items to enable missing items display
    if (!user.grailProgress) {
      // Use actual item counts from the mappings
      const armorCount = 125
      const weaponsCount = 199  
      const otherCount = 24
      const setsCount = 105
      const runesCount = 33
      const runewordsCount = 93

      // For default (no grail progress), show all possible sections so users can see options
      // But we'll default to 'Each' type to show ethereal sections
      const defaultGrailType = 'Each'
      
      const defaultCategories: CategorySummary[] = [
        { name: 'Unique Armor', owned: 0, exists: armorCount, percentage: 0 },
        { name: 'Unique Weapons', owned: 0, exists: weaponsCount, percentage: 0 },
        { name: 'Unique Other', owned: 0, exists: otherCount, percentage: 0 },
        { name: 'Sets', owned: 0, exists: setsCount, percentage: 0 },
        { name: 'Ethereal Unique Armor', owned: 0, exists: armorCount, percentage: 0 },
        { name: 'Ethereal Unique Weapons', owned: 0, exists: weaponsCount, percentage: 0 },
        // Note: No Ethereal Unique Other - rings, amulets, charms cannot be ethereal
        { name: 'Runes', owned: 0, exists: runesCount, percentage: 0 },
        { name: 'Runewords', owned: 0, exists: runewordsCount, percentage: 0 }
      ]

      const totalItems = armorCount + weaponsCount + otherCount + setsCount + armorCount + weaponsCount + runesCount + runewordsCount // armor+weapons have ethereal versions, other+sets do not

      const emptyResponse: ItemsResponse = {
        categories: defaultCategories,
        totalOwned: 0,
        totalExists: totalItems,
        overallPercentage: 0,
        grailType: defaultGrailType,
        includeRunes: true,
        includeRunewords: true,
        rawItems: {
          items: {},
          ethItems: {},
          runes: {},
          runewords: {}
        }
      }

      return NextResponse.json({
        success: true,
        data: emptyResponse,
        grailProgress: null
      })
    }

    const grailProgress = user.grailProgress
    const categories: CategorySummary[] = []

    // Use the detailed category counts that are synced from the desktop client
    // These match exactly what the desktop client shows
    
    // Add unique armor
    if (grailProgress.armorExists > 0) {
      categories.push({
        name: 'Unique Armor',
        owned: grailProgress.armorOwned,
        exists: grailProgress.armorExists,
        percentage: grailProgress.armorExists > 0 ? (grailProgress.armorOwned / grailProgress.armorExists) * 100 : 0
      })
    }

    // Add unique weapons
    if (grailProgress.weaponsExists > 0) {
      categories.push({
        name: 'Unique Weapons',
        owned: grailProgress.weaponsOwned,
        exists: grailProgress.weaponsExists,
        percentage: grailProgress.weaponsExists > 0 ? (grailProgress.weaponsOwned / grailProgress.weaponsExists) * 100 : 0
      })
    }

    // Add unique other
    if (grailProgress.otherExists > 0) {
      categories.push({
        name: 'Unique Other',
        owned: grailProgress.otherOwned,
        exists: grailProgress.otherExists,
        percentage: grailProgress.otherExists > 0 ? (grailProgress.otherOwned / grailProgress.otherExists) * 100 : 0
      })
    }

    // Add sets
    if (grailProgress.setsExists > 0) {
      categories.push({
        name: 'Sets',
        owned: grailProgress.setsOwned,
        exists: grailProgress.setsExists,
        percentage: grailProgress.setsExists > 0 ? (grailProgress.setsOwned / grailProgress.setsExists) * 100 : 0
      })
    }

    // Add ethereal categories if applicable
    const grailType = grailProgress.grailType
    const showEtherealSeparately = grailType?.toLowerCase() === 'ethereal' || grailType?.toLowerCase() === 'each'
    
    console.log(`DEBUG: Items API for ${username}:`, {
      grailType,
      showEtherealSeparately,
      ethArmorExists: grailProgress.ethArmorExists,
      ethWeaponsExists: grailProgress.ethWeaponsExists,
      hasGrailProgress: !!grailProgress
    })
    
    if (showEtherealSeparately) {
      // For grail type "Each", always use the full possible counts
      // For grail type "Ethereal", use the actual counts from progress (may be subset)
      const ethArmorExists = (grailType?.toLowerCase() === 'each') ? 125 : (grailProgress.ethArmorExists || 125)
      const ethWeaponsExists = (grailType?.toLowerCase() === 'each') ? 199 : (grailProgress.ethWeaponsExists || 199)
      
      categories.push({
        name: 'Ethereal Unique Armor',
        owned: grailProgress.ethArmorOwned || 0,
        exists: ethArmorExists,
        percentage: ethArmorExists > 0 ? ((grailProgress.ethArmorOwned || 0) / ethArmorExists) * 100 : 0
      })

      categories.push({
        name: 'Ethereal Unique Weapons',
        owned: grailProgress.ethWeaponsOwned || 0,
        exists: ethWeaponsExists,
        percentage: ethWeaponsExists > 0 ? ((grailProgress.ethWeaponsOwned || 0) / ethWeaponsExists) * 100 : 0
      })

      // Note: Ethereal Unique Other removed - rings, amulets, charms cannot be ethereal
    }

    // Add runes if enabled
    if (grailProgress.includeRunes && grailProgress.totalRunes >= 0) {
      categories.push({
        name: 'Runes',
        owned: grailProgress.totalRunes,
        exists: 33, // Total runes in D2R
        percentage: grailProgress.totalRunes >= 0 ? (grailProgress.totalRunes / 33) * 100 : 0
      })
    }

    // Add runewords if enabled
    if (grailProgress.includeRunewords && grailProgress.totalRunewords >= 0) {
      // Calculate expected runewords based on game version and settings
      // For D2R, there are approximately 78-93+ runewords depending on patches
      const expectedRunewords = 93 // This matches your client count
      categories.push({
        name: 'Runewords',
        owned: grailProgress.totalRunewords,
        exists: expectedRunewords,
        percentage: grailProgress.totalRunewords >= 0 ? (grailProgress.totalRunewords / expectedRunewords) * 100 : 0
      })
    }

    // Calculate totals
    const totalOwned = categories.reduce((sum, cat) => sum + cat.owned, 0)
    const totalExists = categories.reduce((sum, cat) => sum + cat.exists, 0)
    const overallPercentage = totalExists > 0 ? (totalOwned / totalExists) * 100 : 0

    console.log(`DEBUG: Categories being returned for ${username}:`, categories.map(cat => cat.name))

    const response: ItemsResponse = {
      categories,
      totalOwned,
      totalExists,
      overallPercentage,
      grailType: grailProgress.grailType,
      includeRunes: grailProgress.includeRunes,
      includeRunewords: grailProgress.includeRunewords,
      rawItems: {
        items: grailProgress.items || {},
        ethItems: grailProgress.ethItems || {},
        runes: grailProgress.runes || {},
        runewords: grailProgress.runewords || {}
      }
    }

    return NextResponse.json({
      success: true,
      data: response,
      grailProgress: grailProgress
    })

  } catch (error) {
    console.error('Items API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}