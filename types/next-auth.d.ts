import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      nama: string
      role: string
      guruId: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    nama: string
    role: string
    guruId: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    nama: string
    role: string
    guruId: string | null
  }
}
