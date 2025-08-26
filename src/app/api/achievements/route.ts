import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get all achievements with their unlock statistics
    const achievements = await prisma.achievement.findMany({
      include: {
        _count: {
          select: {
            users: true // Count how many users have unlocked each achievement
          }
        }
      },
      orderBy: [
        { category: 'asc' },
        { points: 'desc' }
      ]
    })

    // Add unlock percentage to each achievement
    const totalUsers = await prisma.user.count({
      where: {
        grailProgress: {
          isNot: null // Only count users with grail progress
        }
      }
    })

    const achievementsWithStats = achievements.map(achievement => ({
      ...achievement,
      unlockedBy: achievement._count.users,
      unlockedPercentage: totalUsers > 0 ? (achievement._count.users / totalUsers) * 100 : 0
    }))

    return NextResponse.json({
      success: true,
      data: achievementsWithStats,
      meta: {
        totalAchievements: achievements.length,
        totalUsers
      }
    })
  } catch (error) {
    console.error('Get achievements error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}