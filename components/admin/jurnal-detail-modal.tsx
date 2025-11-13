'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/modal';
import { getJurnalDetail } from '@/app/actions/admin-jurnal';

interface JurnalDetailModalProps {
  jurnalId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JurnalDetailModal({ jurnalId, isOpen, onClose }: JurnalDetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jurnalId && isOpen) {
      fetchDetail();
    }
  }, [jurnalId, isOpen]);

  const fetchDetail = async () => {
    if (!jurnalId) return;

    setLoading(true);
    const result = await getJurnalDetail(jurnalId);
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Jurnal Pembelajaran">
      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600">Memuat data...</p>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">Guru</p>
                <p className="text-sm font-semibold text-gray-900">{data.guru.user.nama}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Tanggal</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(data.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Kelas</p>
                <p className="text-sm font-semibold text-gray-900">{data.jadwal.kelas.nama}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Mata Pelajaran</p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.jadwal.mataPelajaran.nama}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Jam</p>
                <p className="text-sm font-semibold text-gray-900">
                  {data.jadwal.jamMulai} - {data.jadwal.jamSelesai}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">Status Ketercapaian TP</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.statusKetercapaianTP === 'TERCAPAI'
                      ? 'bg-green-100 text-green-800'
                      : data.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {data.statusKetercapaianTP === 'TERCAPAI'
                    ? 'Tercapai'
                    : data.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI'
                    ? 'Sebagian Tercapai'
                    : 'Tidak Tercapai'}
                </span>
              </div>
            </div>
          </div>

          {/* Detail Pembelajaran */}
          <div className="space-y-4">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Tujuan Pembelajaran
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {data.tujuanPembelajaran}
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                Kegiatan Pembelajaran
              </h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {data.kegiatanPembelajaran}
              </p>
            </div>

            {data.asesmen && (
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Asesmen/Penilaian
                </h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.asesmen}</p>
              </div>
            )}
          </div>

          {/* Refleksi */}
          {(data.catatanRefleksi || data.hambatan || data.solusi) && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Refleksi Pembelajaran
              </h3>
              <div className="space-y-3">
                {data.catatanRefleksi && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Catatan Refleksi:</p>
                    <p className="text-sm text-gray-700">{data.catatanRefleksi}</p>
                  </div>
                )}
                {data.hambatan && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Hambatan:</p>
                    <p className="text-sm text-gray-700">{data.hambatan}</p>
                  </div>
                )}
                {data.solusi && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Solusi:</p>
                    <p className="text-sm text-gray-700">{data.solusi}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Absensi */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
              Absensi Siswa
            </h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-green-50 rounded-lg p-2 text-center border border-green-200">
                <p className="text-xs text-gray-600">Hadir</p>
                <p className="text-lg font-bold text-green-600">
                  {data.absensi.filter((a: any) => a.status === 'HADIR').length}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2 text-center border border-yellow-200">
                <p className="text-xs text-gray-600">Sakit</p>
                <p className="text-lg font-bold text-yellow-600">
                  {data.absensi.filter((a: any) => a.status === 'SAKIT').length}
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 text-center border border-orange-200">
                <p className="text-xs text-gray-600">Izin</p>
                <p className="text-lg font-bold text-orange-600">
                  {data.absensi.filter((a: any) => a.status === 'IZIN').length}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center border border-red-200">
                <p className="text-xs text-gray-600">Alpa</p>
                <p className="text-lg font-bold text-red-600">
                  {data.absensi.filter((a: any) => a.status === 'ALPA').length}
                </p>
              </div>
            </div>

            {/* Siswa tidak hadir */}
            {data.absensi.filter((a: any) => a.status !== 'HADIR').length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">Siswa Tidak Hadir:</p>
                <div className="space-y-1">
                  {data.absensi
                    .filter((a: any) => a.status !== 'HADIR')
                    .map((a: any) => (
                      <div key={a.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{a.siswa.nama}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            a.status === 'SAKIT'
                              ? 'bg-yellow-100 text-yellow-800'
                              : a.status === 'IZIN'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {a.status}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Tag Siswa */}
          {data.tagSiswa && data.tagSiswa.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Tindak Lanjut Siswa
              </h3>
              <div className="space-y-2">
                {data.tagSiswa.map((tag: any) => (
                  <div
                    key={tag.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{tag.siswa.nama}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          tag.tag === 'PERLU_REMEDIAL'
                            ? 'bg-blue-100 text-blue-800'
                            : tag.tag === 'PERLU_PENGAYAAN'
                            ? 'bg-green-100 text-green-800'
                            : tag.tag === 'MASALAH_PERILAKU'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {tag.tag === 'PERLU_REMEDIAL'
                          ? 'Perlu Remedial'
                          : tag.tag === 'PERLU_PENGAYAAN'
                          ? 'Perlu Pengayaan'
                          : tag.tag === 'MASALAH_PERILAKU'
                          ? 'Masalah Perilaku'
                          : 'Rujuk BK'}
                      </span>
                    </div>
                    {tag.keterangan && (
                      <p className="text-sm text-gray-600">{tag.keterangan}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Catatan Khusus & Link Bukti */}
          {(data.catatanKhusus || data.linkBukti) && (
            <div className="space-y-3">
              {data.catatanKhusus && (
                <div className="border-l-4 border-gray-500 pl-4">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Catatan Khusus
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {data.catatanKhusus}
                  </p>
                </div>
              )}
              {data.linkBukti && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Link Bukti Pembelajaran
                  </h3>
                  <a
                    href={data.linkBukti}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {data.linkBukti}
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Dibuat:</span>{' '}
                {new Date(data.createdAt).toLocaleString('id-ID')}
              </div>
              <div>
                <span className="font-medium">Diupdate:</span>{' '}
                {new Date(data.updatedAt).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-600">Data tidak ditemukan</p>
        </div>
      )}
    </Modal>
  );
}