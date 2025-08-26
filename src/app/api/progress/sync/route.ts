import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/auth'

interface SyncData {
  gameMode: string
  grailType: string
  includeRunes: boolean
  includeRunewords: boolean
  items: Record<string, any>
  ethItems: Record<string, any>
  runes: Record<string, any>
  runewords: Record<string, any>
  stats: {
    total: number
    found: number
    percentage: number
  }
  detailedStats?: {
    armor: { owned: number; exists: number; percent: number }
    weapons: { owned: number; exists: number; percent: number }
    other: { owned: number; exists: number; percent: number }
    sets: { owned: number; exists: number; percent: number }
    ethArmor: { owned: number; exists: number; percent: number }
    ethWeapons: { owned: number; exists: number; percent: number }
    ethOther: { owned: number; exists: number; percent: number }
    runes: { owned: number; exists: number; percent: number }
    runewords: { owned: number; exists: number; percent: number }
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    const syncData: SyncData = await request.json()

    // Validate required fields
    if (!syncData.items || !syncData.ethItems) {
      return NextResponse.json(
        { error: 'Missing required data fields' },
        { status: 400 }
      )
    }

    // Check if grail configuration is locked
    const existingProgress = await prisma.grailProgress.findUnique({
      where: { userId: user.id }
    })

    if (existingProgress && existingProgress.configurationLocked) {
      // Validate that core settings haven't changed
      if (
        existingProgress.gameMode !== syncData.gameMode ||
        existingProgress.grailType !== syncData.grailType ||
        existingProgress.includeRunes !== syncData.includeRunes ||
        existingProgress.includeRunewords !== syncData.includeRunewords
      ) {
        return NextResponse.json(
          { 
            error: 'Configuration locked: Cannot change gameMode, grailType, includeRunes, or includeRunewords. Delete your grail in settings to start fresh.',
            lockedConfig: {
              gameMode: existingProgress.gameMode,
              grailType: existingProgress.grailType,
              includeRunes: existingProgress.includeRunes,
              includeRunewords: existingProgress.includeRunewords
            }
          },
          { status: 403 }
        )
      }
    }

    // Use the detailed stats sent by the desktop client instead of recalculating
    const detailedStats = syncData.detailedStats
    const totalItems = Object.keys(syncData.items).length
    const totalEthItems = Object.keys(syncData.ethItems).length
    // Use the desktop client's accurate rune and runeword counts from detailed stats
    const totalRunes = detailedStats?.runes.owned ?? Object.keys(syncData.runes || {}).length
    const totalRunewords = detailedStats?.runewords.owned ?? Object.keys(syncData.runewords || {}).length

    // Use the accurate percentage calculated by the desktop app
    const overallCompletion = syncData.stats?.percentage || 0
    
    // Use detailed stats if available, otherwise fall back to overall completion
    const normalCompletion = detailedStats ? 
      ((detailedStats.armor.owned + detailedStats.weapons.owned + detailedStats.other.owned + detailedStats.sets.owned) / 
       Math.max(1, detailedStats.armor.exists + detailedStats.weapons.exists + detailedStats.other.exists + detailedStats.sets.exists)) * 100 
      : overallCompletion
    const etherealCompletion = detailedStats ? 
      ((detailedStats.ethArmor.owned + detailedStats.ethWeapons.owned + detailedStats.ethOther.owned) / 
       Math.max(1, detailedStats.ethArmor.exists + detailedStats.ethWeapons.exists + detailedStats.ethOther.exists)) * 100 
      : overallCompletion
    const runeCompletion = detailedStats?.runes.percent || (totalRunes > 0 && syncData.includeRunes ? (totalRunes / 33) * 100 : 0)
    const runewordCompletion = detailedStats?.runewords.percent || (totalRunewords > 0 && syncData.includeRunewords ? (totalRunewords / 50) * 100 : 0)

    // Update grail progress
    const updatedProgress = await prisma.grailProgress.upsert({
      where: { userId: user.id },
      update: {
        // Don't update these if configuration is locked
        ...((!existingProgress || !existingProgress.configurationLocked) && {
          gameMode: syncData.gameMode,
          grailType: syncData.grailType,
          includeRunes: syncData.includeRunes,
          includeRunewords: syncData.includeRunewords,
        }),
        configurationLocked: true, // Lock configuration after first update
        items: syncData.items,
        ethItems: syncData.ethItems,
        runes: syncData.runes || {},
        runewords: syncData.runewords || {},
        totalItems,
        totalEthItems,
        totalRunes,
        totalRunewords,
        armorOwned: detailedStats?.armor.owned || 0,
        armorExists: detailedStats?.armor.exists || 0,
        weaponsOwned: detailedStats?.weapons.owned || 0,
        weaponsExists: detailedStats?.weapons.exists || 0,
        otherOwned: detailedStats?.other.owned || 0,
        otherExists: detailedStats?.other.exists || 0,
        setsOwned: detailedStats?.sets.owned || 0,
        setsExists: detailedStats?.sets.exists || 0,
        ethArmorOwned: detailedStats?.ethArmor.owned || 0,
        ethArmorExists: detailedStats?.ethArmor.exists || 0,
        ethWeaponsOwned: detailedStats?.ethWeapons.owned || 0,
        ethWeaponsExists: detailedStats?.ethWeapons.exists || 0,
        ethOtherOwned: detailedStats?.ethOther.owned || 0,
        ethOtherExists: detailedStats?.ethOther.exists || 0,
        normalCompletion,
        etherealCompletion,
        runeCompletion,
        runewordCompletion,
        overallCompletion,
      },
      create: {
        userId: user.id,
        gameMode: syncData.gameMode,
        grailType: syncData.grailType,
        includeRunes: syncData.includeRunes,
        includeRunewords: syncData.includeRunewords,
        configurationLocked: true, // Lock configuration on creation
        items: syncData.items,
        ethItems: syncData.ethItems,
        runes: syncData.runes || {},
        runewords: syncData.runewords || {},
        totalItems,
        totalEthItems,
        totalRunes,
        totalRunewords,
        armorOwned: detailedStats?.armor.owned || 0,
        armorExists: detailedStats?.armor.exists || 0,
        weaponsOwned: detailedStats?.weapons.owned || 0,
        weaponsExists: detailedStats?.weapons.exists || 0,
        otherOwned: detailedStats?.other.owned || 0,
        otherExists: detailedStats?.other.exists || 0,
        setsOwned: detailedStats?.sets.owned || 0,
        setsExists: detailedStats?.sets.exists || 0,
        ethArmorOwned: detailedStats?.ethArmor.owned || 0,
        ethArmorExists: detailedStats?.ethArmor.exists || 0,
        ethWeaponsOwned: detailedStats?.ethWeapons.owned || 0,
        ethWeaponsExists: detailedStats?.ethWeapons.exists || 0,
        ethOtherOwned: detailedStats?.ethOther.owned || 0,
        ethOtherExists: detailedStats?.ethOther.exists || 0,
        normalCompletion,
        etherealCompletion,
        runeCompletion,
        runewordCompletion,
        overallCompletion,
      },
    })

    // Update user's last sync time
    await prisma.user.update({
      where: { id: user.id },
      data: { lastSyncAt: new Date() },
    })

    // Update statistics
    await prisma.userStatistics.upsert({
      where: { userId: user.id },
      update: {
        lastItemAt: new Date(),
        itemsPerDay: totalItems / Math.max(1, Math.floor((Date.now() - Date.parse(updatedProgress.updatedAt.toISOString())) / (1000 * 60 * 60 * 24))),
      },
      create: {
        userId: user.id,
        firstItemAt: new Date(),
        lastItemAt: new Date(),
        grailStartedAt: new Date(),
      },
    })

    // Check for achievement unlocks
    await checkAchievements(user.id, updatedProgress)

    // Log the sync
    await prisma.apiLog.create({
      data: {
        userId: user.id,
        endpoint: '/api/progress/sync',
        method: 'POST',
        success: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        progress: updatedProgress,
        message: 'Progress synced successfully',
      },
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function checkAchievements(userId: string, progress: any) {
  try {
    // Get all achievements
    const achievements = await prisma.achievement.findMany()
    
    // Get user's current achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    })
    
    const unlockedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId))
    
    for (const achievement of achievements) {
      if (unlockedAchievementIds.has(achievement.id)) {
        continue // Already unlocked
      }
      
      // Check achievement conditions
      const conditions = achievement.conditions as any
      let shouldUnlock = false
      
      switch (achievement.key) {
        case 'first_unique':
          shouldUnlock = progress.totalItems > 0
          break
        case 'first_set':
          shouldUnlock = Object.values(progress.items).some((item: any) => item.type === 'set')
          break
        case 'first_rune':
          shouldUnlock = progress.totalRunes > 0
          break
        case 'grail_25':
          shouldUnlock = progress.overallCompletion >= 25
          break
        case 'grail_50':
          shouldUnlock = progress.overallCompletion >= 50
          break
        case 'grail_75':
          shouldUnlock = progress.overallCompletion >= 75
          break
        case 'grail_90':
          shouldUnlock = progress.overallCompletion >= 90
          break
        case 'grail_complete':
          shouldUnlock = progress.overallCompletion >= 100
          break
        case 'all_runes':
          shouldUnlock = progress.totalRunes >= 33
          break
      }
      
      if (shouldUnlock) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: 100,
          },
        })
      }
    }
  } catch (error) {
    console.error('Achievement check error:', error)
  }
}