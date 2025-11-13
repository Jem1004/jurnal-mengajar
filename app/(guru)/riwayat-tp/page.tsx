'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRiwayatTP } from '@/app/actions/jurnal';
import TPDetailModal from '@/components/guru/tp-detail-modal';

type FilterStatus = 'SEMUA' | 'TERCAPAI' | 'SEBAGIAN_TERCAPAI' | 'TIDAK_TERCAPAI';

export default function RiwayatTPPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('SEMUA');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [selectedJurnal, setSelectedJurnal] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await getRiwayatTP();
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  const filteredData = data.filter((jurnal) => {
    const matchesFilter = filter === 'SEMUA' || jurnal.statusKetercapaianTP === filter;
    const matchesSearch =
      searchTerm === '' ||
      jurnal.tujuanPembelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.jadwal.mataPelajaran.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jurnal.jadwal.kelas.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: data.length,
    tercapai: data.filter((j) => j.statusKetercapaianTP === 'TERCAPAI').length,
    sebagian: data.filter((j) => j.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI').length,
    tidakTercapai: data.filter((j) => j.statusKetercapaianTP === 'TIDAK_TERCAPAI').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Riwayat Tujuan Pembelajaran
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Lihat semua tujuan pembelajaran yang telah dilaksanakan
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kembali
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600">Total</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600">Tercapai</div>
            <div className="mt-1 text-2xl font-bold text-green-600">{stats.tercapai}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600">Sebagian</div>
            <div className="mt-1 text-2xl font-bold text-yellow-600">{stats.sebagian}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs font-medium text-gray-600">Tidak Tercapai</div>
            <div className="mt-1 text-2xl font-bold text-red-600">{stats.tidakTercapai}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Cari tujuan pembelajaran, mata pelajaran, atau kelas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('SEMUA')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  filter === 'SEMUA'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilter('TERCAPAI')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  filter === 'TERCAPAI'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tercapai
              </button>
              <button
                onClick={() => setFilter('SEBAGIAN_TERCAPAI')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  filter === 'SEBAGIAN_TERCAPAI'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sebagian
              </button>
              <button
                onClick={() => setFilter('TIDAK_TERCAPAI')}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  filter === 'TIDAK_TERCAPAI'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tidak Tercapai
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
            </div>
          ) : filteredData.length === 0 ? (
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
              <p className="mt-2 text-sm text-gray-600">Tidak ada data ditemukan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredData.map((jurnal) => (
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

                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Tujuan Pembelajaran:</span>
                        <p className="text-gray-600 mt-1">{jurnal.tujuanPembelajaran}</p>
                      </div>

                      {jurnal.catatanRefleksi && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-700">Refleksi:</span>
                          <p className="text-gray-600 mt-1">{jurnal.catatanRefleksi}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedJurnal(jurnal);
                        setIsModalOpen(true);
                      }}
                      className="ml-4 px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
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
                      Detail TP
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Menampilkan {filteredData.length} dari {data.length} jurnal
        </div>
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
    </div>
  );
}
