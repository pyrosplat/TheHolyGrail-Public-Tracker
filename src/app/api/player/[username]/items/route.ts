import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Use the detailed category counts that are now synced from the desktop client
// These give us the exact counts that match the desktop client

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
  actualItems?: any // The actual items data for detailed view if needed
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

    if (!user || !user.grailProgress) {
      return NextResponse.json(
        { error: 'Player not found or has no grail data' },
        { status: 404 }
      )
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
    const showEtherealSeparately = grailType === 'Ethereal' || grailType === 'Each'
    
    if (showEtherealSeparately) {
      if (grailProgress.ethArmorExists > 0) {
        categories.push({
          name: 'Ethereal Unique Armor',
          owned: grailProgress.ethArmorOwned,
          exists: grailProgress.ethArmorExists,
          percentage: grailProgress.ethArmorExists > 0 ? (grailProgress.ethArmorOwned / grailProgress.ethArmorExists) * 100 : 0
        })
      }

      if (grailProgress.ethWeaponsExists > 0) {
        categories.push({
          name: 'Ethereal Unique Weapons',
          owned: grailProgress.ethWeaponsOwned,
          exists: grailProgress.ethWeaponsExists,
          percentage: grailProgress.ethWeaponsExists > 0 ? (grailProgress.ethWeaponsOwned / grailProgress.ethWeaponsExists) * 100 : 0
        })
      }

      if (grailProgress.ethOtherExists > 0) {
        categories.push({
          name: 'Ethereal Unique Other',
          owned: grailProgress.ethOtherOwned,
          exists: grailProgress.ethOtherExists,
          percentage: grailProgress.ethOtherExists > 0 ? (grailProgress.ethOtherOwned / grailProgress.ethOtherExists) * 100 : 0
        })
      }
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

    const response: ItemsResponse = {
      categories,
      totalOwned,
      totalExists,
      overallPercentage,
      grailType: grailProgress.grailType,
      includeRunes: grailProgress.includeRunes,
      includeRunewords: grailProgress.includeRunewords,
      actualItems: {
        items: grailProgress.items,
        ethItems: grailProgress.ethItems,
        runes: grailProgress.runes,
        runewords: grailProgress.runewords
      }
    }

    return NextResponse.json({
      success: true,
      data: response
    })

  } catch (error) {
    console.error('Items API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}