import NextAuth, { type NextAuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          // Find user by username
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username as string
            },
            include: {
              guruProfile: true
            }
          })

          if (!user) {
            return null
          }

          // Verify password
          const isPasswordValid = await compare(
            credentials.password as string, 
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Return user object with necessary fields
          return {
            id: user.id,
            name: user.nama,
            email: user.email,
            role: user.role,
            guruId: user.guruProfile?.id || null
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      // Add custom fields to JWT token on sign in
      if (user) {
        token.id = user.id
        token.nama = user.name
        token.role = user.role
        token.guruId = user.guruId
      }
      return token
    },
    async session({ session, token }: any) {
      // Add custom fields to session from JWT token
      if (session.user) {
        session.user.id = token.id as string
        session.user.nama = token.nama as string
        session.user.role = token.role as string
        session.user.guruId = token.guruId as string | null
      }
      return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
}

// Export auth helpers for server components and server actions
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)
