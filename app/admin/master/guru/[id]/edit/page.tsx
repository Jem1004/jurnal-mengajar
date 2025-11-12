'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { updateGuru, getGuru } from '@/app/actions/master'
import Link from 'next/link'
import { ArrowLeft, Save, User, Mail, IdCard } from 'lucide-react'

export default function EditGuruPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: '',
    nip: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guruData, setGuruData] = useState<any>(null)

  useEffect(() => {
    loadGuru()
  }, [params.id])

  const loadGuru = async () => {
    const result = await getGuru()
    if (result.success && result.data) {
      const guru = result.data.find((g: any) => g.id === params.id)
      if (guru) {
        setGuruData(guru)
        setFormData({
          nama: guru.user.nama,
          nip: guru.nip || '',
          email: guru.user.email || ''
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('nama', formData.nama)
    formDataObj.append('nip', formData.nip)
    formDataObj.append('email', formData.email)

    const result = await updateGuru(params.id, formDataObj)
    if (result.success) {
      router.push('/admin/master/guru')
    } else {
      setError(result.error || 'Failed to update guru')
    }
    setLoading(false)
  }

  if (!guruData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data guru...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/master/guru">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Data Guru</h1>
                <p className="text-sm text-gray-500">Perbarui informasi data guru yang ada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom-lg border border-gray-100 p-8">
          {/* Guru Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Mengedit: {guruData.user.nama}</p>
                <p className="text-sm text-blue-700">Username: {guruData.user.username}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-800 text-sm">Terjadi Kesalahan</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Personal</h2>
                  <p className="text-sm text-gray-500">Data identitas guru</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Ahmad Wijaya, S.Pd."
                      required
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Masukkan nama lengkap sesuai identitas resmi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Induk Pegawai (NIP)
                  </label>
                  <Input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 198705012005011001"
                    className="font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">Opsional, diisi sesuai kartu identitas pegawai</p>
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Kontak</h2>
                  <p className="text-sm text-gray-500">Data kontak guru</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative max-w-md">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: ahmad.wijaya@sekolah.sch.id"
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Opsional, untuk notifikasi dan komunikasi resmi</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/admin/master/guru">
                <Button variant="secondary" className="px-6">
                  Batal
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-8 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}