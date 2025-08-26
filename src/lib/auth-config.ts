import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  events: {
    async signOut() {
      // Ensure we redirect to the correct port
    }
  },
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.username = user.username
        token.displayName = user.displayName
      }
      
      // Refresh user data on update
      if (trigger === 'update' && token.sub) {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { 
            username: true, 
            displayName: true, 
            avatarUrl: true 
          }
        })
        if (updatedUser) {
          token.username = updatedUser.username
          token.displayName = updatedUser.displayName
          token.avatarUrl = updatedUser.avatarUrl
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.displayName = token.displayName as string | null
        session.user.avatarUrl = token.avatarUrl as string | null
      }
      return session
    }
  }
}