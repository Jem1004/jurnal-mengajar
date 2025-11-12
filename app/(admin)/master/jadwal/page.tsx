'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import Modal from '@/components/ui/modal'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import { 
  getJadwal, 
  createJadwal, 
  updateJadwal, 
  deleteJadwal,
  getGuru,
  getKelas,
  getMataPelajaran
} from '@/app/actions/master'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Filters
  const [filterGuruId, setFilterGuruId] = useState<string>('')
  const [filterKelasId, setFilterKelasId] = useState<string>('')
  const [filterHari, setFilterHari] = useState<string>('')

  // Form state
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
      getJadwal(),
      getGuru(),
      getKelas(),
      getMataPelajaran()
    ])
    
    if (jadwalResult.success && jadwalResult.data) {
      setJadwalList(jadwalResult.data)
      setFilteredJadwalList(jadwalResult.data)
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

  const handleAdd = () => {
    setModalMode('add')
    setSelectedJadwal(null)
    setFormData({
      guruId: guruList.length > 0 ? guruList[0].id : '',
      kelasId: kelasList.length > 0 ? kelasList[0].id : '',
      mataPelajaranId: mataPelajaranList.length > 0 ? mataPelajaranList[0].id : '',
      hari: '1',
      jamMulai: '',
      jamSelesai: '',
      semester: '1',
      tahunAjaran: '2024/2025'
    })
    setIsModalOpen(true)
    setError(null)
  }

  const handleEdit = (jadwal: Jadwal) => {
    setModalMode('edit')
    setSelectedJadwal(jadwal)
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
    setIsModalOpen(true)
    setError(null)
  }

  const handleDelete = async (jadwal: Jadwal) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus jadwal ${jadwal.mataPelajaran.nama} - ${jadwal.kelas.nama}?`)) {
      return
    }

    const result = await deleteJadwal(jadwal.id)
    if (result.success) {
      setSuccess('Jadwal berhasil dihapus')
      loadData()
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.error || 'Failed to delete jadwal')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate time
    if (formData.jamMulai >= formData.jamSelesai) {
      setError('Jam selesai harus lebih besar dari jam mulai')
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

    if (modalMode === 'add') {
      const result = await createJadwal(formDataObj)
      if (result.success) {
        setSuccess('Jadwal berhasil ditambahkan')
        setIsModalOpen(false)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to create jadwal')
      }
    } else if (selectedJadwal) {
      const result = await updateJadwal(selectedJadwal.id, formDataObj)
      if (result.success) {
        setSuccess('Jadwal berhasil diupdate')
        setIsModalOpen(false)
        loadData()
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError(result.error || 'Failed to update jadwal')
      }
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Management Jadwal</h1>
            <p className="text-gray-600 mt-1">Kelola jadwal mengajar</p>
          </div>
          <Button onClick={handleAdd}>
            Tambah Jadwal
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Guru
              </label>
              <Select
                value={filterGuruId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterGuruId(e.target.value)}
                options={[
                  { value: '', label: 'Semua Guru' },
                  ...guruList.map((guru) => ({ value: guru.id, label: guru.user.nama }))
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Kelas
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Hari
              </label>
              <Select
                value={filterHari}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterHari(e.target.value)}
                options={[
                  { value: '', label: 'Semua Hari' },
                  ...HARI_MAP.map((hari, index) => ({ value: index.toString(), label: hari }))
                ]}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <Table>
              <thead>
                <tr>
                  <th>Guru</th>
                  <th>Hari</th>
                  <th>Jam</th>
                  <th>Kelas</th>
                  <th>Mata Pelajaran</th>
                  <th>Semester</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredJadwalList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      {filterGuruId || filterKelasId || filterHari ? 'Tidak ada jadwal sesuai filter' : 'Belum ada data jadwal'}
                    </td>
                  </tr>
                ) : (
                  filteredJadwalList.map((jadwal) => (
                    <tr key={jadwal.id}>
                      <td>{jadwal.guru.user.nama}</td>
                      <td>{HARI_MAP[jadwal.hari]}</td>
                      <td>{jadwal.jamMulai} - {jadwal.jamSelesai}</td>
                      <td>{jadwal.kelas.nama}</td>
                      <td>{jadwal.mataPelajaran.nama}</td>
                      <td>Semester {jadwal.semester} - {jadwal.tahunAjaran}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(jadwal)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(jadwal)}
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
          title={modalMode === 'add' ? 'Tambah Jadwal' : 'Edit Jadwal'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guru <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.guruId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, guruId: e.target.value })}
                required
                placeholder="Pilih Guru"
                options={guruList.map((guru) => ({ value: guru.id, label: guru.user.nama }))}
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
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.mataPelajaranId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, mataPelajaranId: e.target.value })}
                required
                placeholder="Pilih Mata Pelajaran"
                options={mataPelajaranList.map((mapel) => ({ value: mapel.id, label: mapel.nama }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hari <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.hari}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, hari: e.target.value })}
                required
                options={HARI_MAP.map((hari, index) => ({ value: index.toString(), label: hari }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Mulai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.jamMulai}
                  onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Selesai <span className="text-red-500">*</span>
                </label>
                <Input
                  type="time"
                  value={formData.jamSelesai}
                  onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.semester}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, semester: e.target.value })}
                required
                options={[
                  { value: '1', label: 'Semester 1' },
                  { value: '2', label: 'Semester 2' }
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun Ajaran <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.tahunAjaran}
                onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                placeholder="2024/2025"
                pattern="\d{4}/\d{4}"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Format: YYYY/YYYY</p>
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
