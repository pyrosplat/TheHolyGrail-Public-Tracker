import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-config'
import { prisma } from './prisma'

export interface AuthUser {
  id: string
  username: string
  apiKey: string
}

export function getSession() {
  return getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function verifyApiKey(apiKey: string): Promise<AuthUser | null> {
  try {
    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }
    })
    
    if (!apiKeyRecord) {
      return null
    }

    // Update last used timestamp
    await prisma.apiKey.update({
      where: { key: apiKey },
      data: { lastUsedAt: new Date() }
    })

    return {
      id: apiKeyRecord.user.id,
      username: apiKeyRecord.user.username,
      apiKey: apiKey,
    }
  } catch (error) {
    console.error('API key verification error:', error)
    return null
  }
}

export async function authenticateRequest(request: NextRequest): Promise<AuthUser | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const apiKey = authHeader.substring(7) // Remove 'Bearer ' prefix
  return await verifyApiKey(apiKey)
}

export function generateApiKey(): string {
  // Generate a secure API key
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = 'hg_' // Holy Grail prefix
  
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return result
}

export function createJWTToken(user: AuthUser): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    secret,
    { expiresIn: '24h' }
  )
}

export function verifyJWTToken(token: string): any {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }
  
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}