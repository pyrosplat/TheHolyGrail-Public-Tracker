import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Try to authenticate, but don't fail if no valid API key
    const user = await authenticateRequest(request)
    
    if (!user) {
      // No valid API key or authentication failed
      // This means the API key was deleted, so unlock is appropriate
      return NextResponse.json({
        shouldUnlock: true,
        message: 'No valid API key - configuration should be unlocked'
      })
    }

    // Check if user has grail progress
    const grailProgress = await prisma.grailProgress.findUnique({
      where: { userId: user.id }
    })

    if (!grailProgress) {
      // No grail progress found - configuration should be unlocked
      return NextResponse.json({
        shouldUnlock: true,
        message: 'No grail progress found - configuration unlocked'
      })
    }

    // Grail progress exists - keep configuration locked
    return NextResponse.json({
      shouldUnlock: false,
      message: 'Grail progress exists - configuration remains locked'
    })

  } catch (error) {
    console.error('Unlock check error:', error)
    // On error, default to unlocking to avoid locking users out
    return NextResponse.json({
      shouldUnlock: true,
      message: 'Error occurred - defaulting to unlock'
    })
  }
}