import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export async function RecentJurnalWidget() {
  // Get 5 most recent jurnal
  const recentJurnal = await prisma.jurnal.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      guru: {
        include: {
          user: true,
        },
      },
      jadwal: {
        include: {
          kelas: true,
          mataPelajaran: true,
        },
      },
    },
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Jurnal Terbaru</h2>
        <Link
          href="/admin/jurnal"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Lihat Semua →
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        {recentJurnal.length === 0 ? (
          <div className="px-6 py-8 text-center">
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
            <p className="mt-2 text-sm text-gray-600">Belum ada jurnal</p>
          </div>
        ) : (
          recentJurnal.map((jurnal) => (
            <div key={jurnal.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {jurnal.guru.user.nama}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      {jurnal.jadwal.mataPelajaran.nama}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-600">{jurnal.jadwal.kelas.nama}</span>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                    {jurnal.tujuanPembelajaran}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      {new Date(jurnal.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
