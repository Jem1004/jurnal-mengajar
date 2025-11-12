'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { getSiswa, createSiswa, updateSiswa, deleteSiswa, getKelas } from '@/app/actions/master'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filterKelasId, setFilterKelasId] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    nisn: '',
    nama: '',
    kelasId: '',
    jenisKelamin: ''
  })

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
      getSiswa(),
      getKelas()
    ])
    
    if (siswaResult.success && siswaResult.data) {
      setSiswaList(siswaResult.data)
      setFilteredSiswaList(siswaResult.data)
    } else {
      setError(siswaResult.error || 'Failed to load siswa')
    }
    
    if (kelasResult.success && kelasResult.data) {
      setKelasList(kelasResult.data)
    }
    
    setLoading(false)
  }

  const handleAdd = () => {
    setModalMode('add')
    setSelectedSiswa(null)
    setFormData({
      nisn: '',
      nama: '',
      kelasId: kelasList.length > 0 ? kelasList[0].id : '',
      jenisKelamin: ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleEdit = (siswa: Siswa) => {
    setModalMode('edit')
    setSelectedSiswa(siswa)
    setFormData({
      nisn: siswa.nisn,
      nama: siswa.nama,
      kelasId: siswa.kelasId,
      jenisKelamin: siswa.jenisKelamin || ''
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleDelete = async (siswa: Siswa) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa ${siswa.nama}?`)) {
      return
    }

    const result = await deleteSiswa(siswa.id)
    if (result.success) {
      setSuccess('Siswa berhasil dihapus')
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete siswa')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const formDataObj = new FormData()
    formDataObj.append('nisn', formData.nisn)
    formDataObj.append('nama', formData.nama)
    formDataObj.append('kelasId', formData.kelasId)
    formDataObj.append('jenisKelamin', formData.jenisKelamin)

    if (modalMode === 'add') {
      const result = await createSiswa(formDataObj)
      if (result.success) {
        setSuccess('Siswa berhasil ditambahkan')
        setIsModalOpen(false)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create siswa')
      }
    } else if (selectedSiswa) {
      const result = await updateSiswa(selectedSiswa.id, formDataObj)
      if (result.success) {
        setSuccess('Siswa berhasil diupdate')
        setIsModalOpen(false)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update siswa')
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Siswa</h1>
            <p className="text-gray-600 mt-1">Kelola data siswa</p>
          </div>
          <Button onClick={handleAdd}>
            Tambah Siswa
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

        <div className="mb-4 bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter berdasarkan Kelas
          </label>
          <Select
            value={filterKelasId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterKelasId(e.target.value)}
            options={[
              { value: '', label: 'Semua Kelas' },
              ...kelasList.map((kelas) => ({ value: kelas.id, label: kelas.nama }))
            ]}
          />
        </div>

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
                  <th>NISN</th>
                  <th>Nama</th>
                  <th>Kelas</th>
                  <th>Jenis Kelamin</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswaList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      {filterKelasId ? 'Tidak ada siswa di kelas ini' : 'Belum ada data siswa'}
                    </td>
                  </tr>
                ) : (
                  filteredSiswaList.map((siswa) => (
                    <tr key={siswa.id}>
                      <td>{siswa.nisn}</td>
                      <td>{siswa.nama}</td>
                      <td>{siswa.kelas.nama}</td>
                      <td>{siswa.jenisKelamin === 'L' ? 'Laki-laki' : siswa.jenisKelamin === 'P' ? 'Perempuan' : '-'}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(siswa)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(siswa)}
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
          title={modalMode === 'add' ? 'Tambah Siswa' : 'Edit Siswa'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NISN <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                required
              />
            </div>

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
                Kelas <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.kelasId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, kelasId: e.target.value })}
                required
                placeholder="Pilih Kelas"
                options={kelasList.map((kelas) => ({ value: kelas.id, label: kelas.nama }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin
              </label>
              <Select
                value={formData.jenisKelamin}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                placeholder="Pilih Jenis Kelamin"
                options={[
                  { value: 'L', label: 'Laki-laki' },
                  { value: 'P', label: 'Perempuan' }
                ]}
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
