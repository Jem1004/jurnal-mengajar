'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllJurnal } from '@/app/actions/admin-jurnal';
import JurnalDetailModal from '@/components/admin/jurnal-detail-modal';

export default function AdminJurnalPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    guruId: '',
    kelasId: '',
    mataPelajaranId: '',
    statusKetercapaianTP: '',
    startDate: '',
    endDate: '',
  });

  const [guruList, setGuruList] = useState<any[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  
  // Modal state
  const [selectedJurnalId, setSelectedJurnalId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    const result = await getAllJurnal(filters);
    if (result.success && result.data) {
      setData(result.data.jurnal);
      setGuruList(result.data.guruList || []);
      setKelasList(result.data.kelasList || []);
      setMapelList(result.data.mapelList || []);
    }
    setLoading(false);
  };

  const stats = {
    total: data.length,
    tercapai: data.filter((j) => j.statusKetercapaianTP === 'TERCAPAI').length,
    sebagian: data.filter((j) => j.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI').length,
    tidakTercapai: data.filter((j) => j.statusKetercapaianTP === 'TIDAK_TERCAPAI').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Monitor Jurnal Pembelajaran</h1>
        <p className="mt-1 text-sm text-gray-600">
          Lihat dan monitor semua jurnal yang telah diisi oleh guru
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs font-medium text-gray-600">Total Jurnal</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs font-medium text-gray-600">TP Tercapai</div>
          <div className="mt-1 text-2xl font-bold text-green-600">{stats.tercapai}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.tercapai / stats.total) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs font-medium text-gray-600">Sebagian Tercapai</div>
          <div className="mt-1 text-2xl font-bold text-yellow-600">{stats.sebagian}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.sebagian / stats.total) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-xs font-medium text-gray-600">Tidak Tercapai</div>
          <div className="mt-1 text-2xl font-bold text-red-600">{stats.tidakTercapai}</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.total > 0 ? Math.round((stats.tidakTercapai / stats.total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guru</label>
            <select
              value={filters.guruId}
              onChange={(e) => setFilters({ ...filters, guruId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Guru</option>
              {guruList.map((guru) => (
                <option key={guru.id} value={guru.id}>
                  {guru.user.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select
              value={filters.kelasId}
              onChange={(e) => setFilters({ ...filters, kelasId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((kelas) => (
                <option key={kelas.id} value={kelas.id}>
                  {kelas.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
            <select
              value={filters.mataPelajaranId}
              onChange={(e) => setFilters({ ...filters, mataPelajaranId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Mata Pelajaran</option>
              {mapelList.map((mapel) => (
                <option key={mapel.id} value={mapel.id}>
                  {mapel.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Ketercapaian</label>
            <select
              value={filters.statusKetercapaianTP}
              onChange={(e) => setFilters({ ...filters, statusKetercapaianTP: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Semua Status</option>
              <option value="TERCAPAI">Tercapai</option>
              <option value="SEBAGIAN_TERCAPAI">Sebagian Tercapai</option>
              <option value="TIDAK_TERCAPAI">Tidak Tercapai</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() =>
              setFilters({
                guruId: '',
                kelasId: '',
                mataPelajaranId: '',
                statusKetercapaianTP: '',
                startDate: '',
                endDate: '',
              })
            }
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset Filter
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
          </div>
        ) : data.length === 0 ? (
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guru
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mata Pelajaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tujuan Pembelajaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((jurnal) => (
                  <tr key={jurnal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(jurnal.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {jurnal.guru.user.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {jurnal.jadwal.kelas.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {jurnal.jadwal.mataPelajaran.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div className="line-clamp-2">{jurnal.tujuanPembelajaran}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                          ? 'Sebagian'
                          : 'Tidak Tercapai'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedJurnalId(jurnal.id);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        Menampilkan {data.length} jurnal
      </div>

      {/* Detail Modal */}
      <JurnalDetailModal
        jurnalId={selectedJurnalId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedJurnalId(null);
        }}
      />
    </div>
  );
}
