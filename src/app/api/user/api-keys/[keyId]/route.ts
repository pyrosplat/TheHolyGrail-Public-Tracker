import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { keyId } = params

    if (!keyId) {
      return NextResponse.json(
        { error: 'API key ID is required' },
        { status: 400 }
      )
    }

    // Check if the API key belongs to the current user
    const apiKey = await prisma.apiKey.findUnique({
      where: { id: keyId },
      select: { userId: true }
    })

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    if (apiKey.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this API key' },
        { status: 403 }
      )
    }

    // Delete the API key and clear all grail progress in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the API key
      await tx.apiKey.delete({
        where: { id: keyId }
      })

      // Clear all user progress (same as clear-progress endpoint)
      await tx.userAchievement.deleteMany({
        where: { userId: user.id }
      })

      await tx.userStatistics.deleteMany({
        where: { userId: user.id }
      })

      await tx.grailProgress.deleteMany({
        where: { userId: user.id }
      })
    })

    return NextResponse.json(
      { message: 'API key deleted and grail progress cleared successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('API key deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}