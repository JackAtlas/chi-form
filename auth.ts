import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './lib/prisma'

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/signIn'
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {},
        password: {}
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string
          password: string
        }

        const user = await prisma.user.findUnique({
          where: { name: username }
        })

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          password,
          user.passwordHash
        )

        if (!valid) return null

        return {
          id: user.id,
          username: user.name
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  logger: {
    error(error) {
      if (error?.name?.includes('CredentialsSignin')) return

      console.error('[auth][error]', error)
    }
  }
})
