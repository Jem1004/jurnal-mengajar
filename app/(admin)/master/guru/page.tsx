'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { getGuru, createGuru, updateGuru, deleteGuru } from '@/app/actions/master'

interface Guru {
  id: string
  nip: string | null
  user: {
    id: string
    username: string
    nama: string
    email: string | null
    role: string
  }
}

export default function ManagementGuruPage() {
  const [guruList, setGuruList] = useState<Guru[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama: '',
    email: '',
    nip: ''
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

  const handleAdd = () => {
    setModalMode('add')
    setSelectedGuru(null)
    setFormData({
      username: '',
      password: '',
      nama: '',
      email: '',
      nip: ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleEdit = (guru: Guru) => {
    setModalMode('edit')
    setSelectedGuru(guru)
    setFormData({
      username: guru.user.username,
      password: '',
      nama: guru.user.nama,
      email: guru.user.email || '',
      nip: guru.nip || ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleDelete = async (guru: Guru) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus guru ${guru.user.nama}?`)) {
      return
    }

    const result = await deleteGuru(guru.id)
    if (result.success) {
      setSuccess('Guru berhasil dihapus')
      loadGuru()
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete guru')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('username', formData.username)
    formDataObj.append('nama', formData.nama)
    formDataObj.append('email', formData.email)
    formDataObj.append('nip', formData.nip)

    if (modalMode === 'add') {
      formDataObj.append('password', formData.password)
      const result = await createGuru(formDataObj)
      if (result.success) {
        setSuccess('Guru berhasil ditambahkan')
        setIsModalOpen(false)
        loadGuru()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create guru')
      }
    } else if (selectedGuru) {
      const result = await updateGuru(selectedGuru.id, formDataObj)
      if (result.success) {
        setSuccess('Guru berhasil diupdate')
        setIsModalOpen(false)
        loadGuru()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update guru')
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Guru</h1>
            <p className="text-gray-600 mt-1">Kelola data guru dan akun pengguna</p>
          </div>
          <Button onClick={handleAdd}>
            Tambah Guru
          </Button>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
            {success}
          </div>
        )}

        {error && !isModalOpen && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <Table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>NIP</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {guruList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Belum ada data guru
                    </td>
                  </tr>
                ) : (
                  guruList.map((guru) => (
                    <tr key={guru.id}>
                      <td>{guru.user.nama}</td>
                      <td>{guru.nip || '-'}</td>
                      <td>{guru.user.username}</td>
                      <td>{guru.user.email || '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(guru)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(guru)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={modalMode === 'add' ? 'Tambah Guru' : 'Edit Guru'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIP
              </label>
              <Input
                type="text"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                disabled={modalMode === 'edit'}
              />
              {modalMode === 'edit' && (
                <p className="text-xs text-gray-500 mt-1">Username tidak dapat diubah</p>
              )}
            </div>

            {modalMode === 'add' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit">
                {modalMode === 'add' ? 'Tambah' : 'Simpan'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}
