'use client'

interface AbsensiAggregate {
  tanggal: Date
  hadir: number
  sakit: number
  izin: number
  alpa: number
  total: number
}

interface AbsensiChartProps {
  data: AbsensiAggregate[]
}

export function AbsensiChart({ data }: AbsensiChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Tidak ada data untuk ditampilkan
      </div>
    )
  }

  // Find max value for scaling
  const maxValue = Math.max(...data.map(d => d.total))
  const chartHeight = 200

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative" style={{ height: chartHeight + 40 }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-10 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="absolute left-14 right-0 top-0 bottom-10 flex items-end gap-1">
          {data.map((item, index) => {
            const hadirHeight = maxValue > 0 ? (item.hadir / maxValue) * chartHeight : 0
            const sakitHeight = maxValue > 0 ? (item.sakit / maxValue) * chartHeight : 0
            const izinHeight = maxValue > 0 ? (item.izin / maxValue) * chartHeight : 0
            const alpaHeight = maxValue > 0 ? (item.alpa / maxValue) * chartHeight : 0

            return (
              <div
                key={index}
                className="flex-1 flex flex-col justify-end gap-0.5 group relative"
                style={{ height: chartHeight }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                  <div className="bg-gray-900 text-white text-xs rounded py-2 px-3 whitespace-nowrap">
                    <p className="font-semibold mb-1">
                      {new Date(item.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-green-300">Hadir: {item.hadir}</p>
                    <p className="text-yellow-300">Sakit: {item.sakit}</p>
                    <p className="text-blue-300">Izin: {item.izin}</p>
                    <p className="text-red-300">Alpa: {item.alpa}</p>
                    <p className="font-semibold mt-1">Total: {item.total}</p>
                  </div>
                </div>

                {/* Stacked bars */}
                {alpaHeight > 0 && (
                  <div
                    className="w-full bg-red-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: alpaHeight }}
                  />
                )}
                {izinHeight > 0 && (
                  <div
                    className="w-full bg-blue-500 transition-all hover:opacity-80"
                    style={{ height: izinHeight }}
                  />
                )}
                {sakitHeight > 0 && (
                  <div
                    className="w-full bg-yellow-500 transition-all hover:opacity-80"
                    style={{ height: sakitHeight }}
                  />
                )}
                {hadirHeight > 0 && (
                  <div
                    className="w-full bg-green-500 transition-all hover:opacity-80"
                    style={{ height: hadirHeight }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* X-axis labels */}
        <div className="absolute left-14 right-0 bottom-0 flex gap-1">
          {data.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <span className="text-xs text-gray-500">
                {new Date(item.tanggal).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-gray-700">Hadir</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-gray-700">Sakit</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-gray-700">Izin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-gray-700">Alpa</span>
        </div>
      </div>
    </div>
  )
}
