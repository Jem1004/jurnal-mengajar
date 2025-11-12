'use client';

/**
 * Global Error Boundary
 * Catches and handles errors across the entire application
 */

import { useEffect } from 'react';
import Button from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Global error:', error);

    // In production, you could send this to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/30 via-white to-green-50/30 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <svg
                className="w-12 h-12 text-red-600"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Terjadi Kesalahan
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
              Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang bekerja untuk memperbaikinya.
            </p>
          </div>

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl text-left">
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
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={reset}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Coba Lagi
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50 font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              Kembali ke Beranda
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p className="font-medium text-gray-700 mb-2">Masih mengalami kendala?</p>
              <p>Silakan hubungi tim IT sekolah atau refresh halaman ini.</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Error Code: <span className="font-mono">{error.digest || 'UNKNOWN'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
