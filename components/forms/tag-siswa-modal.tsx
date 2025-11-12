'use client'

import { useState } from 'react'
import Modal, { ModalFooter } from '@/components/ui/modal'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import Button from '@/components/ui/button'
import { TagSiswa } from '@prisma/client'

interface TagSiswaModalProps {
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

export default function TagSiswaModal({ isOpen, onClose, siswaList, onAddTag }: TagSiswaModalProps) {
  const [selectedSiswaId, setSelectedSiswaId] = useState('')
  const [selectedTag, setSelectedTag] = useState<TagSiswa | ''>('')
  const [keterangan, setKeterangan] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const tagOptions = [
    { value: TagSiswa.PERLU_REMEDIAL, label: 'Perlu Remedial' },
    { value: TagSiswa.PERLU_PENGAYAAN, label: 'Perlu Pengayaan' },
    { value: TagSiswa.MASALAH_PERILAKU, label: 'Masalah Perilaku' },
    { value: TagSiswa.RUJUK_BK, label: 'Rujuk ke BK' },
  ]

  const siswaOptions = siswaList.map(siswa => ({
    value: siswa.id,
    label: `${siswa.nama} (${siswa.nisn})`
  }))

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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tandai Siswa"
      description="Tandai siswa yang memerlukan tindak lanjut khusus"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Pilih Siswa"
          placeholder="-- Pilih Siswa --"
          options={siswaOptions}
          value={selectedSiswaId}
          onChange={(e) => {
            setSelectedSiswaId(e.target.value)
            setErrors(prev => ({ ...prev, siswa: '' }))
          }}
          error={errors.siswa}
          required
        />

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Pilih Tag <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {tagOptions.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                  selectedTag === option.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
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
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium text-gray-900">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.tag && (
            <p className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.tag}
            </p>
          )}
        </div>

        <Textarea
          label="Keterangan"
          placeholder="Tambahkan keterangan atau catatan tambahan (opsional)..."
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          rows={3}
          helperText="Jelaskan alasan atau detail tindak lanjut yang diperlukan"
        />

        <ModalFooter>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Batal
          </Button>
          <Button type="submit">
            Simpan
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}
