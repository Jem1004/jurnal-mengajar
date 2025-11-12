'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { createJurnal } from '@/app/actions/jurnal'
import { StatusAbsensi, TagSiswa } from '@prisma/client'
import AbsensiChecklist from './absensi-checklist'
import TagSiswaModal from './tag-siswa-modal'

interface JurnalFormProps {
  jadwal: {
    id: string
    jamMulai: string
    jamSelesai: string
    kelas: {
      id: string
      nama: string
    }
    mataPelajaran: {
      id: string
      nama: string
    }
  }
  siswaList: Array<{
    id: string
    nisn: string
    nama: string
  }>
  tanggal: string
}

interface AbsensiState {
  siswaId: string
  status: StatusAbsensi
}

interface TagSiswaState {
  siswaId: string
  tag: TagSiswa
  keterangan?: string
}

export default function JurnalForm({ jadwal, siswaList, tanggal }: JurnalFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState('')
  const [kegiatanPembelajaran, setKegiatanPembelajaran] = useState('')
  const [asesmen, setAsesmen] = useState('')
  const [catatanKhusus, setCatatanKhusus] = useState('')
  const [linkBukti, setLinkBukti] = useState('')
  
  // Initialize absensi with all students as HADIR
  const [absensi, setAbsensi] = useState<AbsensiState[]>(
    siswaList.map(siswa => ({
      siswaId: siswa.id,
      status: StatusAbsensi.HADIR
    }))
  )
  
  const [tagSiswa, setTagSiswa] = useState<TagSiswaState[]>([])
  const [isTagModalOpen, setIsTagModalOpen] = useState(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!tujuanPembelajaran.trim()) {
      newErrors.tujuanPembelajaran = 'Tujuan Pembelajaran wajib diisi'
    }

    if (!kegiatanPembelajaran.trim()) {
      newErrors.kegiatanPembelajaran = 'Kegiatan Pembelajaran wajib diisi'
    }

    if (linkBukti.trim() && !isValidUrl(linkBukti)) {
      newErrors.linkBukti = 'Format URL tidak valid'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('jadwalId', jadwal.id)
      formData.append('tanggal', tanggal)
      formData.append('tujuanPembelajaran', tujuanPembelajaran)
      formData.append('kegiatanPembelajaran', kegiatanPembelajaran)
      
      if (asesmen.trim()) {
        formData.append('asesmen', asesmen)
      }
      
      if (catatanKhusus.trim()) {
        formData.append('catatanKhusus', catatanKhusus)
      }
      
      if (linkBukti.trim()) {
        formData.append('linkBukti', linkBukti)
      }
      
      formData.append('absensi', JSON.stringify(absensi))
      formData.append('tagSiswa', JSON.stringify(tagSiswa))

      const result = await createJurnal(formData)

      if (result.success) {
        // Redirect to dashboard with success message
        router.push('/dashboard?success=true')
        router.refresh()
      } else {
        setError(result.error || 'Gagal menyimpan jurnal')
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan jurnal')
      console.error('Submit error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateAbsensiStatus = (siswaId: string, status: StatusAbsensi) => {
    setAbsensi(prev =>
      prev.map(item =>
        item.siswaId === siswaId ? { ...item, status } : item
      )
    )
  }

  const addTagSiswa = (newTag: TagSiswaState) => {
    setTagSiswa(prev => [...prev, newTag])
  }

  const removeTagSiswa = (index: number) => {
    setTagSiswa(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-800 border border-red-200 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium text-sm sm:text-base">Error</p>
              <p className="text-xs sm:text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Info Sesi (Pre-filled) - Will be implemented in subtask 9.2 */}
      <Card variant="bordered" className="animate-in fade-in duration-300">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Info Sesi Pembelajaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Waktu/Jam"
              value={`${jadwal.jamMulai} - ${jadwal.jamSelesai}`}
              disabled
            />
            <Input
              label="Kelas"
              value={jadwal.kelas.nama}
              disabled
            />
            <Input
              label="Mata Pelajaran"
              value={jadwal.mataPelajaran.nama}
              disabled
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>
          <Input
            label="Tanggal"
            type="date"
            value={tanggal}
            disabled
          />
        </CardContent>
      </Card>

      {/* Section 2: Detail Pembelajaran - Will be implemented in subtask 9.3 */}
      <Card variant="bordered" className="animate-in fade-in duration-300" style={{ animationDelay: '100ms' }}>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Detail Pembelajaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Tujuan Pembelajaran"
            placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
            value={tujuanPembelajaran}
            onChange={(e) => setTujuanPembelajaran(e.target.value)}
            error={errors.tujuanPembelajaran}
            required
            rows={3}
          />
          <Textarea
            label="Kegiatan Pembelajaran"
            placeholder="Deskripsikan kegiatan pembelajaran yang dilakukan..."
            value={kegiatanPembelajaran}
            onChange={(e) => setKegiatanPembelajaran(e.target.value)}
            error={errors.kegiatanPembelajaran}
            required
            rows={4}
          />
          <Textarea
            label="Asesmen/Penilaian"
            placeholder="Tuliskan asesmen atau penilaian yang dilakukan (opsional)..."
            value={asesmen}
            onChange={(e) => setAsesmen(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Section 3: Absensi */}
      <Card variant="bordered" className="animate-in fade-in duration-300" style={{ animationDelay: '200ms' }}>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Absensi Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <AbsensiChecklist
            siswaList={siswaList}
            absensi={absensi}
            onUpdateStatus={updateAbsensiStatus}
          />
        </CardContent>
      </Card>

      {/* Section 4: Catatan & Tindak Lanjut - Will be implemented in subtask 9.5 & 9.6 */}
      <Card variant="bordered" className="animate-in fade-in duration-300" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Catatan & Tindak Lanjut</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Catatan Khusus"
            placeholder="Tuliskan catatan khusus, hambatan, atau keberhasilan pembelajaran (opsional)..."
            value={catatanKhusus}
            onChange={(e) => setCatatanKhusus(e.target.value)}
            rows={3}
            helperText="Maksimal 1000 karakter"
            maxLength={1000}
          />
          <Input
            label="Link Bukti Pembelajaran"
            type="url"
            placeholder="https://drive.google.com/..."
            value={linkBukti}
            onChange={(e) => setLinkBukti(e.target.value)}
            error={errors.linkBukti}
            helperText="Link ke Google Drive, foto, atau dokumentasi pembelajaran"
          />

          {/* Tag Siswa section - will be enhanced with modal in subtask 9.6 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tandai Siswa untuk Tindak Lanjut
            </label>
            <p className="mb-3 text-sm text-gray-600">
              Tandai siswa yang memerlukan perhatian khusus
            </p>
            
            {tagSiswa.length > 0 && (
              <div className="mb-3 space-y-2">
                {tagSiswa.map((tag, index) => {
                  const siswa = siswaList.find(s => s.id === tag.siswaId)
                  return (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div>
                        <p className="font-medium text-gray-900">{siswa?.nama}</p>
                        <p className="text-sm text-gray-600">{tag.tag.replace(/_/g, ' ')}</p>
                        {tag.keterangan && (
                          <p className="text-sm text-gray-500">{tag.keterangan}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTagSiswa(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTagModalOpen(true)}
            >
              + Tandai Siswa
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tag Siswa Modal */}
      <TagSiswaModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        siswaList={siswaList}
        onAddTag={addTagSiswa}
      />

      {/* Submit Button */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-200 -mx-4 sm:-mx-6 px-4 sm:px-6 lg:-mx-8 lg:px-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Batal
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal'}
        </Button>
      </div>
    </form>
  )
}
