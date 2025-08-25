import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      displayName: string | null
    } & DefaultSession['user']
  }

  interface User {
    username: string
    displayName: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username: string
    displayName: string | null
  }
}