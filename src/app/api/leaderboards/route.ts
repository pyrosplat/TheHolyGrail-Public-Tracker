import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category') || 'overall' // overall, runes, sets, speed
    const gameMode = searchParams.get('gameMode') || 'all' // all, softcore, hardcore, manual
    const grailType = searchParams.get('grailType') || 'all' // all, normal, ethereal, each, both
    const includeRunes = searchParams.get('includeRunes') === 'true'
    const includeRunewords = searchParams.get('includeRunewords') === 'true'

    let orderBy: any = { grailProgress: { overallCompletion: 'desc' } }

    // Build where conditions for filtering
    let whereConditions: any = {
      isPublic: true,
      grailProgress: {
        isNot: null,
      },
    }

    // Build additional filters for grailProgress relation using 'is' syntax
    const grailProgressFilters: any = {}

    // Filter by game mode - treat 'Both' as 'all' (no filter)
    if (gameMode !== 'all' && gameMode !== 'both') {
      // Use lowercase values as they are stored in the database
      const gameModeValue = gameMode.toLowerCase()
      grailProgressFilters.gameMode = gameModeValue
    }

    // Filter by grail type
    if (grailType !== 'all') {
      // Use lowercase values as they are stored in the database
      const grailTypeValue = grailType.toLowerCase()
      grailProgressFilters.grailType = grailTypeValue
    }

    // Filter by rune/runeword inclusion
    if (includeRunes) {
      grailProgressFilters.includeRunes = true
    }
    if (includeRunewords) {
      grailProgressFilters.includeRunewords = true
    }

    // Apply additional filters if any exist using 'is' syntax for one-to-one relations
    if (Object.keys(grailProgressFilters).length > 0) {
      whereConditions.grailProgress = {
        is: grailProgressFilters
      }
    }

    // Different leaderboard categories
    switch (category) {
      case 'recent':
        orderBy = { lastSyncAt: 'desc' }
        break
      case 'speed':
        orderBy = { statistics: { itemsPerDay: 'desc' } }
        break
      case 'achievements':
        // This would require a more complex query with achievement counts
        orderBy = { createdAt: 'desc' } // Fallback
        break
      default:
        orderBy = { grailProgress: { overallCompletion: 'desc' } }
    }

    const users = await prisma.user.findMany({
      where: whereConditions,
      include: {
        grailProgress: true,
        statistics: true,
        _count: {
          select: {
            achievements: true,
          },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    })

    // Transform data for leaderboard display
    const leaderboardData = users.map((user, index) => ({
      rank: offset + index + 1,
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      lastSyncAt: user.lastSyncAt,
      gameMode: user.grailProgress?.gameMode || 'Softcore',
      grailType: user.grailProgress?.grailType || 'Normal',
      includeRunes: user.grailProgress?.includeRunes || false,
      includeRunewords: user.grailProgress?.includeRunewords || false,
      progress: {
        overall: user.grailProgress?.overallCompletion || 0,
        normal: user.grailProgress?.normalCompletion || 0,
        ethereal: user.grailProgress?.etherealCompletion || 0,
        runes: user.grailProgress?.runeCompletion || 0,
        runewords: user.grailProgress?.runewordCompletion || 0,
        totalItems: user.grailProgress?.totalItems || 0,
        totalRunes: user.grailProgress?.totalRunes || 0,
        totalRunewords: user.grailProgress?.totalRunewords || 0,
        armor: user.grailProgress?.armorOwned || 0,
        weapons: user.grailProgress?.weaponsOwned || 0,
        other: user.grailProgress?.otherOwned || 0,
        sets: user.grailProgress?.setsOwned || 0,
        ethArmor: user.grailProgress?.ethArmorOwned || 0,
        ethWeapons: user.grailProgress?.ethWeaponsOwned || 0,
        ethOther: user.grailProgress?.ethOtherOwned || 0,
      },
      statistics: {
        itemsPerDay: user.statistics?.itemsPerDay || 0,
        currentStreak: user.statistics?.currentStreak || 0,
        longestStreak: user.statistics?.longestStreak || 0,
        grailStartedAt: user.statistics?.grailStartedAt,
      },
      achievementCount: user._count.achievements,
    }))

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereConditions,
    })

    return NextResponse.json({
      success: true,
      data: {
        leaderboard: leaderboardData,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
        category,
      },
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}