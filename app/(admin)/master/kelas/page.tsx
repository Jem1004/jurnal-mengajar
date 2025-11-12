'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { getKelas, createKelas, updateKelas, deleteKelas } from '@/app/actions/master'

interface Kelas {
  id: string
  nama: string
  tingkat: number
  jurusan: string | null
}

export default function ManagementKelasPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    nama: '',
    tingkat: '10',
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

  const handleAdd = () => {
    setModalMode('add')
    setSelectedKelas(null)
    setFormData({
      nama: '',
      tingkat: '10',
      jurusan: ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleEdit = (kelas: Kelas) => {
    setModalMode('edit')
    setSelectedKelas(kelas)
    setFormData({
      nama: kelas.nama,
      tingkat: kelas.tingkat.toString(),
      jurusan: kelas.jurusan || ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleDelete = async (kelas: Kelas) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas ${kelas.nama}?`)) {
      return
    }

    const result = await deleteKelas(kelas.id)
    if (result.success) {
      setSuccess('Kelas berhasil dihapus')
      loadKelas()
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete kelas')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('nama', formData.nama)
    formDataObj.append('tingkat', formData.tingkat)
    formDataObj.append('jurusan', formData.jurusan)

    if (modalMode === 'add') {
      const result = await createKelas(formDataObj)
      if (result.success) {
        setSuccess('Kelas berhasil ditambahkan')
        setIsModalOpen(false)
        loadKelas()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create kelas')
      }
    } else if (selectedKelas) {
      const result = await updateKelas(selectedKelas.id, formDataObj)
      if (result.success) {
        setSuccess('Kelas berhasil diupdate')
        setIsModalOpen(false)
        loadKelas()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update kelas')
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Kelas</h1>
            <p className="text-gray-600 mt-1">Kelola data rombongan belajar</p>
          </div>
          <Button onClick={handleAdd}>
            Tambah Kelas
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
                  <th>Nama Kelas</th>
                  <th>Tingkat</th>
                  <th>Jurusan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kelasList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">
                      Belum ada data kelas
                    </td>
                  </tr>
                ) : (
                  kelasList.map((kelas) => (
                    <tr key={kelas.id}>
                      <td>{kelas.nama}</td>
                      <td>{kelas.tingkat}</td>
                      <td>{kelas.jurusan || '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(kelas)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(kelas)}
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
          title={modalMode === 'add' ? 'Tambah Kelas' : 'Edit Kelas'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Kelas <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: 10-A, 11-IPA-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tingkat <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.tingkat}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, tingkat: e.target.value })}
                required
                options={[
                  { value: '10', label: '10' },
                  { value: '11', label: '11' },
                  { value: '12', label: '12' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jurusan
              </label>
              <Input
                type="text"
                value={formData.jurusan}
                onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                placeholder="Contoh: IPA, IPS, Umum"
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
