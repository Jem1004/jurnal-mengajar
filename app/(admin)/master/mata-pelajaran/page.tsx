'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import { getMataPelajaran, createMataPelajaran, updateMataPelajaran, deleteMataPelajaran } from '@/app/actions/master'

interface MataPelajaran {
  id: string
  nama: string
  kode: string | null
}

export default function ManagementMataPelajaranPage() {
  const [mataPelajaranList, setMataPelajaranList] = useState<MataPelajaran[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedMataPelajaran, setSelectedMataPelajaran] = useState<MataPelajaran | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    kode: ''
  })

  useEffect(() => {
    loadMataPelajaran()
  }, [])

  const loadMataPelajaran = async () => {
    setLoading(true)
    const result = await getMataPelajaran()
    if (result.success && result.data) {
      setMataPelajaranList(result.data)
    } else {
      setError(result.error || 'Failed to load mata pelajaran')
    }
    setLoading(false)
  }

  const handleAdd = () => {
    setModalMode('add')
    setSelectedMataPelajaran(null)
    setFormData({
      nama: '',
      kode: ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleEdit = (mataPelajaran: MataPelajaran) => {
    setModalMode('edit')
    setSelectedMataPelajaran(mataPelajaran)
    setFormData({
      nama: mataPelajaran.nama,
      kode: mataPelajaran.kode || ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleDelete = async (mataPelajaran: MataPelajaran) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus mata pelajaran ${mataPelajaran.nama}?`)) {
      return
    }

    const result = await deleteMataPelajaran(mataPelajaran.id)
    if (result.success) {
      setSuccess('Mata pelajaran berhasil dihapus')
      loadMataPelajaran()
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete mata pelajaran')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('nama', formData.nama)
    formDataObj.append('kode', formData.kode)

    if (modalMode === 'add') {
      const result = await createMataPelajaran(formDataObj)
      if (result.success) {
        setSuccess('Mata pelajaran berhasil ditambahkan')
        setIsModalOpen(false)
        loadMataPelajaran()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create mata pelajaran')
      }
    } else if (selectedMataPelajaran) {
      const result = await updateMataPelajaran(selectedMataPelajaran.id, formDataObj)
      if (result.success) {
        setSuccess('Mata pelajaran berhasil diupdate')
        setIsModalOpen(false)
        loadMataPelajaran()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update mata pelajaran')
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Mata Pelajaran</h1>
            <p className="text-gray-600 mt-1">Kelola data mata pelajaran</p>
          </div>
          <Button onClick={handleAdd}>
            Tambah Mata Pelajaran
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
                  <th>Nama Mata Pelajaran</th>
                  <th>Kode</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {mataPelajaranList.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500">
                      Belum ada data mata pelajaran
                    </td>
                  </tr>
                ) : (
                  mataPelajaranList.map((mataPelajaran) => (
                    <tr key={mataPelajaran.id}>
                      <td>{mataPelajaran.nama}</td>
                      <td>{mataPelajaran.kode || '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(mataPelajaran)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(mataPelajaran)}
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
          title={modalMode === 'add' ? 'Tambah Mata Pelajaran' : 'Edit Mata Pelajaran'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Matematika, Bahasa Indonesia"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kode Mata Pelajaran
              </label>
              <Input
                type="text"
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                placeholder="Contoh: MTK, BIND"
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
