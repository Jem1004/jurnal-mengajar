import { ReactNode } from 'react'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session || !session.user || session.user.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin/dashboard" className="flex items-center px-4 text-gray-900 font-semibold">
                Admin Panel
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/laporan/keterisian"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Laporan
                </Link>
                <div className="relative group">
                  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Data Master
                    <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    <div className="py-1">
                      <Link href="/admin/master/guru" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Guru
                      </Link>
                      <Link href="/admin/master/kelas" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Kelas
                      </Link>
                      <Link href="/admin/master/mata-pelajaran" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Mata Pelajaran
                      </Link>
                      <Link href="/admin/master/siswa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Siswa
                      </Link>
                      <Link href="/admin/master/jadwal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Jadwal
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{session.user.nama}</span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
