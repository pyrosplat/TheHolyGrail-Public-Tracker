import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    // Search for public users by username or display name
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { isPublic: true }, // Only show public profiles
          {
            OR: [
              {
                username: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                displayName: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        country: true,
        grailProgress: {
          select: {
            overallCompletion: true,
            totalItems: true,
            totalEthItems: true,
            totalRunes: true,
            totalRunewords: true,
          }
        }
      },
      orderBy: [
        // Prioritize exact matches at the beginning
        {
          username: 'asc'
        }
      ],
      take: Math.min(limit, 20) // Max 20 results
    })

    // Format results for frontend
    const results = users.map(user => ({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      country: user.country,
      progress: {
        overall: user.grailProgress?.overallCompletion || 0,
        totalItems: (user.grailProgress?.totalItems || 0) + 
                   (user.grailProgress?.totalEthItems || 0) +
                   (user.grailProgress?.totalRunes || 0) +
                   (user.grailProgress?.totalRunewords || 0)
      }
    }))

    return NextResponse.json({
      success: true,
      data: results
    })

  } catch (error) {
    console.error('Player search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}