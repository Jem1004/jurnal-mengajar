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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h1>
          <p className="text-gray-600">
            Maaf, terjadi kesalahan saat memproses data administrasi. 
            Silakan coba lagi atau periksa log sistem untuk detail lebih lanjut.
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
            {error.stack && (
              <details className="mt-3">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-gray-700 overflow-auto max-h-40">
                  {error.stack}
                </pre>
              </details>
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
            onClick={() => window.location.href = '/admin/dashboard'}
            variant="outline"
            className="w-full"
          >
            Kembali ke Dashboard Admin
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 space-y-2">
            <p className="font-semibold">Tips untuk Admin:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Periksa koneksi database</li>
              <li>Pastikan data master sudah lengkap</li>
              <li>Cek log server untuk detail error</li>
              <li>Verifikasi permissions dan role access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
