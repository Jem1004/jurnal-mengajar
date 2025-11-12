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
import { getGuru, deleteGuru, createGuru, updateGuru } from '@/app/actions/master'
import { Trash2, User, AlertTriangle, Edit, Plus } from 'lucide-react'

interface Guru {
  id: string
  nip: string | null
  user: {
    id: string
    nama: string
    username: string
    email: string | null
  }
}

export default function ManagementGuruPage() {
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; guru: Guru | null }>({
    isOpen: false,
    guru: null
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)

  // Form states for adding guru
  const [addFormData, setAddFormData] = useState({
    nama: '',
    nip: '',
    username: '',
    email: '',
    password: ''
  })

  // Form states for editing guru
  const [editFormData, setEditFormData] = useState({
    nama: '',
    nip: '',
    username: '',
    email: ''
  })

  useEffect(() => {
    loadGuru()
  }, [])

  const loadGuru = async () => {
    setLoading(true)
    const result = await getGuru()
    if (result.success && result.data) {
      setGuruList(result.data)
    } else {
      setError(result.error || 'Failed to load guru')
    }
    setLoading(false)
  }

  const handleDeleteClick = (guru: Guru) => {
    setDeleteModal({ isOpen: true, guru })
  }

  const handleDelete = async () => {
    if (!deleteModal.guru) return

    setDeleteLoading(true)
    const result = await deleteGuru(deleteModal.guru.id)

    if (result.success) {
      setSuccess('Guru berhasil dihapus')
      loadGuru()
      setDeleteModal({ isOpen: false, guru: null })
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete guru')
      setDeleteModal({ isOpen: false, guru: null })
    }
    setDeleteLoading(false)
  }

  const handleCancelDelete = () => {
    if (!deleteLoading) {
      setDeleteModal({ isOpen: false, guru: null })
    }
  }

  const handleAddGuru = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('nama', addFormData.nama)
      formData.append('nip', addFormData.nip)
      formData.append('username', addFormData.username)
      formData.append('email', addFormData.email)
      formData.append('password', addFormData.password)

      const result = await createGuru(formData)

      if (result.success) {
        setSuccess('Guru berhasil ditambahkan')
        setAddFormData({ nama: '', nip: '', username: '', email: '', password: '' })
        setAddModalOpen(false)
        loadGuru()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create guru')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setAddLoading(false)
    }
  }

  const handleEditGuru = async (guruId: string, e: React.FormEvent) => {
    e.preventDefault()
    setEditLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('nama', editFormData.nama)
      formData.append('nip', editFormData.nip)
      formData.append('email', editFormData.email)

      const result = await updateGuru(guruId, formData)

      if (result.success) {
        setSuccess('Data guru berhasil diperbarui')
        setEditModalOpen(null)
        loadGuru()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update guru')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditClick = (guru: Guru) => {
    setEditFormData({
      nama: guru.user.nama,
      nip: guru.nip || '',
      username: guru.user.username,
      email: guru.user.email || ''
    })
    setEditModalOpen(guru.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Guru</h1>
          <p className="text-gray-600 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Kelola data guru dan akun pengguna
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
                Tambah Guru
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-0 shadow-2xl">
            <DialogHeader className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">Tambah Guru Baru</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Isi form di bawah untuk menambahkan data guru baru
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleAddGuru}>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Nama Lengkap</label>
                    <input
                      type="text"
                      value={addFormData.nama}
                      onChange={(e) => setAddFormData({ ...addFormData, nama: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">NIP</label>
                    <input
                      type="text"
                      value={addFormData.nip}
                      onChange={(e) => setAddFormData({ ...addFormData, nip: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan NIP (opsional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Username</label>
                    <input
                      type="text"
                      value={addFormData.username}
                      onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900">Email</label>
                    <input
                      type="email"
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Masukkan email (opsional)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Password</label>
                  <input
                    type="password"
                    value={addFormData.password}
                    onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Masukkan password"
                    required
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
                  {addLoading ? 'Menyimpan...' : 'Simpan Guru'}
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
          <p className="text-gray-600 font-medium">Memuat data guru...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-custom-lg border border-gray-100 overflow-hidden">
          {/* Table Stats */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Guru ({guruList.length})
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
                    Informasi Guru
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guruList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data guru</h3>
                        <p className="text-gray-500 max-w-md">
                          Mulai dengan menambahkan data guru pertama menggunakan tombol &quot;Tambah Guru&quot; di atas.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  guruList.map((guru) => (
                    <tr key={guru.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {guru.user.nama}
                            </div>
                            <div className="text-xs text-gray-500">
                              {guru.nip || 'NIP tidak tersedia'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 font-mono">
                            {guru.user.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {guru.user.email ? (
                            <a href={`mailto:${guru.user.email}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                              {guru.user.email}
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Dialog open={editModalOpen === guru.id} onOpenChange={(open) => !open && setEditModalOpen(null)}>
                            <DialogTrigger asChild>
                              <Button
                                onClick={() => handleEditClick(guru)}
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
                                    <DialogTitle className="text-2xl font-bold text-gray-900">Edit Data Guru</DialogTitle>
                                    <DialogDescription className="text-gray-600">
                                      Ubah informasi data guru di bawah ini
                                    </DialogDescription>
                                  </div>
                                </div>
                              </DialogHeader>

                              <form onSubmit={(e) => handleEditGuru(guru.id, e)}>
                                <div className="space-y-6 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Nama Lengkap</label>
                                      <input
                                        type="text"
                                        value={editFormData.nama}
                                        onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Masukkan nama lengkap"
                                        required
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">NIP</label>
                                      <input
                                        type="text"
                                        value={editFormData.nip}
                                        onChange={(e) => setEditFormData({ ...editFormData, nip: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Masukkan NIP (opsional)"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Username</label>
                                      <input
                                        type="text"
                                        value={editFormData.username}
                                        disabled
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                                        placeholder="Username (tidak dapat diubah)"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-gray-900">Email</label>
                                      <input
                                        type="email"
                                        value={editFormData.email}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Masukkan email (opsional)"
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
                                    {editLoading ? 'Menyimpan...' : 'Update Guru'}
                                  </Button>
                                </DialogFooter>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(guru)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 border-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
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
                <DialogTitle className="text-2xl font-bold text-gray-900">Konfirmasi Hapus Guru</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Apakah Anda yakin ingin menghapus data guru ini? Tindakan ini tidak dapat dibatalkan.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteModal.guru && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-900">Data Guru</h3>
                    <p className="text-sm text-red-700">{deleteModal.guru.user.nama}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Nama Lengkap:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.guru.user.nama}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">NIP:</span>
                    <span className="text-sm font-semibold text-red-900">{deleteModal.guru.nip || 'NIP tidak tersedia'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-red-200">
                    <span className="text-sm text-red-600">Username:</span>
                    <span className="text-sm font-semibold text-red-900 font-mono">{deleteModal.guru.user.username}</span>
                  </div>
                  {deleteModal.guru.user.email && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-red-600">Email:</span>
                      <span className="text-sm font-semibold text-red-900">{deleteModal.guru.user.email}</span>
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
                      Data guru dan akun pengguna yang telah dihapus tidak dapat dipulihkan kembali. Pastikan tidak ada jurnal atau data terkait yang masih digunakan oleh guru ini.
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
              {deleteLoading ? 'Menghapus...' : 'Hapus Guru'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}