import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Profile API: session check', { 
      hasSession: !!session, 
      userId: session?.user?.id 
    })
    
    if (!session?.user?.id) {
      console.log('Profile API: No valid session')
      return NextResponse.json(
        { error: 'Unauthorized - please log in' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        bio: true,
        country: true,
        state: true,
        avatarUrl: true,
        avatarType: true,
        diabloExperience: true,
        age: true,
        gender: true,
        hobbies: true,
        isPublic: true
      }
    })

    console.log('Profile API: Database query result', { 
      userId: session.user.id, 
      userFound: !!user 
    })

    if (!user) {
      console.log('Profile API: User not found in database')
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      )
    }

    console.log('Profile API: Success, returning user data')
    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      displayName,
      bio,
      country,
      state,
      diabloExperience,
      age,
      gender,
      hobbies,
      isPublic,
      battlenetId
    } = body

    // Validation
    if (displayName && displayName.length > 100) {
      return NextResponse.json(
        { error: 'Display name must be 100 characters or less' },
        { status: 400 }
      )
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio must be 500 characters or less' },
        { status: 400 }
      )
    }

    if (country && country.length > 50) {
      return NextResponse.json(
        { error: 'Country must be 50 characters or less' },
        { status: 400 }
      )
    }

    if (state && state.length > 50) {
      return NextResponse.json(
        { error: 'State must be 50 characters or less' },
        { status: 400 }
      )
    }

    if (age && (age < 13 || age > 120)) {
      return NextResponse.json(
        { error: 'Age must be between 13 and 120' },
        { status: 400 }
      )
    }

    // For now, we'll store battlenetId in the hobbies field as a workaround
    // In production, you'd want to add a battlenetId field to the schema
    const updatedHobbies = battlenetId ? `Battle.net: ${battlenetId}` : hobbies

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(country !== undefined && { country }),
        ...(state !== undefined && { state }),
        ...(diabloExperience !== undefined && { diabloExperience }),
        ...(age !== undefined && { age }),
        ...(gender !== undefined && { gender }),
        ...(updatedHobbies !== undefined && { hobbies: updatedHobbies }),
        ...(isPublic !== undefined && { isPublic })
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        email: true,
        bio: true,
        country: true,
        state: true,
        avatarUrl: true,
        avatarType: true,
        diabloExperience: true,
        age: true,
        gender: true,
        hobbies: true,
        isPublic: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}