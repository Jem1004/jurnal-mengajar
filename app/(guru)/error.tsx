'use client';

/**
 * Guru Section Error Boundary
 * Catches and handles errors specific to guru features
 */

import { useEffect } from 'react';
import Button from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GuruError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Guru section error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50/30 via-white to-yellow-50/30 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-yellow-100 p-8 md:p-10">
          <div className="text-center mb-8">
            {/* Guru Error Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium inline-block mb-4">
              Guru Panel Error
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Kesalahan Data Jurnal
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Maaf, terjadi kesalahan saat memproses data jurnal mengajar. Sistem sedang berusaha memperbaiki masalah ini.
            </p>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm font-semibold text-yellow-800 mb-3">
                Error Details (Development Only):
              </p>
              <div className="bg-white rounded-lg p-4 border border-yellow-100">
                <p className="text-sm font-mono text-yellow-700 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-yellow-500 mt-3">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Coba Lagi
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Dashboard Guru
            </Button>
          </div>

          {/* Help Section for Teachers */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green-900 mb-3">Saran untuk Guru:</h3>
                <ul className="text-sm text-green-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Periksa koneksi internet Anda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Pastikan data jurnal sudah diisi dengan lengkap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Coba refresh halaman dan coba kembali</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    <span>Hubungi admin sekolah jika masalah berlanjut</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Error Code: <span className="font-mono">{error.digest || 'GURU-ERROR'}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Bantuan tersedia dari admin sekolah
          </p>
        </div>
      </div>
    </div>
  );
}
