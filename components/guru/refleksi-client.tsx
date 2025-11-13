'use client';

import { useState } from 'react';
import Link from 'next/link';
import TPDetailModal from './tp-detail-modal';

interface RefleksiClientProps {
  recentJurnal: any[];
}

export function RefleksiClient({ recentJurnal }: RefleksiClientProps) {
  const [selectedJurnal, setSelectedJurnal] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="divide-y divide-gray-200">
        {recentJurnal.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">Belum ada catatan refleksi</p>
            <p className="mt-1 text-xs text-gray-500">
              Mulai tambahkan refleksi pada jurnal Anda
            </p>
          </div>
        ) : (
          recentJurnal.map((jurnal) => (
            <div key={jurnal.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {jurnal.jadwal.mataPelajaran.nama}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{jurnal.jadwal.kelas.nama}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(jurnal.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        jurnal.statusKetercapaianTP === 'TERCAPAI'
                          ? 'bg-green-100 text-green-800'
                          : jurnal.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {jurnal.statusKetercapaianTP === 'TERCAPAI'
                        ? 'Tercapai'
                        : jurnal.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI'
                        ? 'Sebagian Tercapai'
                        : 'Tidak Tercapai'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Tujuan Pembelajaran:</span>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {jurnal.tujuanPembelajaran}
                      </p>
                    </div>

                    {jurnal.catatanRefleksi && (
                      <div>
                        <span className="font-medium text-gray-700">Refleksi:</span>
                        <p className="text-gray-600 mt-1">{jurnal.catatanRefleksi}</p>
                      </div>
                    )}

                    {jurnal.hambatan && (
                      <div>
                        <span className="font-medium text-gray-700">Hambatan:</span>
                        <p className="text-gray-600 mt-1">{jurnal.hambatan}</p>
                      </div>
                    )}

                    {jurnal.solusi && (
                      <div>
                        <span className="font-medium text-gray-700">Solusi:</span>
                        <p className="text-gray-600 mt-1">{jurnal.solusi}</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedJurnal(jurnal);
                    setIsModalOpen(true);
                  }}
                  className="ml-4 px-3 py-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors duration-200 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <TPDetailModal
        jurnal={selectedJurnal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJurnal(null);
        }}
      />
    </>
  );
}
