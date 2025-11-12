'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { updateJadwal, getJadwal, getGuru, getKelas, getMataPelajaran } from '@/app/actions/master'
import Link from 'next/link'
import { ArrowLeft, Save, Calendar, Clock, Users, BookOpen } from 'lucide-react'

interface Jadwal {
  id: string
  hari: number
  jamMulai: string
  jamSelesai: string
  semester: number
  tahunAjaran: string
  guru: {
    id: string
    user: {
      nama: string
    }
  }
  kelas: {
    id: string
    nama: string
  }
  mataPelajaran: {
    id: string
    nama: string
  }
}

interface Guru {
  id: string
  user: {
    nama: string
  }
}

interface Kelas {
  id: string
  nama: string
  tingkat: number
}

interface MataPelajaran {
  id: string
  nama: string
}

const HARI_MAP = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export default function EditJadwalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    guruId: '',
    kelasId: '',
    mataPelajaranId: '',
    hari: '1',
    jamMulai: '',
    jamSelesai: '',
    semester: '1',
    tahunAjaran: '2024/2025'
  })
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jadwalData, setJadwalData] = useState<Jadwal | null>(null)

  useEffect(() => {
    loadData()
  }, [params.id])

  const loadData = async () => {
    const [jadwalResult, guruResult, kelasResult, mataPelajaranResult] = await Promise.all([
      getJadwal(),
      getGuru(),
      getKelas(),
      getMataPelajaran()
    ])

    if (jadwalResult.success && jadwalResult.data) {
      const jadwal = jadwalResult.data.find((j: Jadwal) => j.id === params.id)
      if (jadwal) {
        setJadwalData(jadwal)
        setFormData({
          guruId: jadwal.guru.id,
          kelasId: jadwal.kelas.id,
          mataPelajaranId: jadwal.mataPelajaran.id,
          hari: jadwal.hari.toString(),
          jamMulai: jadwal.jamMulai,
          jamSelesai: jadwal.jamSelesai,
          semester: jadwal.semester.toString(),
          tahunAjaran: jadwal.tahunAjaran
        })
      }
    }

    if (guruResult.success && guruResult.data) {
      setGuruList(guruResult.data)
    }

    if (kelasResult.success && kelasResult.data) {
      setKelasList(kelasResult.data)
    }

    if (mataPelajaranResult.success && mataPelajaranResult.data) {
      setMataPelajaranList(mataPelajaranResult.data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate time
    if (formData.jamMulai >= formData.jamSelesai) {
      setError('Jam selesai harus lebih besar dari jam mulai')
      setLoading(false)
      return
    }

    const formDataObj = new FormData()
    formDataObj.append('guruId', formData.guruId)
    formDataObj.append('kelasId', formData.kelasId)
    formDataObj.append('mataPelajaranId', formData.mataPelajaranId)
    formDataObj.append('hari', formData.hari)
    formDataObj.append('jamMulai', formData.jamMulai)
    formDataObj.append('jamSelesai', formData.jamSelesai)
    formDataObj.append('semester', formData.semester)
    formDataObj.append('tahunAjaran', formData.tahunAjaran)

    const result = await updateJadwal(params.id, formDataObj)
    if (result.success) {
      router.push('/admin/master/jadwal')
    } else {
      setError(result.error || 'Failed to update jadwal')
    }
    setLoading(false)
  }

  if (!jadwalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data jadwal...</p>
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
              <Link href="/admin/master/jadwal">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Data Jadwal</h1>
                <p className="text-sm text-gray-500">Perbarui informasi jadwal yang ada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-custom-lg border border-gray-100 p-8">
          {/* Jadwal Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Mengedit: {jadwalData.mataPelajaran.nama} - {jadwalData.kelas.nama}</p>
                <p className="text-sm text-blue-700">Pengajar: {jadwalData.guru.user.nama}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-in slide-in-from-top duration-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Calendar className="w-3 h-3 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-800 text-sm">Terjadi Kesalahan</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Teaching Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Pengajaran</h2>
                  <p className="text-sm text-gray-500">Data guru, kelas, dan mata pelajaran</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guru <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.guruId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, guruId: e.target.value })}
                    required
                    options={guruList.map((guru) => ({
                      value: guru.id,
                      label: guru.user.nama
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Guru yang akan mengajar</p>
                </div>

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
                      label: `${kelas.nama} (Tingkat ${kelas.tingkat})`
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Kelas yang akan diajar</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Pelajaran <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.mataPelajaranId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, mataPelajaranId: e.target.value })}
                    required
                    options={mataPelajaranList.map((mapel) => ({
                      value: mapel.id,
                      label: mapel.nama
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Mata pelajaran yang diajar</p>
                </div>
              </div>
            </div>

            {/* Schedule Time Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Jadwal Waktu</h2>
                  <p className="text-sm text-gray-500">Hari dan waktu pelaksanaan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hari <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.hari}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, hari: e.target.value })}
                    required
                    options={HARI_MAP.map((hari, index) => ({
                      value: index.toString(),
                      label: `${['🌞', '🌤', '☁️', '⛅', '⛈', '🌥', '🌆'][index]} ${hari}`
                    }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">Hari pelaksanaan pembelajaran</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="time"
                          value={formData.jamMulai}
                          onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                          required
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Mulai</p>
                    </div>
                    <div className="flex items-center pt-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="time"
                          value={formData.jamSelesai}
                          onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                          required
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Selesai</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: HH:MM (24 jam)</p>
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Informasi Akademik</h2>
                  <p className="text-sm text-gray-500">Semester dan tahun ajaran</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.semester}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, semester: e.target.value })}
                    required
                    options={[
                      { value: '1', label: 'Semester 1 (Ganjil)' },
                      { value: '2', label: 'Semester 2 (Genap)' }
                    ]}
                  />
                  <p className="text-xs text-gray-500 mt-1">Pilih semester berjalan</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tahun Ajaran <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.tahunAjaran}
                        onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                        placeholder="2024/2025"
                        pattern="\d{4}/\d{4}"
                        required
                        className="pl-10 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentYear = new Date().getFullYear()
                        const nextYear = currentYear + 1
                        setFormData({ ...formData, tahunAjaran: `${currentYear}/${nextYear}` })
                      }}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium"
                    >
                      Auto
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Format: YYYY/YYYY</p>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            {(formData.guruId && formData.kelasId && formData.mataPelajaranId && formData.hari && formData.jamMulai && formData.jamSelesai) && (
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Preview Jadwal</h3>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Pengajar</p>
                      <p className="font-semibold text-gray-900">
                        {guruList.find(g => g.id === formData.guruId)?.user.nama}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Kelas</p>
                      <p className="font-semibold text-gray-900">
                        {kelasList.find(k => k.id === formData.kelasId)?.nama}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mata Pelajaran</p>
                      <p className="font-semibold text-gray-900">
                        {mataPelajaranList.find(m => m.id === formData.mataPelajaranId)?.nama}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Waktu</p>
                      <p className="font-semibold text-gray-900">
                        {['🌞', '🌤', '☁️', '⛅', '⛈', '🌥', '🌆'][parseInt(formData.hari)]} {HARI_MAP[parseInt(formData.hari)]}, {formData.jamMulai} - {formData.jamSelesai}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
                        Semester {formData.semester}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {formData.tahunAjaran}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      ✨ Jadwal siap disimpan
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <Link href="/admin/master/jadwal">
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