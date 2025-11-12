'use client'

import { Card } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import { AbsensiAnalytics } from '@/lib/services/analytics.service'

interface AbsensiAnalyticsCardProps {
  data: AbsensiAnalytics
}

export function AbsensiAnalyticsCard({ data }: AbsensiAnalyticsCardProps) {
  const { topAbsentStudents, totalDays } = data

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Analitik Absensi Siswa
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Siswa dengan ketidakhadiran tertinggi dalam {totalDays} hari terakhir
          </p>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
          <svg
            className="w-8 h-8 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
      </div>

      <div className="space-y-4">
        {topAbsentStudents.length === 0 ? (
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
              Tidak ada siswa yang absen dalam {totalDays} hari terakhir
            </p>
            <p className="text-green-600 text-sm mt-1">
              Kehadiran siswa sangat baik!
            </p>
          </div>
        ) : (
          <>
            {/* Top Absent Student Highlight */}
            {topAbsentStudents[0] && (
              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-gray-700 text-sm leading-relaxed">
                  Dalam {totalDays} hari terakhir di pelajaran Anda, siswa{' '}
                  <span className="font-bold text-orange-700">
                    {topAbsentStudents[0].siswaName}
                  </span>{' '}
                  paling sering absen (
                  <span className="font-bold text-orange-700">
                    {topAbsentStudents[0].totalAbsen}x
                  </span>
                  )
                </p>
              </div>
            )}

            {/* List of Top Absent Students */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Daftar Siswa dengan Ketidakhadiran Tertinggi
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {topAbsentStudents.map((student, index) => (
                  <div
                    key={student.siswaId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-700">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {student.siswaName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {student.sakit > 0 && (
                            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Sakit: {student.sakit}
                            </Badge>
                          )}
                          {student.izin > 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Izin: {student.izin}
                            </Badge>
                          )}
                          {student.alpa > 0 && (
                            <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 border-red-200">
                              Alpa: {student.alpa}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-lg font-bold text-orange-600">
                        {student.totalAbsen}x
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {topAbsentStudents.reduce((sum, s) => sum + s.sakit, 0)}
                </p>
                <p className="text-xs text-blue-700 font-medium mt-1">Total Sakit</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {topAbsentStudents.reduce((sum, s) => sum + s.izin, 0)}
                </p>
                <p className="text-xs text-green-700 font-medium mt-1">Total Izin</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-600">
                  {topAbsentStudents.reduce((sum, s) => sum + s.alpa, 0)}
                </p>
                <p className="text-xs text-red-700 font-medium mt-1">Total Alpa</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
