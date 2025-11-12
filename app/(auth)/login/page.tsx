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
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        {/* Logo */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Jurnal Mengajar
        </h1>
        <p className="text-gray-600">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-800 text-sm animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Masukkan username"
                  disabled={isLoading}
                  className="text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  disabled={isLoading}
                  className="text-base"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-200">
            <p className="text-sm font-medium text-green-800 mb-3 text-center">
              Akun Demo
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Guru:</span>
                <code className="bg-white px-3 py-1 rounded-md text-xs font-mono border border-green-200 text-green-700">
                  guru1 / password123
                </code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Admin:</span>
                <code className="bg-white px-3 py-1 rounded-md text-xs font-mono border border-green-200 text-green-700">
                  admin / admin123
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          © 2024 Jurnal Mengajar. Modern & Digital.
        </p>
      </div>
    </div>
  )
}
