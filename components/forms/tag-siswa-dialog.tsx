'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import Textarea from '@/components/ui/textarea'
import { TagSiswa } from '@prisma/client'

interface TagSiswaDialogProps {
  isOpen: boolean
  onClose: () => void
  siswaList: Array<{
    id: string
    nisn: string
    nama: string
  }>
  onAddTag: (tag: {
    siswaId: string
    tag: TagSiswa
    keterangan?: string
  }) => void
}

export default function TagSiswaDialog({ isOpen, onClose, siswaList, onAddTag }: TagSiswaDialogProps) {
  const [selectedSiswaId, setSelectedSiswaId] = useState('')
  const [selectedTag, setSelectedTag] = useState<TagSiswa | ''>('')
  const [keterangan, setKeterangan] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const tagOptions = [
    { value: TagSiswa.PERLU_REMEDIAL, label: 'Perlu Remedial', color: 'bg-red-50 border-red-200 text-red-700', radioColor: 'text-red-600' },
    { value: TagSiswa.PERLU_PENGAYAAN, label: 'Perlu Pengayaan', color: 'bg-emerald-50 border-emerald-200 text-emerald-700', radioColor: 'text-emerald-600' },
    { value: TagSiswa.MASALAH_PERILAKU, label: 'Masalah Perilaku', color: 'bg-orange-50 border-orange-200 text-orange-700', radioColor: 'text-orange-600' },
    { value: TagSiswa.RUJUK_BK, label: 'Rujuk ke BK', color: 'bg-blue-50 border-blue-200 text-blue-700', radioColor: 'text-blue-600' },
  ]

  const handleReset = () => {
    setSelectedSiswaId('')
    setSelectedTag('')
    setKeterangan('')
    setErrors({})
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!selectedSiswaId) {
      newErrors.siswa = 'Pilih siswa terlebih dahulu'
    }

    if (!selectedTag) {
      newErrors.tag = 'Pilih tag terlebih dahulu'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onAddTag({
      siswaId: selectedSiswaId,
      tag: selectedTag as TagSiswa,
      keterangan: keterangan.trim() || undefined
    })

    handleClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-slate-900">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            Tandai Siswa untuk Tindak Lanjut
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Pilih siswa dan tag yang sesuai untuk monitoring dan tindak lanjut khusus
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Pilih Siswa */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Pilih Siswa
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedSiswaId}
                onChange={(e) => {
                  setSelectedSiswaId(e.target.value)
                  setErrors(prev => ({ ...prev, siswa: '' }))
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 appearance-none bg-white ${
                  errors.siswa
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-purple-500 focus:ring-purple-500/20'
                }`}
              >
                <option value="">-- Pilih Siswa --</option>
                {siswaList.map((siswa) => (
                  <option key={siswa.id} value={siswa.id}>
                    {siswa.nama} ({siswa.nisn})
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.siswa && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.siswa}
              </p>
            )}
          </div>

          {/* Pilih Tag */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
              Pilih Tag
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="grid gap-3">
              {tagOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-md ${
                    selectedTag === option.value
                      ? option.color + ' shadow-md scale-[1.02]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="tag"
                    value={option.value}
                    checked={selectedTag === option.value}
                    onChange={(e) => {
                      setSelectedTag(e.target.value as TagSiswa)
                      setErrors(prev => ({ ...prev, tag: '' }))
                    }}
                    className={`h-5 w-5 focus:ring-2 focus:ring-offset-2 ${option.radioColor} focus:ring-opacity-20`}
                  />
                  <div className="flex-1">
                    <span className="font-semibold">{option.label}</span>
                  </div>
                  {selectedTag === option.value && (
                    <div className={`w-6 h-6 rounded-full ${option.radioColor} bg-opacity-20 flex items-center justify-center`}>
                      <svg className={`w-4 h-4 ${option.radioColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </label>
              ))}
            </div>
            {errors.tag && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.tag}
              </p>
            )}
          </div>

          {/* Keterangan */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wide">
              <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
              Keterangan
              <span className="text-slate-400 text-xs ml-1">(Opsional)</span>
            </label>
            <Textarea
              placeholder="Jelaskan alasan atau detail tindak lanjut yang diperlukan..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              rows={4}
              className="resize-none border-slate-200 focus:border-slate-500 focus:ring-slate-500/20"
            />
            <p className="text-xs text-slate-500">Berikan detail tambahan untuk memperjelas alasan penandaan siswa</p>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Tag
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}