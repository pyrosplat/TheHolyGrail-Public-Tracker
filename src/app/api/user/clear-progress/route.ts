import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Clear all progress data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete user achievements
      await tx.userAchievement.deleteMany({
        where: { userId: user.id }
      })

      // Delete user statistics
      await tx.userStatistics.deleteMany({
        where: { userId: user.id }
      })

      // Delete grail progress
      await tx.grailProgress.deleteMany({
        where: { userId: user.id }
      })

      // Clear any API logs related to progress syncing (optional - keeps some audit trail)
      // You could optionally keep logs for audit purposes:
      // await tx.apiLog.deleteMany({
      //   where: { 
      //     userId: user.id,
      //     endpoint: '/api/progress/sync'
      //   }
      // })
    })

    return NextResponse.json({
      success: true,
      message: 'Progress cleared successfully'
    })

  } catch (error) {
    console.error('Clear progress error:', error)
    return NextResponse.json(
      { error: 'Failed to clear progress. Please try again.' },
      { status: 500 }
    )
  }
}