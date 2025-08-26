import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievementId = params.id

    // Get achievement details
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
      include: {
        _count: {
          select: {
            userAchievements: true
          }
        }
      }
    })

    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      )
    }

    // Get users who unlocked this achievement, ordered by unlock date
    const userAchievements = await prisma.userAchievement.findMany({
      where: { achievementId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isPublic: true
          }
        }
      },
      orderBy: { unlockedAt: 'asc' }, // First to unlock appears first
      take: 100 // Limit to first 100 unlocks
    })

    // Filter out private users and format response
    const publicUnlocks = userAchievements
      .filter(ua => ua.user.isPublic)
      .map((ua, index) => ({
        rank: index + 1,
        user: {
          id: ua.user.id,
          username: ua.user.username,
          displayName: ua.user.displayName,
          avatarUrl: ua.user.avatarUrl
        },
        unlockedAt: ua.unlockedAt,
        progress: ua.progress
      }))

    // Calculate total unlock percentage
    const totalUsers = await prisma.user.count({
      where: {
        grailProgress: {
          isNot: null
        }
      }
    })

    const unlockedPercentage = totalUsers > 0 ? (achievement._count.userAchievements / totalUsers) * 100 : 0

    return NextResponse.json({
      success: true,
      data: {
        achievement: {
          id: achievement.id,
          key: achievement.key,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          category: achievement.category,
          rarity: achievement.rarity,
          points: achievement.points,
          conditions: achievement.conditions
        },
        stats: {
          totalUnlocks: achievement._count.userAchievements,
          unlockedPercentage: unlockedPercentage,
          totalPlayers: totalUsers
        },
        unlockedBy: publicUnlocks
      }
    })
  } catch (error) {
    console.error('Get achievement details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}