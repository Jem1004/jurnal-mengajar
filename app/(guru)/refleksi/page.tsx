import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { RefleksiClient } from '@/components/guru/refleksi-client';

export default async function RefleksiPage() {
  const session = await auth();
  
  if (!session?.user?.guruId) {
    redirect('/login');
  }

  // Get statistics
  const stats = await prisma.jurnal.groupBy({
    by: ['statusKetercapaianTP'],
    where: {
      guruId: session.user.guruId,
    },
    _count: true,
  });

  const totalJurnal = await prisma.jurnal.count({
    where: { guruId: session.user.guruId },
  });

  const tercapai = stats.find(s => s.statusKetercapaianTP === 'TERCAPAI')?._count || 0;
  const sebagian = stats.find(s => s.statusKetercapaianTP === 'SEBAGIAN_TERCAPAI')?._count || 0;
  const tidakTercapai = stats.find(s => s.statusKetercapaianTP === 'TIDAK_TERCAPAI')?._count || 0;

  // Get recent jurnal with reflections
  const recentJurnal = await prisma.jurnal.findMany({
    where: {
      guruId: session.user.guruId,
      OR: [
        { catatanRefleksi: { not: null } },
        { hambatan: { not: null } },
        { solusi: { not: null } },
      ],
    },
    include: {
      jadwal: {
        include: {
          kelas: true,
          mataPelajaran: true,
        },
      },
    },
    orderBy: { tanggal: 'desc' },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Refleksi Pembelajaran</h1>
              <p className="mt-1 text-sm text-gray-600">
                Analisis dan refleksi dari proses pembelajaran Anda
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Total Jurnal</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{totalJurnal}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">TP Tercapai</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{tercapai}</div>
            <div className="mt-1 text-xs text-gray-500">
              {totalJurnal > 0 ? Math.round((tercapai / totalJurnal) * 100) : 0}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Sebagian Tercapai</div>
            <div className="mt-2 text-3xl font-bold text-yellow-600">{sebagian}</div>
            <div className="mt-1 text-xs text-gray-500">
              {totalJurnal > 0 ? Math.round((sebagian / totalJurnal) * 100) : 0}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-600">Tidak Tercapai</div>
            <div className="mt-2 text-3xl font-bold text-red-600">{tidakTercapai}</div>
            <div className="mt-1 text-xs text-gray-500">
              {totalJurnal > 0 ? Math.round((tidakTercapai / totalJurnal) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Recent Reflections */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Catatan Refleksi Terbaru</h2>
          </div>
          
          <RefleksiClient recentJurnal={recentJurnal} />
        </div>

        {/* Link to full history */}
        <div className="mt-6 text-center">
          <Link
            href="/riwayat-tp"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Lihat Semua Riwayat Tujuan Pembelajaran
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
