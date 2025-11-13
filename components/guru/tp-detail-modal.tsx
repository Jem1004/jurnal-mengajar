'use client';

import Modal from '@/components/ui/modal';

interface TPDetailModalProps {
  jurnal: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TPDetailModal({ jurnal, isOpen, onClose }: TPDetailModalProps) {
  if (!isOpen || !jurnal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Tujuan Pembelajaran">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 font-medium">Mata Pelajaran</p>
              <p className="text-sm font-semibold text-gray-900">
                {jurnal.jadwal.mataPelajaran.nama}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Kelas</p>
              <p className="text-sm font-semibold text-gray-900">{jurnal.jadwal.kelas.nama}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Tanggal</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(jurnal.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-medium">Status Ketercapaian</p>
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
          </div>
        </div>

        {/* Tujuan Pembelajaran */}
        <div className="border-l-4 border-emerald-500 pl-4 bg-emerald-50 p-4 rounded-r-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg
              className="w-4 h-4 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Tujuan Pembelajaran
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {jurnal.tujuanPembelajaran}
          </p>
        </div>

        {/* Kegiatan Pembelajaran */}
        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
          <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            Kegiatan Pembelajaran
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {jurnal.kegiatanPembelajaran}
          </p>
        </div>

        {/* Asesmen */}
        {jurnal.asesmen && (
          <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded-r-lg">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Asesmen/Penilaian
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {jurnal.asesmen}
            </p>
          </div>
        )}

        {/* Refleksi Section */}
        {(jurnal.catatanRefleksi || jurnal.hambatan || jurnal.solusi) && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide flex items-center gap-2">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              Refleksi Pembelajaran
            </h3>
            <div className="space-y-3">
              {jurnal.catatanRefleksi && (
                <div className="bg-white rounded-lg p-3 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">
                    Catatan Refleksi:
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {jurnal.catatanRefleksi}
                  </p>
                </div>
              )}
              {jurnal.hambatan && (
                <div className="bg-white rounded-lg p-3 border border-red-100">
                  <p className="text-xs font-semibold text-red-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Hambatan:
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{jurnal.hambatan}</p>
                </div>
              )}
              {jurnal.solusi && (
                <div className="bg-white rounded-lg p-3 border border-green-100">
                  <p className="text-xs font-semibold text-green-700 mb-1 uppercase tracking-wide flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Solusi:
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{jurnal.solusi}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Catatan Khusus */}
        {jurnal.catatanKhusus && (
          <div className="border-l-4 border-gray-500 pl-4 bg-gray-50 p-4 rounded-r-lg">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Catatan Khusus
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {jurnal.catatanKhusus}
            </p>
          </div>
        )}

        {/* Link Bukti */}
        {jurnal.linkBukti && (
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              Link Bukti Pembelajaran
            </h3>
            <a
              href={jurnal.linkBukti}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
            >
              {jurnal.linkBukti}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        )}

        {/* Summary Stats */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-600 font-medium mb-1">Dibuat:</p>
              <p className="text-gray-900">
                {new Date(jurnal.createdAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-medium mb-1">Terakhir Diupdate:</p>
              <p className="text-gray-900">
                {new Date(jurnal.updatedAt).toLocaleString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
