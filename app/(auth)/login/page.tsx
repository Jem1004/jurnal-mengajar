"use client"

import { signIn } from "next-auth/react"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false
      })

      if (result?.error) {
        setError("Username atau password salah")
        setIsLoading(false)
        return
      }

      // Redirect will be handled by middleware based on role
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-8">
      <Card className="w-full max-w-md animate-in zoom-in duration-300" variant="elevated">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Jurnal Mengajar Modern</CardTitle>
          <p className="text-sm sm:text-base text-gray-600">Silakan login untuk melanjutkan</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-red-800 text-sm border border-red-200 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Masukkan username"
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Masukkan password"
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs sm:text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p>Guru: <code className="bg-white px-2 py-1 rounded text-xs border border-gray-200">guru1 / password123</code></p>
              <p>Admin: <code className="bg-white px-2 py-1 rounded text-xs border border-gray-200">admin / admin123</code></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
