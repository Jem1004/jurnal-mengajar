import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in reverse order of dependencies)
  console.log('🧹 Cleaning existing data...')
  await prisma.tagSiswaRecord.deleteMany()
  await prisma.absensi.deleteMany()
  await prisma.jurnal.deleteMany()
  await prisma.jadwal.deleteMany()
  await prisma.siswa.deleteMany()
  await prisma.mataPelajaran.deleteMany()
  await prisma.kelas.deleteMany()
  await prisma.guru.deleteMany()
  await prisma.user.deleteMany()

  // Hash password for all users (password: "password123")
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Create Admin User
  console.log('👤 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      nama: 'Administrator',
      role: 'ADMIN',
      email: 'admin@sekolah.sch.id',
    },
  })
  console.log(`✅ Admin created: ${adminUser.username}`)

  // 2. Create 3 Guru Users
  console.log('👨‍🏫 Creating guru users...')
  const guruData = [
    {
      username: 'guru1',
      nama: 'Budi Santoso, S.Pd',
      nip: '198501012010011001',
      email: 'budi.santoso@sekolah.sch.id',
    },
    {
      username: 'guru2',
      nama: 'Siti Nurhaliza, M.Pd',
      nip: '198703152011012002',
      email: 'siti.nurhaliza@sekolah.sch.id',
    },
    {
      username: 'guru3',
      nama: 'Ahmad Dahlan, S.Si',
      nip: '199002202015011003',
      email: 'ahmad.dahlan@sekolah.sch.id',
    },
  ]

  const gurus = []
  for (const data of guruData) {
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        nama: data.nama,
        role: 'GURU',
        email: data.email,
      },
    })

    const guru = await prisma.guru.create({
      data: {
        userId: user.id,
        nip: data.nip,
      },
    })

    gurus.push(guru)
    console.log(`✅ Guru created: ${data.nama}`)
  }

  // 3. Create 3 Kelas
  console.log('🏫 Creating kelas...')
  const kelasData = [
    { nama: '10-A', tingkat: 10, jurusan: 'Umum' },
    { nama: '11-IPA-1', tingkat: 11, jurusan: 'IPA' },
    { nama: '12-IPS-1', tingkat: 12, jurusan: 'IPS' },
  ]

  const kelasList = []
  for (const data of kelasData) {
    const kelas = await prisma.kelas.create({
      data,
    })
    kelasList.push(kelas)
    console.log(`✅ Kelas created: ${kelas.nama}`)
  }

  // 4. Create 5 Mata Pelajaran
  console.log('📚 Creating mata pelajaran...')
  const mataPelajaranData = [
    { nama: 'Matematika', kode: 'MAT' },
    { nama: 'Bahasa Indonesia', kode: 'BIND' },
    { nama: 'Bahasa Inggris', kode: 'BING' },
    { nama: 'Fisika', kode: 'FIS' },
    { nama: 'Kimia', kode: 'KIM' },
  ]

  const mataPelajaranList = []
  for (const data of mataPelajaranData) {
    const mapel = await prisma.mataPelajaran.create({
      data,
    })
    mataPelajaranList.push(mapel)
    console.log(`✅ Mata Pelajaran created: ${mapel.nama}`)
  }

  // 5. Create 30 Siswa per Kelas (90 total)
  console.log('👨‍🎓 Creating siswa...')
  const namaSiswaLakiLaki = [
    'Ahmad', 'Budi', 'Candra', 'Dedi', 'Eko', 'Fajar', 'Gilang', 'Hadi', 'Irfan', 'Joko',
    'Kurniawan', 'Lukman', 'Maulana', 'Nanda', 'Oki', 'Putra', 'Qomar', 'Rizki', 'Sandi', 'Taufik',
  ]
  const namaSiswaPerempuan = [
    'Ayu', 'Bella', 'Citra', 'Dewi', 'Eka', 'Fitri', 'Gita', 'Hana', 'Indah', 'Jasmine',
  ]

  let siswaCounter = 0
  for (const kelas of kelasList) {
    for (let i = 0; i < 30; i++) {
      const isLakiLaki = i < 15
      const namaList = isLakiLaki ? namaSiswaLakiLaki : namaSiswaPerempuan
      const namaDepan = namaList[i % namaList.length]
      const namaBelakang = ['Pratama', 'Wijaya', 'Kusuma', 'Permana', 'Saputra', 'Wati', 'Sari'][i % 7]
      
      const nisn = `00${siswaCounter.toString().padStart(8, '0')}`
      
      await prisma.siswa.create({
        data: {
          nisn,
          nama: `${namaDepan} ${namaBelakang}`,
          kelasId: kelas.id,
          jenisKelamin: isLakiLaki ? 'Laki-laki' : 'Perempuan',
        },
      })
      siswaCounter++
    }
    console.log(`✅ Created 30 siswa for ${kelas.nama}`)
  }

  // 6. Create Sample Jadwal
  console.log('📅 Creating jadwal...')
  const tahunAjaran = '2024/2025'
  const semester = 2

  // Jadwal untuk Guru 1 (Budi Santoso) - Matematika
  const jadwalGuru1 = [
    {
      guruId: gurus[0].id,
      kelasId: kelasList[0].id, // 10-A
      mataPelajaranId: mataPelajaranList[0].id, // Matematika
      hari: 1, // Senin
      jamMulai: '07:30',
      jamSelesai: '09:00',
      semester,
      tahunAjaran,
    },
    {
      guruId: gurus[0].id,
      kelasId: kelasList[1].id, // 11-IPA-1
      mataPelajaranId: mataPelajaranList[0].id, // Matematika
      hari: 1, // Senin
      jamMulai: '09:15',
      jamSelesai: '10:45',
      semester,
      tahunAjaran,
    },
    {
      guruId: gurus[0].id,
      kelasId: kelasList[0].id, // 10-A
      mataPelajaranId: mataPelajaranList[0].id, // Matematika
      hari: 3, // Rabu
      jamMulai: '07:30',
      jamSelesai: '09:00',
      semester,
      tahunAjaran,
    },
  ]

  // Jadwal untuk Guru 2 (Siti Nurhaliza) - Bahasa Indonesia
  const jadwalGuru2 = [
    {
      guruId: gurus[1].id,
      kelasId: kelasList[0].id, // 10-A
      mataPelajaranId: mataPelajaranList[1].id, // Bahasa Indonesia
      hari: 2, // Selasa
      jamMulai: '07:30',
      jamSelesai: '09:00',
      semester,
      tahunAjaran,
    },
    {
      guruId: gurus[1].id,
      kelasId: kelasList[2].id, // 12-IPS-1
      mataPelajaranId: mataPelajaranList[1].id, // Bahasa Indonesia
      hari: 2, // Selasa
      jamMulai: '09:15',
      jamSelesai: '10:45',
      semester,
      tahunAjaran,
    },
    {
      guruId: gurus[1].id,
      kelasId: kelasList[1].id, // 11-IPA-1
      mataPelajaranId: mataPelajaranList[2].id, // Bahasa Inggris
      hari: 4, // Kamis
      jamMulai: '07:30',
      jamSelesai: '09:00',
      semester,
      tahunAjaran,
    },
  ]

  // Jadwal untuk Guru 3 (Ahmad Dahlan) - Fisika & Kimia
  const jadwalGuru3 = [
    {
      guruId: gurus[2].id,
      kelasId: kelasList[1].id, // 11-IPA-1
      mataPelajaranId: mataPelajaranList[3].id, // Fisika
      hari: 1, // Senin
      jamMulai: '13:00',
      jamSelesai: '14:30',
      semester,
      tahunAjaran,
    },
    {
      guruId: gurus[2].id,
      kelasId: kelasList[1].id, // 11-IPA-1
      mataPelajaranId: mataPelajaranList[4].id, // Kimia
      hari: 3, // Rabu
      jamMulai: '13:00',
      jamSelesai: '14:30',
      semester,
      tahunAjaran,
    },
  ]

  const allJadwal = [...jadwalGuru1, ...jadwalGuru2, ...jadwalGuru3]
  for (const jadwal of allJadwal) {
    await prisma.jadwal.create({
      data: jadwal,
    })
  }
  console.log(`✅ Created ${allJadwal.length} jadwal entries`)

  console.log('✨ Seeding completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`   - 1 Admin user (username: admin, password: password123)`)
  console.log(`   - 3 Guru users (username: guru1/guru2/guru3, password: password123)`)
  console.log(`   - 3 Kelas (10-A, 11-IPA-1, 12-IPS-1)`)
  console.log(`   - 5 Mata Pelajaran`)
  console.log(`   - 90 Siswa (30 per kelas)`)
  console.log(`   - ${allJadwal.length} Jadwal entries`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
