'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { updateKelas, getKelas } from '@/app/actions/master'
import Link from 'next/link'
import { ArrowLeft, Save, School, BookOpen } from 'lucide-react'

export default function EditKelasPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nama: '',
    tingkat: '10',
    jurusan: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [kelasData, setKelasData] = useState<any>(null)

  useEffect(() => {
    loadKelas()
  }, [params.id])

  const loadKelas = async () => {
    const result = await getKelas()
    if (result.success && result.data) {
      const kelas = result.data.find((k: any) => k.id === params.id)
      if (kelas) {
        setKelasData(kelas)
        setFormData({
          nama: kelas.nama,
          tingkat: kelas.tingkat.toString(),
          jurusan: kelas.jurusan || ''
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
    formDataObj.append('tingkat', formData.tingkat)
    formDataObj.append('jurusan', formData.jurusan)

    const result = await updateKelas(params.id, formDataObj)
    if (result.success) {
      router.push('/admin/master/kelas')
    } else {
      setError(result.error || 'Failed to update kelas')
    }
    setLoading(false)
  }

  if (!kelasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data kelas...</p>
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
              <Link href="/admin/master/kelas">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Data Kelas</h1>
                <p className="text-sm text-gray-500">Perbarui informasi kelas yang ada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom-lg border border-gray-100 p-8">
          {/* Kelas Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <School className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Mengedit: {kelasData.nama}</p>
                <p className="text-sm text-blue-700">Tingkat: Kelas {kelasData.tingkat}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <School className="w-3 h-3 text-red-600" />
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
                  <School className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Dasar Kelas</h2>
                  <p className="text-sm text-gray-500">Data identitas kelas</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kelas <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: X-IPA-1, XI-IPS-2"
                      required
                      className="pl-10 font-semibold uppercase"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: [Tingkat]-[Jurusan]-[Nomor]</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat Kelas <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.tingkat}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, tingkat: e.target.value })}
                    required
                    options={[
                      { value: '10', label: '10 - Kelas Sepuluh' },
                      { value: '11', label: '11 - Kelas Sebelas' },
                      { value: '12', label: '12 - Kelas Dua Belas' }
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pilih tingkat kelas sesuai kurikulum</p>
                </div>
              </div>
            </div>

            {/* Jurusan Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Jurusan</h2>
                  <p className="text-sm text-gray-500">Spesialisasi program studi kelas</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Jurusan
                </label>
                <Input
                  type="text"
                  value={formData.jurusan}
                  onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                  placeholder="Contoh: IPA, IPS, Bahasa, TKJ"
                  className="uppercase"
                />

                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Pilih jurusan umum:</p>
                  <div className="flex flex-wrap gap-2">
                    {['IPA', 'IPS', 'Bahasa', 'TKJ', 'AKL', 'RPL', 'Multimedia', 'Perhotelan'].map((jurusan) => (
                      <button
                        key={jurusan}
                        type="button"
                        onClick={() => setFormData({ ...formData, jurusan })}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 text-sm font-medium"
                      >
                        {jurusan}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Opsional - Kosongkan untuk kelas umum tanpa jurusan
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {formData.nama && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <School className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Preview Kelas</h3>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">
                        {formData.tingkat}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">{formData.nama}</p>
                      <p className="text-sm text-gray-500">Kelas {formData.tingkat}</p>
                      {formData.jurusan && (
                        <p className="text-sm text-gray-600">Jurusan: {formData.jurusan}</p>
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
              <Link href="/admin/master/kelas">
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