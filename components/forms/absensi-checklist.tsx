'use client'

import { StatusAbsensi } from '@prisma/client'

interface AbsensiChecklistProps {
  siswaList: Array<{
    id: string
    nisn: string
    nama: string
  }>
  absensi: Array<{
    siswaId: string
    status: StatusAbsensi
  }>
  onUpdateStatus: (siswaId: string, status: StatusAbsensi) => void
}

export default function AbsensiChecklist({ siswaList, absensi, onUpdateStatus }: AbsensiChecklistProps) {
  // Calculate summary
  const summary = {
    hadir: absensi.filter(a => a.status === StatusAbsensi.HADIR).length,
    sakit: absensi.filter(a => a.status === StatusAbsensi.SAKIT).length,
    izin: absensi.filter(a => a.status === StatusAbsensi.IZIN).length,
    alpa: absensi.filter(a => a.status === StatusAbsensi.ALPA).length,
  }

  const getStatusColor = (status: StatusAbsensi, isActive: boolean) => {
    if (!isActive) {
      return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }

    switch (status) {
      case StatusAbsensi.HADIR:
        return 'bg-green-600 text-white'
      case StatusAbsensi.SAKIT:
        return 'bg-yellow-600 text-white'
      case StatusAbsensi.IZIN:
        return 'bg-blue-600 text-white'
      case StatusAbsensi.ALPA:
        return 'bg-red-600 text-white'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: StatusAbsensi) => {
    switch (status) {
      case StatusAbsensi.HADIR:
        return 'Hadir'
      case StatusAbsensi.SAKIT:
        return 'Sakit'
      case StatusAbsensi.IZIN:
        return 'Izin'
      case StatusAbsensi.ALPA:
        return 'Alpa'
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Semua siswa default hadir. Klik tombol status untuk mengubah.
      </p>

      {/* Student list with status toggles */}
      <div className="space-y-2">
        {siswaList.map((siswa) => {
          const currentStatus = absensi.find(a => a.siswaId === siswa.id)?.status || StatusAbsensi.HADIR
          
          return (
            <div 
              key={siswa.id} 
              className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  currentStatus === StatusAbsensi.HADIR ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-gray-900">{siswa.nama}</span>
                <span className="text-sm text-gray-500">({siswa.nisn})</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.values(StatusAbsensi).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => onUpdateStatus(siswa.id, status)}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      getStatusColor(status, currentStatus === status)
                    }`}
                    aria-pressed={currentStatus === status}
                    aria-label={`Tandai ${siswa.nama} sebagai ${getStatusLabel(status)}`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="mb-3 font-medium text-gray-900">Rekap Absensi:</p>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-600" />
            <span>Hadir: <span className="font-semibold text-green-600">{summary.hadir}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-600" />
            <span>Sakit: <span className="font-semibold text-yellow-600">{summary.sakit}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600" />
            <span>Izin: <span className="font-semibold text-blue-600">{summary.izin}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-600" />
            <span>Alpa: <span className="font-semibold text-red-600">{summary.alpa}</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
