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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600">
            Maaf, terjadi kesalahan saat memproses data jurnal mengajar. 
            Silakan coba lagi atau hubungi admin jika masalah berlanjut.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-100 rounded">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Error Details (Development Only):
            </p>
            <p className="text-sm font-mono text-gray-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full"
          >
            Coba Lagi
          </Button>
          <Button
            onClick={() => window.location.href = '/dashboard'}
            variant="outline"
            className="w-full"
          >
            Kembali ke Dashboard
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Jika masalah terus berlanjut, silakan hubungi administrator sekolah
          </p>
        </div>
      </div>
    </div>
  );
}
