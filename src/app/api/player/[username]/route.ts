import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = params.username.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        grailProgress: true,
        achievements: {
          include: {
            achievement: true,
          },
          orderBy: {
            unlockedAt: 'desc',
          },
        },
        statistics: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    if (!user.isPublic) {
      return NextResponse.json(
        { error: 'Player profile is private' },
        { status: 403 }
      )
    }

    // Calculate total achievement points earned
    const totalAchievementPoints = user.achievements.reduce((total, userAchievement) => {
      return total + (userAchievement.achievement?.points || 0)
    }, 0)

    // Don't return sensitive information
    const publicUserData = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      createdAt: user.createdAt,
      lastSyncAt: user.lastSyncAt,
      bio: user.bio,
      country: user.country,
      state: user.state,
      avatarUrl: user.avatarUrl,
      avatarType: user.avatarType,
      diabloExperience: user.diabloExperience,
      age: user.age,
      gender: user.gender,
      hobbies: user.hobbies,
      isPublic: user.isPublic,
      grailProgress: user.grailProgress,
      achievements: user.achievements.map(ua => ({
        id: ua.id,
        achievement: ua.achievement,
        unlockedAt: ua.unlockedAt,
        progress: ua.progress,
      })),
      statistics: user.statistics,
      totalAchievementPoints,
    }

    return NextResponse.json({
      success: true,
      data: publicUserData,
    })
  } catch (error) {
    console.error('Get player error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}