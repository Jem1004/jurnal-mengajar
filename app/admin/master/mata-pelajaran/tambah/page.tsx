'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { createMataPelajaran } from '@/app/actions/master'
import Link from 'next/link'
import { ArrowLeft, Save, BookOpen, Code } from 'lucide-react'

export default function TambahMataPelajaranPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: '',
    kode: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('nama', formData.nama)
    formDataObj.append('kode', formData.kode)

    const result = await createMataPelajaran(formDataObj)
    if (result.success) {
      router.push('/admin/master/mata-pelajaran')
    } else {
      setError(result.error || 'Failed to create mata pelajaran')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/master/mata-pelajaran">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tambah Mata Pelajaran Baru</h1>
                <p className="text-sm text-gray-500">Lengkapi informasi mata pelajaran untuk kurikulum</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom-lg border border-gray-100 p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-3 h-3 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-800 text-sm">Terjadi Kesalahan</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar Mata Pelajaran</h2>
                  <p className="text-sm text-gray-500">Data identitas mata pelajaran</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Matematika, Bahasa Indonesia, Fisika"
                      required
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Gunakan nama mata pelajaran yang sesuai dengan kurikulum resmi</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Mata Pelajaran
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.kode}
                        onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                        placeholder="Contoh: MTK, BIND, FIS"
                        maxLength={10}
                        className="pl-10 font-mono uppercase"
                      />
                    </div>
                    <div className="flex items-center px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                      <span className="text-xs text-gray-500 font-mono">
                        {formData.kode.length}/10
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">Pilih kode mata pelajaran umum:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { kode: 'MTK', nama: 'Matematika' },
                        { kode: 'BIND', nama: 'B. Indonesia' },
                        { kode: 'BING', nama: 'B. Inggris' },
                        { kode: 'FIS', nama: 'Fisika' },
                        { kode: 'KIM', nama: 'Kimia' },
                        { kode: 'BIO', nama: 'Biologi' },
                        { kode: 'EKON', nama: 'Ekonomi' },
                        { kode: 'GEO', nama: 'Geografi' },
                        { kode: 'SEJ', nama: 'Sejarah' },
                        { kode: 'SOS', nama: 'Sosiologi' },
                        { kode: 'PKN', nama: 'PKN' },
                        { kode: 'OLR', nama: 'Olahraga' }
                      ].map((item) => (
                        <button
                          key={item.kode}
                          type="button"
                          onClick={() => setFormData({ ...formData, kode: item.kode })}
                          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 text-sm font-medium"
                        >
                          {item.kode} - {item.nama}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-2">
                    Opsional - Maksimal 10 karakter untuk singkatan mata pelajaran
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {formData.nama && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Preview Mata Pelajaran</h3>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">{formData.nama}</p>
                      <p className="text-sm text-gray-500">Mata Pelajaran</p>
                      {formData.kode && (
                        <p className="text-sm text-gray-600 font-mono">Kode: {formData.kode}</p>
                      )}
                    </div>
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Preview
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/admin/master/mata-pelajaran">
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
                    Simpan Mata Pelajaran
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