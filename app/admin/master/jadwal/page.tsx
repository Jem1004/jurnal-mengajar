'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Link from 'next/link'
import Select from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  getJadwal,
  deleteJadwal,
  createJadwal,
  updateJadwal,
  getJadwalPaginated,
  getGuru,
  getKelas,
  getMataPelajaran
} from '@/app/actions/master'
import { Calendar, Clock, MapPin, User, Edit, Plus, AlertTriangle, BookOpen, Building } from 'lucide-react'
import Pagination from '@/components/ui/pagination'

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

export default function ManagementJadwalPage() {
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([])
  const [filteredJadwalList, setFilteredJadwalList] = useState<Jadwal[]>([])
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Filters
  const [filterGuruId, setFilterGuruId] = useState<string>('')
  const [filterKelasId, setFilterKelasId] = useState<string>('')
  const [filterHari, setFilterHari] = useState<string>('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = jadwalList

    if (filterGuruId) {
      filtered = filtered.filter(jadwal => jadwal.guru.id === filterGuruId)
    }
    if (filterKelasId) {
      filtered = filtered.filter(jadwal => jadwal.kelas.id === filterKelasId)
    }
    if (filterHari) {
      filtered = filtered.filter(jadwal => jadwal.hari === parseInt(filterHari))
    }

    setFilteredJadwalList(filtered)
  }, [filterGuruId, filterKelasId, filterHari, jadwalList])

  const loadData = async () => {
    setLoading(true)

    const [jadwalResult, guruResult, kelasResult, mataPelajaranResult] = await Promise.all([
      getJadwalPaginated(currentPage, itemsPerPage, searchTerm),
      getGuru(),
      getKelas(),
      getMataPelajaran()
    ])

    if (jadwalResult.success && jadwalResult.data) {
      setJadwalList(jadwalResult.data)
      setFilteredJadwalList(jadwalResult.data)
      setTotalPages(jadwalResult.pagination.totalPages)
      setTotalItems(jadwalResult.pagination.total)
    } else {
      setError(jadwalResult.error || 'Failed to load jadwal')
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

    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [currentPage, searchTerm])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadData()
  }

  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; jadwal: Jadwal | null }>({
    isOpen: false,
    jadwal: null
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Form states for adding jadwal
  const [addFormData, setAddFormData] = useState({
    guruId: '',
    kelasId: '',
    mataPelajaranId: '',
    hari: '',
    jamMulai: '',
    jamSelesai: '',
    ruang: '',
    semester: '1',
    tahunAjaran: '2024/2025'
  })

  // Form states for editing jadwal
  const [editFormData, setEditFormData] = useState({
    guruId: '',
    kelasId: '',
    mataPelajaranId: '',
    hari: '',
    jamMulai: '',
    jamSelesai: '',
    ruang: '',
    semester: '1',
    tahunAjaran: '2024/2025'
  })

  const handleDeleteClick = (jadwal: Jadwal) => {
    setDeleteModal({ isOpen: true, jadwal })
  }

  const handleDelete = async () => {
    if (!deleteModal.jadwal) return

    setDeleteLoading(true)
    const result = await deleteJadwal(deleteModal.jadwal.id)

    if (result.success) {
      setSuccess('Jadwal berhasil dihapus')
      loadData()
      setDeleteModal({ isOpen: false, jadwal: null })
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete jadwal')
      setDeleteModal({ isOpen: false, jadwal: null })
    }
    setDeleteLoading(false)
  }

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setDeleteModal({ isOpen: false, jadwal: null })
    }
  }

  const handleAddJadwal = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('guruId', addFormData.guruId)
      formData.append('kelasId', addFormData.kelasId)
      formData.append('mataPelajaranId', addFormData.mataPelajaranId)
      formData.append('hari', addFormData.hari)
      formData.append('jamMulai', addFormData.jamMulai)
      formData.append('jamSelesai', addFormData.jamSelesai)
      formData.append('semester', addFormData.semester)
      formData.append('tahunAjaran', addFormData.tahunAjaran)
      if (addFormData.ruang) {
        formData.append('ruang', addFormData.ruang)
      }

      const result = await createJadwal(formData)

      if (result.success) {
        setSuccess('Jadwal berhasil ditambahkan')
        setAddFormData({
          guruId: '',
          kelasId: '',
          mataPelajaranId: '',
          hari: '',
          jamMulai: '',
          jamSelesai: '',
          ruang: '',
          semester: '1',
          tahunAjaran: '2024/2025'
        })
        setAddModalOpen(false)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create jadwal')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditJadwal = async (jadwalId: string, e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('guruId', editFormData.guruId)
      formData.append('kelasId', editFormData.kelasId)
      formData.append('mataPelajaranId', editFormData.mataPelajaranId)
      formData.append('hari', editFormData.hari)
      formData.append('jamMulai', editFormData.jamMulai)
      formData.append('jamSelesai', editFormData.jamSelesai)
      formData.append('semester', editFormData.semester)
      formData.append('tahunAjaran', editFormData.tahunAjaran)
      if (editFormData.ruang) {
        formData.append('ruang', editFormData.ruang)
      }

      const result = await updateJadwal(jadwalId, formData)

      if (result.success) {
        setSuccess('Jadwal berhasil diperbarui')
        setEditModalOpen(null)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update jadwal')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = (jadwal: Jadwal) => {
    setEditFormData({
      guruId: jadwal.guru.id,
      kelasId: jadwal.kelas.id,
      mataPelajaranId: jadwal.mataPelajaran.id,
      hari: jadwal.hari.toString(),
      jamMulai: jadwal.jamMulai,
      jamSelesai: jadwal.jamSelesai,
      ruang: jadwal.ruang || '',
      semester: jadwal.semester.toString(),
      tahunAjaran: jadwal.tahunAjaran
    })
    setEditModalOpen(jadwal.id)
  }

  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Jadwal</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M3 21h18M3 10h18M3 14h18m-9-4v8m0 0V10" />
            </svg>
            Kelola jadwal mengajar
          </p>
        </div>
        <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setAddModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Tambah Jadwal
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Tambah Jadwal Baru</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Isi form di bawah untuk menambahkan jadwal mengajar baru
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleAddJadwal}>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      Guru
                    </label>
                    <select
                      value={addFormData.guruId}
                      onChange={(e) => setAddFormData({ ...addFormData, guruId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Pilih Guru</option>
                      {guruList.map((guru) => (
                        <option key={guru.id} value={guru.id}>{guru.user.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-600" />
                      Kelas
                    </label>
                    <select
                      value={addFormData.kelasId}
                      onChange={(e) => setAddFormData({ ...addFormData, kelasId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Pilih Kelas</option>
                      {kelasList.map((kelas) => (
                        <option key={kelas.id} value={kelas.id}>{kelas.nama}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-green-600" />
                      Mata Pelajaran
                    </label>
                    <select
                      value={addFormData.mataPelajaranId}
                      onChange={(e) => setAddFormData({ ...addFormData, mataPelajaranId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Pilih Mata Pelajaran</option>
                      {mataPelajaranList.map((mapel) => (
                        <option key={mapel.id} value={mapel.id}>{mapel.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Hari
                    </label>
                    <select
                      value={addFormData.hari}
                      onChange={(e) => setAddFormData({ ...addFormData, hari: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    >
                      <option value="">Pilih Hari</option>
                      {HARI_MAP.map((hari, index) => (
                        <option key={index} value={index}>{hari}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      Jam Mulai
                    </label>
                    <input
                      type="time"
                      value={addFormData.jamMulai}
                      onChange={(e) => setAddFormData({ ...addFormData, jamMulai: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      Jam Selesai
                    </label>
                    <input
                      type="time"
                      value={addFormData.jamSelesai}
                      onChange={(e) => setAddFormData({ ...addFormData, jamSelesai: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Ruang
                    </label>
                    <input
                      type="text"
                      value={addFormData.ruang}
                      onChange={(e) => setAddFormData({ ...addFormData, ruang: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contoh: Lab Komputer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Semester</label>
                    <select
                      value={addFormData.semester}
                      onChange={(e) => setAddFormData({ ...addFormData, semester: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Tahun Ajaran</label>
                    <input
                      type="text"
                      value={addFormData.tahunAjaran}
                      onChange={(e) => setAddFormData({ ...addFormData, tahunAjaran: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Contoh: 2024/2025"
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddModalOpen(false)}
                  disabled={addLoading}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={addLoading}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl transition-all duration-200"
                >
                  {addLoading ? 'Menyimpan...' : 'Simpan Jadwal'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-custom-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Jadwal
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari mata pelajaran, kelas, guru, atau ruang..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <Button type="submit" variant="outline" size="sm" className="px-4 py-2">
                Cari
              </Button>
            </form>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredJadwalList.length}</span> dari {totalItems} jadwal
            </div>
            {searchTerm && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setCurrentPage(1)
                }}
                className="text-xs px-3 py-1.5 rounded-lg"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filter Section */}
      <div className="bg-white rounded-xl shadow-custom-sm border border-gray-200 p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.707.293H3a1 1 0 01-1-1V4z" />
            </svg>
            Filter Jadwal
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span className="font-semibold">{filteredJadwalList.length}</span> dari {jadwalList.length} jadwal
            {(filterGuruId || filterKelasId || filterHari) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFilterGuruId('')
                  setFilterKelasId('')
                  setFilterHari('')
                }}
                className="text-xs px-3 py-1.5 rounded-lg"
              >
                Reset Semua
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Filter Guru
            </label>
            <Select
              value={filterGuruId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterGuruId(e.target.value)}
              className="text-base"
              options={[
                { value: '', label: '👥 Semua Guru' },
                ...guruList.map((guru) => ({ value: guru.id, label: `👨‍🏫 ${guru.user.nama}` }))
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Filter Kelas
            </label>
            <Select
              value={filterKelasId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterKelasId(e.target.value)}
              className="text-base"
              options={[
                { value: '', label: '📚 Semua Kelas' },
                ...kelasList.map((kelas) => ({ value: kelas.id, label: `📖 ${kelas.nama}` }))
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M3 21h18M3 10h18M3 14h18m-9-4v8m0 0V10" />
              </svg>
              Filter Hari
            </label>
            <Select
              value={filterHari}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterHari(e.target.value)}
              className="text-base"
              options={[
                { value: '', label: '📅 Semua Hari' },
                ...HARI_MAP.map((hari, index) => ({ value: index.toString(), label: `${['🌞', '🌤', '☁️', '⛅', '⛈', '🌥', '🌆'][index]} ${hari}` }))
              ]}
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Memuat data jadwal...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-custom-lg border border-gray-100 overflow-hidden">
          {/* Table Stats */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Jadwal {filterGuruId || filterKelasId || filterHari ? '(Difilter)' : ''}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Tahun:</span>
                  <span className="font-semibold text-green-600">2024/2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informasi Jadwal
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hari
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jam
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ruang
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Pelajaran
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Periode
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJadwalList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M3 21h18M3 10h18M3 14h18m-9-4v8m0 0V10" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {filterGuruId || filterKelasId || filterHari
                            ? 'Tidak ada jadwal sesuai filter'
                            : 'Belum ada data jadwal'
                          }
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          {filterGuruId || filterKelasId || filterHari
                            ? 'Coba ubah filter atau reset untuk melihat semua jadwal.'
                            : 'Mulai dengan menambahkan data jadwal pertama menggunakan tombol "Tambah Jadwal" di atas.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJadwalList.map((jadwal) => (
                    <tr key={jadwal.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M3 21h18M3 10h18M3 14h18m-9-4v8m0 0V10" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {jadwal.guru.user.nama}
                            </div>
                            <div className="text-xs text-gray-500">
                              Guru
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {['🌞', '🌤', '☁️', '⛅', '⛈', '🌥', '🌆'][jadwal.hari]} {HARI_MAP[jadwal.hari]}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-mono font-medium text-gray-900">
                          {jadwal.jamMulai} - {jadwal.jamSelesai}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xs">
                              {jadwal.kelas.nama.charAt(0)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 font-medium">
                            {jadwal.kelas.nama}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">
                          {jadwal.mataPelajaran.nama}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700">
                            Semester {jadwal.semester}
                          </div>
                          <div className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 ml-2">
                            {jadwal.tahunAjaran}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Dialog open={editModalOpen === jadwal.id} onOpenChange={(open) => !open && setEditModalOpen(null)}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleEditClick(jadwal)}
                                variant="outline"
                                size="sm"
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl border-0 shadow-2xl">
                              <DialogHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Edit className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">Edit Jadwal</DialogTitle>
                                    <DialogDescription className="text-gray-600">
                                      Ubah informasi jadwal mengajar di bawah ini
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <form onSubmit={(e) => handleEditJadwal(jadwal.id, e)}>
                                <div className="space-y-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        Guru
                                      </label>
                                      <select
                                        value={editFormData.guruId}
                                        onChange={(e) => setEditFormData({ ...editFormData, guruId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                      >
                                        <option value="">Pilih Guru</option>
                                        {guruList.map((guru) => (
                                          <option key={guru.id} value={guru.id}>{guru.user.nama}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-blue-600" />
                                        Kelas
                                      </label>
                                      <select
                                        value={editFormData.kelasId}
                                        onChange={(e) => setEditFormData({ ...editFormData, kelasId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                      >
                                        <option value="">Pilih Kelas</option>
                                        {kelasList.map((kelas) => (
                                          <option key={kelas.id} value={kelas.id}>{kelas.nama}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                        Mata Pelajaran
                                      </label>
                                      <select
                                        value={editFormData.mataPelajaranId}
                                        onChange={(e) => setEditFormData({ ...editFormData, mataPelajaranId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                      >
                                        <option value="">Pilih Mata Pelajaran</option>
                                        {mataPelajaranList.map((mapel) => (
                                          <option key={mapel.id} value={mapel.id}>{mapel.nama}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        Hari
                                      </label>
                                      <select
                                        value={editFormData.hari}
                                        onChange={(e) => setEditFormData({ ...editFormData, hari: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                      >
                                        <option value="">Pilih Hari</option>
                                        {HARI_MAP.map((hari, index) => (
                                          <option key={index} value={index}>{hari}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        Jam Mulai
                                      </label>
                                      <input
                                        type="time"
                                        value={editFormData.jamMulai}
                                        onChange={(e) => setEditFormData({ ...editFormData, jamMulai: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        Jam Selesai
                                      </label>
                                      <input
                                        type="time"
                                        value={editFormData.jamSelesai}
                                        onChange={(e) => setEditFormData({ ...editFormData, jamSelesai: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                        Ruang
                                      </label>
                                      <input
                                        type="text"
                                        value={editFormData.ruang}
                                        onChange={(e) => setEditFormData({ ...editFormData, ruang: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Contoh: Lab Komputer"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Semester</label>
                                      <select
                                        value={editFormData.semester}
                                        onChange={(e) => setEditFormData({ ...editFormData, semester: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                      >
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Tahun Ajaran</label>
                                      <input
                                        type="text"
                                        value={editFormData.tahunAjaran}
                                        onChange={(e) => setEditFormData({ ...editFormData, tahunAjaran: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Contoh: 2024/2025"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>

                                <DialogFooter className="gap-3 pt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditModalOpen(null)}
                                    disabled={editLoading}
                                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                                  >
                                    Batal
                                  </Button>
                                  <Button
                                    type="submit"
                                    disabled={editLoading}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl transition-all duration-200"
                                  >
                                    {editLoading ? 'Menyimpan...' : 'Update Jadwal'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(jadwal)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 border-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredJadwalList.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModal.isOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0 shadow-2xl">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Konfirmasi Hapus Jadwal</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Apakah Anda yakin ingin menghapus data jadwal ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteModal.jadwal && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Data Jadwal</h3>
                    <p className="text-sm text-red-700">{deleteModal.jadwal.mataPelajaran.nama} - {deleteModal.jadwal.kelas.nama}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Mata Pelajaran:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.jadwal.mataPelajaran.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Kelas:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.jadwal.kelas.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Guru:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.jadwal.guru.user.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Hari:</span>
                    <span className="text-sm font-semibold text-red-900">{HARI_MAP[deleteModal.jadwal.hari]}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-red-600">Jam:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.jadwal.jamMulai} - {deleteModal.jadwal.jamSelesai}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Perhatian!</h4>
                    <p className="text-sm text-yellow-700">
                      Data jadwal yang telah dihapus tidak dapat dipulihkan kembali. Pastikan jurnal atau data terkait tidak akan terpengaruh oleh penghapusan ini.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancelDelete}
              disabled={deleteLoading}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
            >
              Batal
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl transition-all duration-200"
            >
              {deleteLoading ? 'Menghapus...' : 'Hapus Jadwal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
