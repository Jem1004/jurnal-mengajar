'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Badge from '@/components/ui/badge'
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
import { getKelas, deleteKelas, createKelas, updateKelas } from '@/app/actions/master'
import { Trash2, School, Edit, Plus, AlertTriangle, Building, BookOpen } from 'lucide-react'

interface Kelas {
  id: string
  nama: string
  tingkat: number
  jurusan: string | null
}

export default function ManagementKelasPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; kelas: Kelas | null }>({
    isOpen: false,
    kelas: null
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Form states for adding kelas
  const [addFormData, setAddFormData] = useState({
    nama: '',
    tingkat: '',
    jurusan: ''
  })

  // Form states for editing kelas
  const [editFormData, setEditFormData] = useState({
    nama: '',
    tingkat: '',
    jurusan: ''
  })

  useEffect(() => {
    loadKelas()
  }, [])

  const loadKelas = async () => {
    setLoading(true)
    const result = await getKelas()
    if (result.success && result.data) {
      setKelasList(result.data)
    } else {
      setError(result.error || 'Failed to load kelas')
    }
    setLoading(false)
  }

  const handleDeleteClick = (kelas: Kelas) => {
    setDeleteModal({ isOpen: true, kelas })
  }

  const handleDelete = async () => {
    if (!deleteModal.kelas) return

    setDeleteLoading(true)
    const result = await deleteKelas(deleteModal.kelas.id)

    if (result.success) {
      setSuccess('Kelas berhasil dihapus')
      loadKelas()
      setDeleteModal({ isOpen: false, kelas: null })
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete kelas')
      setDeleteModal({ isOpen: false, kelas: null })
    }
    setDeleteLoading(false)
  }

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setDeleteModal({ isOpen: false, kelas: null })
    }
  }

  const handleAddKelas = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('nama', addFormData.nama)
      formData.append('tingkat', addFormData.tingkat)
      if (addFormData.jurusan) {
        formData.append('jurusan', addFormData.jurusan)
      }

      const result = await createKelas(formData)

      if (result.success) {
        setSuccess('Kelas berhasil ditambahkan')
        setAddFormData({ nama: '', tingkat: '', jurusan: '' })
        setAddModalOpen(false)
        loadKelas()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create kelas')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditKelas = async (kelasId: string, e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('nama', editFormData.nama)
      if (editFormData.tingkat) {
        formData.append('tingkat', editFormData.tingkat)
      }
      if (editFormData.jurusan) {
        formData.append('jurusan', editFormData.jurusan)
      }

      const result = await updateKelas(kelasId, formData)

      if (result.success) {
        setSuccess('Kelas berhasil diperbarui')
        setEditModalOpen(null)
        loadKelas()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update kelas')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = (kelas: Kelas) => {
    setEditFormData({
      nama: kelas.nama,
      tingkat: kelas.tingkat.toString(),
      jurusan: kelas.jurusan || ''
    })
    setEditModalOpen(kelas.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Kelas</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Kelola data rombongan belajar
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
                Tambah Kelas
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Tambah Kelas Baru</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Isi form di bawah untuk menambahkan data kelas baru
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleAddKelas}>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Building className="w-4 h-4 text-green-600" />
                    Nama Kelas
                  </label>
                  <input
                    type="text"
                    value={addFormData.nama}
                    onChange={(e) => setAddFormData({ ...addFormData, nama: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contoh: X IPA 1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Tingkat</label>
                  <select
                    value={addFormData.tingkat}
                    onChange={(e) => setAddFormData({ ...addFormData, tingkat: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Pilih Tingkat</option>
                    <option value="10">Kelas 10</option>
                    <option value="11">Kelas 11</option>
                    <option value="12">Kelas 12</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    Jurusan
                  </label>
                  <input
                    type="text"
                    value={addFormData.jurusan}
                    onChange={(e) => setAddFormData({ ...addFormData, jurusan: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Contoh: IPA, IPS, TKJ, RPL (opsional)"
                  />
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
                  {addLoading ? 'Menyimpan...' : 'Simpan Kelas'}
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Memuat data kelas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-custom-lg border border-gray-100 overflow-hidden">
          {/* Table Stats */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Kelas ({kelasList.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Aktif</span>
              </div>
            </div>
          </div>

          {/* Modern Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Kelas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tingkat
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jurusan
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kelasList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data kelas</h3>
                        <p className="text-gray-500 max-w-md">
                          Mulai dengan menambahkan data kelas pertama menggunakan tombol &quot;Tambah Kelas&quot; di atas.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  kelasList.map((kelas) => (
                    <tr key={kelas.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {kelas.tingkat}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {kelas.nama}
                            </div>
                            <div className="text-xs text-gray-500">
                              Kelas {kelas.tingkat}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            kelas.tingkat === 10 ? 'bg-green-100 text-green-600' :
                            kelas.tingkat === 11 ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            <span className="text-xs font-bold">
                              {kelas.tingkat}
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 font-medium">
                            Kelas {kelas.tingkat}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {kelas.jurusan ? (
                            <Badge variant="default" className="font-medium">
                              {kelas.jurusan}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Dialog open={editModalOpen === kelas.id} onOpenChange={(open) => !open && setEditModalOpen(null)}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleEditClick(kelas)}
                                variant="outline"
                                size="sm"
                                className="bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0 shadow-2xl">
                              <DialogHeader className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Edit className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">Edit Data Kelas</DialogTitle>
                                    <DialogDescription className="text-gray-600">
                                      Ubah informasi data kelas di bawah ini
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <form onSubmit={(e) => handleEditKelas(kelas.id, e)}>
                                <div className="space-y-6 py-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                      <Building className="w-4 h-4 text-blue-600" />
                                      Nama Kelas
                                    </label>
                                    <input
                                      type="text"
                                      value={editFormData.nama}
                                      onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                      placeholder="Contoh: X IPA 1"
                                      required
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Tingkat</label>
                                    <select
                                      value={editFormData.tingkat}
                                      onChange={(e) => setEditFormData({ ...editFormData, tingkat: e.target.value })}
                                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                      <option value="">Pilih Tingkat</option>
                                      <option value="10">Kelas 10</option>
                                      <option value="11">Kelas 11</option>
                                      <option value="12">Kelas 12</option>
                                    </select>
                                  </div>

                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                      <BookOpen className="w-4 h-4 text-blue-600" />
                                      Jurusan
                                    </label>
                                    <input
                                      type="text"
                                      value={editFormData.jurusan}
                                      onChange={(e) => setEditFormData({ ...editFormData, jurusan: e.target.value })}
                                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                      placeholder="Contoh: IPA, IPS, TKJ, RPL (opsional)"
                                    />
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
                                    {editLoading ? 'Menyimpan...' : 'Update Kelas'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(kelas)}
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
                <DialogTitle className="text-2xl font-bold text-gray-900">Konfirmasi Hapus Kelas</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Apakah Anda yakin ingin menghapus data kelas ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteModal.kelas && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Data Kelas</h3>
                    <p className="text-sm text-red-700">{deleteModal.kelas.nama}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Nama Kelas:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.kelas.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Tingkat:</span>
                    <span className="text-sm font-semibold text-red-900">Kelas {deleteModal.kelas.tingkat}</span>
                  </div>
                  {deleteModal.kelas.jurusan && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-red-600">Jurusan:</span>
                      <span className="text-sm font-semibold text-red-900">{deleteModal.kelas.jurusan}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-1">Perhatian!</h4>
                    <p className="text-sm text-yellow-700">
                      Data kelas yang telah dihapus tidak dapat dipulihkan kembali. Pastikan tidak ada jurnal atau data terkait yang masih digunakan oleh kelas ini.
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
              {deleteLoading ? 'Menghapus...' : 'Hapus Kelas'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}