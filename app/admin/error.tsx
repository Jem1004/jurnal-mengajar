'use client';

/**
 * Admin Section Error Boundary
 * Catches and handles errors specific to admin features
 */

import { useEffect } from 'react';
import Button from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Admin section error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/30 via-white to-red-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-red-100 p-8 md:p-10">
          <div className="text-center mb-8">
            {/* Admin Error Icon */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-medium inline-block mb-4">
              Admin Panel Error
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Kesalahan Sistem Administrasi
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Terjadi kesalahan saat memproses data administrasi. Sistem kami sedang menganalisis masalah ini.
            </p>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-semibold text-red-800 mb-3">
                Error Details (Development Only):
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-100">
                <p className="text-sm font-mono text-red-700 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-red-500 mt-3">
                    Error ID: {error.digest}
                  </p>
                )}
                {error.stack && (
                  <details className="mt-4">
                    <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800 font-medium">
                      📋 Stack Trace
                    </summary>
                    <pre className="mt-3 text-xs text-gray-700 bg-gray-50 p-3 rounded border overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </details>
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
              onClick={() => window.location.href = '/admin/dashboard'}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Dashboard Admin
            </Button>
          </div>

          {/* Admin Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-3">Tips Pemecahan Masalah:</h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Periksa koneksi database server</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Verifikasi data master sudah lengkap dan valid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Cek log server untuk detail error lengkap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Pastikan permissions dan role access sudah benar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Error Code: <span className="font-mono">{error.digest || 'ADMIN-ERROR'}</span>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Jika masalah berlanjut, hubungi tim IT support
          </p>
        </div>
      </div>
    </div>
  );
}
