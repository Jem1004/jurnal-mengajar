'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge'

interface JadwalCardProps {
  jadwal: {
    id: string
    jamMulai: string
    jamSelesai: string
    kelas: {
      nama: string
    }
    mataPelajaran: {
      nama: string
    }
    jurnal: Array<{
      id: string
    }>
  }
}

export default function JadwalCard({ jadwal }: JadwalCardProps) {
  const today = new Date()
  const formattedDate = today.toISOString().split('T')[0]
  
  // Check if jurnal exists for today
  const isJurnalFilled = jadwal.jurnal && jadwal.jurnal.length > 0

  return (
    <Card variant="bordered" className="p-4 hover:shadow-md transition-all duration-200 hover:border-primary-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              {jadwal.jamMulai} - {jadwal.jamSelesai}
            </span>
            {isJurnalFilled && (
              <Badge variant="success" size="sm" className="flex-shrink-0">
                <svg 
                  className="w-3 h-3 mr-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Terisi
              </Badge>
            )}
          </div>
          <div className="text-gray-700 text-sm sm:text-base">
            <span className="font-medium">{jadwal.mataPelajaran.nama}</span>
            <span className="mx-2 hidden sm:inline">•</span>
            <span className="block sm:inline mt-1 sm:mt-0">Kelas {jadwal.kelas.nama}</span>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-full sm:w-auto">
          {isJurnalFilled ? (
            <Link href={`/jurnal/${jadwal.jurnal[0].id}`} className="block w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Lihat Jurnal
              </Button>
            </Link>
          ) : (
            <Link href={`/jurnal/${jadwal.id}?tanggal=${formattedDate}`} className="block w-full sm:w-auto">
              <Button variant="primary" size="sm" className="w-full sm:w-auto">
                Isi Jurnal
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
