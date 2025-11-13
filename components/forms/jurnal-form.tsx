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
import TagSiswaDialog from './tag-siswa-dialog'

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
  
  // Refleksi dan Ketercapaian TP
  const [statusKetercapaianTP, setStatusKetercapaianTP] = useState('TERCAPAI')
  const [catatanRefleksi, setCatatanRefleksi] = useState('')
  const [hambatan, setHambatan] = useState('')
  const [solusi, setSolusi] = useState('')
  
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
      
      // Refleksi dan Ketercapaian TP
      formData.append('statusKetercapaianTP', statusKetercapaianTP)
      
      if (catatanRefleksi.trim()) {
        formData.append('catatanRefleksi', catatanRefleksi)
      }
      
      if (hambatan.trim()) {
        formData.append('hambatan', hambatan)
      }
      
      if (solusi.trim()) {
        formData.append('solusi', solusi)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-red-800 shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg mb-1">Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Detail Pembelajaran */}
      <Card className="shadow-xl border border-slate-200 animate-in fade-in duration-300 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Detail Pembelajaran</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Isi informasi penting tentang proses pembelajaran</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Tujuan Pembelajaran
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              placeholder="Tuliskan tujuan pembelajaran yang ingin dicapai..."
              value={tujuanPembelajaran}
              onChange={(e) => setTujuanPembelajaran(e.target.value)}
              error={errors.tujuanPembelajaran}
              required
              rows={4}
              className="resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
            />
            {errors.tujuanPembelajaran && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.tujuanPembelajaran}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Kegiatan Pembelajaran
              <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              placeholder="Deskripsikan kegiatan pembelajaran yang dilakukan..."
              value={kegiatanPembelajaran}
              onChange={(e) => setKegiatanPembelajaran(e.target.value)}
              error={errors.kegiatanPembelajaran}
              required
              rows={5}
              className="resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
            {errors.kegiatanPembelajaran && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.kegiatanPembelajaran}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Asesmen/Penilaian
              <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
            </label>
            <Textarea
              placeholder="Tuliskan asesmen atau penilaian yang dilakukan..."
              value={asesmen}
              onChange={(e) => setAsesmen(e.target.value)}
              rows={4}
              className="resize-none border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Refleksi & Ketercapaian TP */}
      <Card className="shadow-xl border border-slate-200 animate-in fade-in duration-300 overflow-hidden" style={{ animationDelay: '100ms' }}>
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Refleksi & Ketercapaian TP</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Evaluasi pencapaian tujuan pembelajaran dan refleksi</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Status Ketercapaian Tujuan Pembelajaran
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setStatusKetercapaianTP('TERCAPAI')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  statusKetercapaianTP === 'TERCAPAI'
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    statusKetercapaianTP === 'TERCAPAI'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300'
                  }`}>
                    {statusKetercapaianTP === 'TERCAPAI' && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900">Tercapai</div>
                    <div className="text-xs text-gray-500">TP tercapai sepenuhnya</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusKetercapaianTP('SEBAGIAN_TERCAPAI')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  statusKetercapaianTP === 'SEBAGIAN_TERCAPAI'
                    ? 'border-yellow-500 bg-yellow-50 shadow-md'
                    : 'border-gray-200 hover:border-yellow-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    statusKetercapaianTP === 'SEBAGIAN_TERCAPAI'
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-gray-300'
                  }`}>
                    {statusKetercapaianTP === 'SEBAGIAN_TERCAPAI' && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900">Sebagian</div>
                    <div className="text-xs text-gray-500">TP tercapai sebagian</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStatusKetercapaianTP('TIDAK_TERCAPAI')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  statusKetercapaianTP === 'TIDAK_TERCAPAI'
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    statusKetercapaianTP === 'TIDAK_TERCAPAI'
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-300'
                  }`}>
                    {statusKetercapaianTP === 'TIDAK_TERCAPAI' && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm text-gray-900">Tidak Tercapai</div>
                    <div className="text-xs text-gray-500">TP belum tercapai</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Catatan Refleksi
              <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
            </label>
            <Textarea
              placeholder="Refleksikan proses pembelajaran: Apa yang berjalan baik? Apa yang perlu diperbaiki?"
              value={catatanRefleksi}
              onChange={(e) => setCatatanRefleksi(e.target.value)}
              rows={3}
              className="resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Hambatan
                <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
              </label>
              <Textarea
                placeholder="Hambatan yang dihadapi selama pembelajaran..."
                value={hambatan}
                onChange={(e) => setHambatan(e.target.value)}
                rows={3}
                className="resize-none border-slate-200 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Solusi
                <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
              </label>
              <Textarea
                placeholder="Solusi yang diterapkan atau akan diterapkan..."
                value={solusi}
                onChange={(e) => setSolusi(e.target.value)}
                rows={3}
                className="resize-none border-slate-200 focus:border-green-500 focus:ring-green-500/20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Absensi Siswa */}
      <Card className="shadow-xl border border-slate-200 animate-in fade-in duration-300 overflow-hidden" style={{ animationDelay: '100ms' }}>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Absensi Siswa</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Atur kehadiran {siswaList.length} siswa</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Hadir</span>
              <div className="w-2 h-2 bg-yellow-500 rounded-full ml-2"></div>
              <span>Sakit</span>
              <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
              <span>Izin</span>
              <div className="w-2 h-2 bg-slate-400 rounded-full ml-2"></div>
              <span>Alpa</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <AbsensiChecklist
            siswaList={siswaList}
            absensi={absensi}
            onUpdateStatus={updateAbsensiStatus}
          />
        </CardContent>
      </Card>

      {/* Section 3: Catatan & Tindak Lanjut */}
      <Card className="shadow-xl border border-slate-200 animate-in fade-in duration-300 overflow-hidden" style={{ animationDelay: '200ms' }}>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">Catatan & Tindak Lanjut</CardTitle>
              <p className="text-sm text-slate-600 mt-1">Dokumentasi dan monitoring pembelajaran</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Catatan Khusus
              <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
            </label>
            <div className="relative">
              <Textarea
                placeholder="Tuliskan catatan khusus, hambatan, atau keberhasilan pembelajaran..."
                value={catatanKhusus}
                onChange={(e) => setCatatanKhusus(e.target.value)}
                rows={4}
                maxLength={1000}
                className="resize-none border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
              />
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                {catatanKhusus.length}/1000
              </div>
            </div>
            <p className="text-xs text-slate-500">Maksimal 1000 karakter</p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              Link Bukti Pembelajaran
              <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                value={linkBukti}
                onChange={(e) => setLinkBukti(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-200 ${errors.linkBukti ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.linkBukti && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.linkBukti}
              </p>
            )}
            <p className="text-xs text-slate-500">Link ke Google Drive, foto, atau dokumentasi pembelajaran</p>
          </div>

          {/* Tag Siswa Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                  Tandai Siswa untuk Tindak Lanjut
                </label>
                <span className="text-slate-400 text-xs">(Opsional)</span>
              </div>
              <Button
                type="button"
                onClick={() => setIsTagModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tandai Siswa
              </Button>
            </div>

            {tagSiswa.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 font-medium">Siswa yang ditandai ({tagSiswa.length}):</p>
                <div className="grid gap-3">
                  {tagSiswa.map((tag, index) => {
                    const siswa = siswaList.find(s => s.id === tag.siswaId)
                    return (
                      <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50 p-4 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{siswa?.nama}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                tag.tag === 'BERPRESTASI' ? 'bg-emerald-100 text-emerald-700' :
                                tag.tag === 'BUTUH_PERHATIAN' ? 'bg-yellow-100 text-yellow-700' :
                                tag.tag === 'BERMASALAH' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {tag.tag.replace(/_/g, ' ')}
                              </span>
                              {tag.keterangan && (
                                <span className="text-xs text-slate-600">{tag.keterangan}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTagSiswa(index)}
                          className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {tagSiswa.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-sm text-slate-500">Belum ada siswa yang ditandai</p>
                <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk menandai siswa yang memerlukan perhatian khusus</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tag Siswa Dialog */}
      <TagSiswaDialog
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        siswaList={siswaList}
        onAddTag={addTagSiswa}
      />

      {/* Submit Button */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-emerald-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Batal
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Jurnal
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
