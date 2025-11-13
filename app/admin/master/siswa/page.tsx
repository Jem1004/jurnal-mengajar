'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'
import Select from '@/components/ui/select'
import { getSiswa, deleteSiswa, createSiswa, updateSiswa, getSiswaPaginated, getKelas } from '@/app/actions/master'
import { User, Edit, Plus, AlertTriangle, Hash, Users, Building, UserCircle } from 'lucide-react'
import Pagination from '@/components/ui/pagination'

interface Siswa {
  id: string
  nisn: string
  nama: string
  jenisKelamin: string | null
  kelasId: string
  kelas: {
    id: string
    nama: string
    tingkat: number
    jurusan: string | null
  }
}

interface Kelas {
  id: string
  nama: string
  tingkat: number
  jurusan: string | null
}

export default function ManagementSiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([])
  const [filteredSiswaList, setFilteredSiswaList] = useState<Siswa[]>([])
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filterKelasId, setFilterKelasId] = useState<string>('')

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
    if (filterKelasId) {
      setFilteredSiswaList(siswaList.filter(siswa => siswa.kelasId === filterKelasId))
    } else {
      setFilteredSiswaList(siswaList)
    }
  }, [filterKelasId, siswaList])

  const loadData = async () => {
    setLoading(true)

    const [siswaResult, kelasResult] = await Promise.all([
      getSiswaPaginated(currentPage, itemsPerPage, searchTerm),
      getKelas()
    ])

    if (siswaResult.success && siswaResult.data) {
      setSiswaList(siswaResult.data)
      setFilteredSiswaList(siswaResult.data)
      setTotalPages(siswaResult.pagination.totalPages)
      setTotalItems(siswaResult.pagination.total)
    } else {
      setError(siswaResult.error || 'Failed to load siswa')
    }

    if (kelasResult.success && kelasResult.data) {
      setKelasList(kelasResult.data)
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

  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; siswa: Siswa | null }>({
    isOpen: false,
    siswa: null
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Form states for adding siswa
  const [addFormData, setAddFormData] = useState({
    nama: '',
    nisn: '',
    kelasId: '',
    jenisKelamin: ''
  })

  // Form states for editing siswa
  const [editFormData, setEditFormData] = useState({
    nama: '',
    nisn: '',
    kelasId: '',
    jenisKelamin: ''
  })

  const handleDeleteClick = (siswa: Siswa) => {
    setDeleteModal({ isOpen: true, siswa })
  }

  const handleDelete = async () => {
    if (!deleteModal.siswa) return

    setDeleteLoading(true)
    const result = await deleteSiswa(deleteModal.siswa.id)

    if (result.success) {
      setSuccess('Siswa berhasil dihapus')
      loadData()
      setDeleteModal({ isOpen: false, siswa: null })
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete siswa')
      setDeleteModal({ isOpen: false, siswa: null })
    }
    setDeleteLoading(false)
  }

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setDeleteModal({ isOpen: false, siswa: null })
    }
  }

  const handleAddSiswa = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('nama', addFormData.nama)
      formData.append('nisn', addFormData.nisn)
      formData.append('kelasId', addFormData.kelasId)
      if (addFormData.jenisKelamin) {
        formData.append('jenisKelamin', addFormData.jenisKelamin)
      }

      const result = await createSiswa(formData)

      if (result.success) {
        setSuccess('Siswa berhasil ditambahkan')
        setAddFormData({ nama: '', nisn: '', kelasId: '', jenisKelamin: '' })
        setAddModalOpen(false)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create siswa')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditSiswa = async (siswaId: string, e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('nama', editFormData.nama)
      formData.append('nisn', editFormData.nisn)
      formData.append('kelasId', editFormData.kelasId)
      if (editFormData.jenisKelamin) {
        formData.append('jenisKelamin', editFormData.jenisKelamin)
      }

      const result = await updateSiswa(siswaId, formData)

      if (result.success) {
        setSuccess('Siswa berhasil diperbarui')
        setEditModalOpen(null)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update siswa')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = (siswa: Siswa) => {
    setEditFormData({
      nama: siswa.nama,
      nisn: siswa.nisn,
      kelasId: siswa.kelasId,
      jenisKelamin: siswa.jenisKelamin || ''
    })
    setEditModalOpen(siswa.id)
  }

  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Siswa</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Kelola data siswa
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
                Tambah Siswa
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <UserCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Tambah Siswa Baru</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Isi form di bawah untuk menambahkan data siswa baru
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleAddSiswa}>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={addFormData.nama}
                      onChange={(e) => setAddFormData({ ...addFormData, nama: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan nama lengkap siswa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Hash className="w-4 h-4 text-green-600" />
                      NISN
                    </label>
                    <input
                      type="text"
                      value={addFormData.nisn}
                      onChange={(e) => setAddFormData({ ...addFormData, nisn: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan NISN"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-600" />
                      Jenis Kelamin
                    </label>
                    <select
                      value={addFormData.jenisKelamin}
                      onChange={(e) => setAddFormData({ ...addFormData, jenisKelamin: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
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
                  {addLoading ? 'Menyimpan...' : 'Simpan Siswa'}
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

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-custom-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.707.293H3a1 1 0 01-1-1V4z" />
              </svg>
              Filter berdasarkan Kelas
            </label>
            <Select
              value={filterKelasId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterKelasId(e.target.value)}
              className="text-base"
              options={[
                { value: '', label: '🔍 Semua Kelas' },
                ...kelasList.map((kelas) => ({ value: kelas.id, label: `📚 ${kelas.nama}` }))
              ]}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Siswa
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama atau NISN..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <Button type="submit" variant="outline" size="sm" className="px-4 py-2">
                Cari
              </Button>
            </form>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredSiswaList.length}</span> dari {totalItems} siswa
            </div>
            {(filterKelasId || searchTerm) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setFilterKelasId('')
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Memuat data siswa...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-custom-lg border border-gray-100 overflow-hidden">
          {/* Table Stats */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Siswa {filterKelasId ? `(Kelas: ${kelasList.find(k => k.id === filterKelasId)?.nama})` : ''}
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Aktif</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">L:</span>
                  <span className="font-semibold text-blue-600">
                    {filteredSiswaList.filter(s => s.jenisKelamin === 'L').length}
                  </span>
                  <span className="text-gray-600">P:</span>
                  <span className="font-semibold text-pink-600">
                    {filteredSiswaList.filter(s => s.jenisKelamin === 'P').length}
                  </span>
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
                    Informasi Siswa
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NISN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Kelamin
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSiswaList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {filterKelasId ? 'Tidak ada siswa di kelas ini' : 'Belum ada data siswa'}
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          {filterKelasId
                            ? 'Kelas ini belum memiliki data siswa. Coba pilih kelas lain atau tambahkan siswa baru.'
                            : 'Mulai dengan menambahkan data siswa pertama menggunakan tombol "Tambah Siswa" di atas.'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSiswaList.map((siswa) => (
                    <tr key={siswa.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            siswa.jenisKelamin === 'L'
                              ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                              : siswa.jenisKelamin === 'P'
                              ? 'bg-gradient-to-br from-pink-400 to-pink-600'
                              : 'bg-gray-400'
                          }`}>
                            <span className="text-white font-bold text-sm">
                              {siswa.nama.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {siswa.nama}
                            </div>
                            <div className="text-xs text-gray-500">
                              Siswa
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-mono">
                          {siswa.nisn}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-xs">
                              {siswa.kelas.tingkat}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 font-medium">
                            {siswa.kelas.nama}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {siswa.jenisKelamin === 'L' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Laki-laki
                            </span>
                          ) : siswa.jenisKelamin === 'P' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Perempuan
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Dialog open={editModalOpen === siswa.id} onOpenChange={(open) => !open && setEditModalOpen(null)}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleEditClick(siswa)}
                                variant="outline"
                                size="sm"
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-0 shadow-2xl">
                              <DialogHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Edit className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">Edit Data Siswa</DialogTitle>
                                    <DialogDescription className="text-gray-600">
                                      Ubah informasi data siswa di bawah ini
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <form onSubmit={(e) => handleEditSiswa(siswa.id, e)}>
                                <div className="space-y-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        Nama Lengkap
                                      </label>
                                      <input
                                        type="text"
                                        value={editFormData.nama}
                                        onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Masukkan nama lengkap siswa"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-blue-600" />
                                        NISN
                                      </label>
                                      <input
                                        type="text"
                                        value={editFormData.nisn}
                                        onChange={(e) => setEditFormData({ ...editFormData, nisn: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Masukkan NISN"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-blue-600" />
                                        Kelas
                                      </label>
                                      <select
                                        value={editFormData.kelasId}
                                        onChange={(e) => setEditFormData({ ...editFormData, kelasId: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                      >
                                        <option value="">Pilih Kelas</option>
                                        {kelasList.map((kelas) => (
                                          <option key={kelas.id} value={kelas.id}>{kelas.nama}</option>
                                        ))}
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-600" />
                                        Jenis Kelamin
                                      </label>
                                      <select
                                        value={editFormData.jenisKelamin}
                                        onChange={(e) => setEditFormData({ ...editFormData, jenisKelamin: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                      >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="L">Laki-laki</option>
                                        <option value="P">Perempuan</option>
                                      </select>
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
                                    {editLoading ? 'Menyimpan...' : 'Update Siswa'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(siswa)}
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
          {!loading && filteredSiswaList.length > 0 && (
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
                <DialogTitle className="text-2xl font-bold text-gray-900">Konfirmasi Hapus Siswa</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Apakah Anda yakin ingin menghapus data siswa ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteModal.siswa && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center ${
                    deleteModal.siswa.jenisKelamin === 'L'
                      ? 'text-blue-600'
                      : deleteModal.siswa.jenisKelamin === 'P'
                      ? 'text-pink-600'
                      : 'text-gray-600'
                  }`}>
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Data Siswa</h3>
                    <p className="text-sm text-red-700">{deleteModal.siswa.nama}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Nama Lengkap:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.siswa.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">NISN:</span>
                    <span className="text-sm font-semibold text-red-900 font-mono">{deleteModal.siswa.nisn}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Kelas:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.siswa.kelas.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-red-600">Jenis Kelamin:</span>
                    <span className="text-sm font-semibold text-red-900">
                      {deleteModal.siswa.jenisKelamin === 'L' ? 'Laki-laki' : deleteModal.siswa.jenisKelamin === 'P' ? 'Perempuan' : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Perhatian!</h4>
                    <p className="text-sm text-yellow-700">
                      Data siswa yang telah dihapus tidak dapat dipulihkan kembali. Pastikan tidak ada jurnal atau data terkait yang masih menggunakan siswa ini.
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
              {deleteLoading ? 'Menghapus...' : 'Hapus Siswa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
