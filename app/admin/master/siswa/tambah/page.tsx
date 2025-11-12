'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { createSiswa, getKelas } from '@/app/actions/master'
import Link from 'next/link'
import { ArrowLeft, Save, User, IdCard, Users } from 'lucide-react'

interface Kelas {
  id: string
  nama: string
  tingkat: number
  jurusan: string | null
}

export default function TambahSiswaPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    kelasId: '',
    jenisKelamin: ''
  })
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadKelas()
  }, [])

  const loadKelas = async () => {
    const result = await getKelas()
    if (result.success && result.data) {
      setKelasList(result.data)
      if (result.data.length > 0) {
        setFormData(prev => ({ ...prev, kelasId: result.data[0].id }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('nisn', formData.nisn)
    formDataObj.append('nama', formData.nama)
    formDataObj.append('kelasId', formData.kelasId)
    formDataObj.append('jenisKelamin', formData.jenisKelamin)

    const result = await createSiswa(formDataObj)
    if (result.success) {
      router.push('/admin/master/siswa')
    } else {
      setError(result.error || 'Failed to create siswa')
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
              <Link href="/admin/master/siswa">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tambah Siswa Baru</h1>
                <p className="text-sm text-gray-500">Lengkapi data siswa untuk sistem pembelajaran</p>
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
                  <IdCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Identitas</h2>
                  <p className="text-sm text-gray-500">Data identitas siswa</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Induk Siswa Nasional (NISN) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      placeholder="Contoh: 0056789012"
                      required
                      maxLength={10}
                      className="pl-10 font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">NISN 10 digit sesuai kartu identitas siswa</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      placeholder="Contoh: Ahmad Fadillah Rahman"
                      required
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Masukkan nama sesuai akta kelahiran atau ijazah</p>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Akademik</h2>
                  <p className="text-sm text-gray-500">Data kelas dan informasi akademik</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.kelasId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, kelasId: e.target.value })}
                    required
                    options={kelasList.map((kelas) => ({
                      value: kelas.id,
                      label: `${kelas.nama} (Tingkat ${kelas.tingkat}${kelas.jurusan ? ` - ${kelas.jurusan}` : ''})`
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pilih kelas sesuai jurusan dan tingkat siswa</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, jenisKelamin: 'L' })}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        formData.jenisKelamin === 'L'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl">👦</div>
                      <span className="text-sm font-medium">Laki-laki</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, jenisKelamin: 'P' })}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        formData.jenisKelamin === 'P'
                          ? 'border-pink-500 bg-pink-50 text-pink-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl">👧</div>
                      <span className="text-sm font-medium">Perempuan</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Opsional - Untuk keperluan statistik dan pelaporan</p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {formData.nama && (
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Preview Data Siswa</h3>
                </div>

                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      formData.jenisKelamin === 'L'
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                        : formData.jenisKelamin === 'P'
                        ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                        : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      <span className="text-white font-bold">
                        {formData.nama.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg">{formData.nama}</p>
                      <p className="text-sm text-gray-500 font-mono">NISN: {formData.nisn || '-'}</p>
                    </div>
                    <div className="text-right">
                      {formData.kelasId && (
                        <p className="text-sm font-medium text-gray-700">
                          {kelasList.find(k => k.id === formData.kelasId)?.nama}
                        </p>
                      )}
                      {formData.jenisKelamin && (
                        <p className="text-xs text-gray-500">
                          {formData.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/admin/master/siswa">
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
                    Simpan Siswa
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