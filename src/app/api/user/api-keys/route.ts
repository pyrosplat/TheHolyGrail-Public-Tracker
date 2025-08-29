import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { generateApiKey } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        key: true,
        name: true,
        lastUsedAt: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ apiKeys })

  } catch (error) {
    console.error('API keys fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'API key name must be 50 characters or less' },
        { status: 400 }
      )
    }

    // Check if user already has an API key (only allow one)
    const existingKeys = await prisma.apiKey.count({
      where: { userId: user.id }
    })

    if (existingKeys >= 1) {
      return NextResponse.json(
        { error: 'Only one API key is allowed per user. Delete the existing key to create a new one.' },
        { status: 400 }
      )
    }

    // Generate unique API key
    let apiKey: string
    let isUnique = false
    let attempts = 0
    
    while (!isUnique && attempts < 5) {
      apiKey = generateApiKey()
      const existing = await prisma.apiKey.findUnique({
        where: { key: apiKey }
      })
      if (!existing) {
        isUnique = true
      }
      attempts++
    }

    if (!isUnique) {
      return NextResponse.json(
        { error: 'Failed to generate unique API key' },
        { status: 500 }
      )
    }

    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        key: apiKey!,
        name: name.trim(),
      },
      select: {
        id: true,
        key: true,
        name: true,
        lastUsedAt: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      {
        message: 'API key created successfully',
        apiKey: newApiKey
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('API key creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}