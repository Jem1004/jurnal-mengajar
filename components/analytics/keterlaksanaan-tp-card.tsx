'use client'

import { Card } from '@/components/ui/card'
import { KeterlaksanaanStats } from '@/lib/services/analytics.service'

interface KeterlaksanaanTPCardProps {
  data: KeterlaksanaanStats
}

export function KeterlaksanaanTPCard({ data }: KeterlaksanaanTPCardProps) {
  const { totalTP, terlaksana, persentase } = data

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Keterlaksanaan Pembelajaran
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Progress tujuan pembelajaran semester ini
          </p>
        </div>
        <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
          <svg
            className="w-8 h-8 text-blue-600"
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
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Stats */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-gray-700 text-base leading-relaxed">
            Anda sudah mengajar{' '}
            <span className="font-bold text-blue-600 text-xl">{terlaksana}</span>{' '}
            dari{' '}
            <span className="font-bold text-gray-900 text-xl">{totalTP}</span>{' '}
            TP semester ini
          </p>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">{persentase}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${persentase}%` }}
            />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="pt-2">
          {persentase >= 80 ? (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 rounded-lg p-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Sangat baik! Anda konsisten dalam mengajar
              </span>
            </div>
          ) : persentase >= 50 ? (
            <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 rounded-lg p-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Cukup baik, tingkatkan konsistensi pengisian jurnal
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 rounded-lg p-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Perlu ditingkatkan, pastikan mengisi jurnal setiap mengajar
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
