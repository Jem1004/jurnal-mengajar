'use client'

import { Card } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { TindakLanjutStats } from '@/lib/services/analytics.service'
import { TagSiswa } from '@prisma/client'
import Link from 'next/link'

interface TindakLanjutCardProps {
  data: TindakLanjutStats
}

const tagLabels: Record<TagSiswa, string> = {
  PERLU_REMEDIAL: 'Perlu Remedial',
  PERLU_PENGAYAAN: 'Perlu Pengayaan',
  MASALAH_PERILAKU: 'Masalah Perilaku',
  RUJUK_BK: 'Rujuk ke BK'
}

const tagColors: Record<TagSiswa, { bg: string; text: string; border: string }> = {
  PERLU_REMEDIAL: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  PERLU_PENGAYAAN: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  MASALAH_PERILAKU: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  RUJUK_BK: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
}

export function TindakLanjutCard({ data }: TindakLanjutCardProps) {
  const { perluRemedial, perluPengayaan, masalahPerilaku, rujukBK, items } = data
  const totalItems = items.length

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Analitik Tindak Lanjut
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Siswa yang memerlukan perhatian dan tindak lanjut khusus
          </p>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
          <svg
            className="w-8 h-8 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {totalItems === 0 ? (
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-green-600 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-green-800 font-medium">
              Tidak ada siswa yang perlu ditindaklanjuti
            </p>
            <p className="text-green-600 text-sm mt-1">
              Semua siswa dalam kondisi baik!
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-2xl font-bold text-yellow-700">{perluRemedial}</p>
                <p className="text-xs text-yellow-600 font-medium mt-1">
                  Perlu Remedial
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-2xl font-bold text-green-700">{perluPengayaan}</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  Perlu Pengayaan
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <p className="text-2xl font-bold text-red-700">{masalahPerilaku}</p>
                <p className="text-xs text-red-600 font-medium mt-1">
                  Masalah Perilaku
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-2xl font-bold text-purple-700">{rujukBK}</p>
                <p className="text-xs text-purple-600 font-medium mt-1">
                  Rujuk ke BK
                </p>
              </div>
            </div>

            {/* Summary Message */}
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <p className="text-gray-700 text-sm leading-relaxed">
                Anda memiliki{' '}
                <span className="font-bold text-purple-700">{totalItems}</span>{' '}
                siswa yang ditandai untuk tindak lanjut yang belum ditindaklanjuti
              </p>
            </div>

            {/* List of Students Needing Follow-up */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Daftar Siswa yang Perlu Ditindaklanjuti
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {items.map((item) => {
                  const colors = tagColors[item.tag]
                  return (
                    <Link
                      key={`${item.siswaId}-${item.jurnalId}`}
                      href={`/jurnal/${item.jurnalId}`}
                      className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-gray-900 truncate">
                              {item.siswaName}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              {tagLabels[item.tag]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                          {item.keterangan && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {item.keterangan}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Action Reminder */}
            <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium">
                  Klik pada nama siswa untuk melihat detail jurnal
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Pastikan untuk menindaklanjuti siswa-siswa ini sesuai dengan kebutuhan mereka
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
