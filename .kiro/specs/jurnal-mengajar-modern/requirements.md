# Requirements Document

## Introduction

Aplikasi Jurnal Mengajar Modern adalah sistem digital standalone yang menggantikan jurnal mengajar fisik. Aplikasi ini dirancang untuk memenuhi dua kebutuhan utama: (1) Administrasi - mencatat aktivitas pengajaran dan absensi siswa secara akurat untuk pelaporan, dan (2) Pedagogis - menjadi alat refleksi guru, dokumentasi bukti pembelajaran, dan penyedia data untuk intervensi siswa. Sistem ini dibangun menggunakan Next.js (frontend dan backend), Tailwind CSS, NextAuth untuk autentikasi, dan PostgreSQL dengan Prisma ORM.

## Glossary

- **Sistem Jurnal**: Aplikasi Jurnal Mengajar Modern
- **Guru**: Pengguna yang mengisi jurnal mengajar, mencatat absensi, dan melihat analitik personal
- **Admin**: Kepala Sekolah atau staf kurikulum yang mengelola data master dan melihat laporan agregat
- **Data Master**: Kumpulan data referensi (guru, kelas, mata pelajaran, siswa, jadwal) yang harus di-setup sebelum sistem dapat digunakan
- **Jurnal Mengajar**: Catatan digital yang berisi informasi sesi pembelajaran, detail pembelajaran, absensi siswa, dan catatan tindak lanjut
- **Sesi Pembelajaran**: Satu pertemuan mengajar yang terdiri dari kombinasi waktu, kelas, dan mata pelajaran
- **Rombongan Belajar**: Kelompok siswa dalam satu kelas (contoh: 10-A, 10-B)
- **Tujuan Pembelajaran (TP)**: Capaian pembelajaran yang ingin dicapai dalam satu sesi
- **Dashboard Guru**: Halaman utama guru yang menampilkan jadwal mengajar hari ini
- **Smart Checklist**: Mekanisme absensi cepat dimana semua siswa default hadir, guru hanya menandai yang tidak hadir
- **Tag Siswa**: Label yang diberikan guru pada siswa untuk tindak lanjut (Remedial, Pengayaan, Masalah Perilaku, Rujuk BK)
- **Bukti Pembelajaran**: Foto atau dokumen visual yang menunjukkan aktivitas pembelajaran
- **Analitik Personal**: Data analisis yang hanya menampilkan informasi dari jurnal guru yang bersangkutan

## Requirements

### Requirement 1: Autentikasi Pengguna

**User Story:** Sebagai Guru atau Admin, saya ingin login ke sistem dengan kredensial saya, sehingga saya dapat mengakses fitur sesuai peran saya.

#### Acceptance Criteria

1. WHEN pengguna mengakses aplikasi, THE Sistem Jurnal SHALL menampilkan halaman login dengan field username dan password
2. WHEN pengguna memasukkan kredensial valid dan menekan tombol login, THE Sistem Jurnal SHALL memverifikasi kredensial terhadap database dan memberikan akses sesuai peran pengguna
3. IF kredensial tidak valid, THEN THE Sistem Jurnal SHALL menampilkan pesan error dan mencegah akses ke sistem
4. WHEN pengguna berhasil login sebagai Guru, THE Sistem Jurnal SHALL mengarahkan pengguna ke Dashboard Guru
5. WHEN pengguna berhasil login sebagai Admin, THE Sistem Jurnal SHALL mengarahkan pengguna ke Dashboard Admin

### Requirement 2: Manajemen Data Master oleh Admin

**User Story:** Sebagai Admin, saya ingin mengelola semua data master (akun guru, kelas, mata pelajaran, siswa, jadwal), sehingga sistem memiliki data referensi yang diperlukan untuk operasional jurnal mengajar.

#### Acceptance Criteria

1. WHEN Admin mengakses menu Data Master, THE Sistem Jurnal SHALL menampilkan daftar kategori data master yang dapat dikelola
2. WHEN Admin memilih kategori Akun Guru, THE Sistem Jurnal SHALL menampilkan daftar guru dengan opsi tambah, ubah, dan hapus data guru
3. WHEN Admin memilih kategori Rombongan Belajar, THE Sistem Jurnal SHALL menampilkan daftar kelas dengan opsi tambah, ubah, dan hapus data kelas
4. WHEN Admin memilih kategori Mata Pelajaran, THE Sistem Jurnal SHALL menampilkan daftar mata pelajaran dengan opsi tambah, ubah, dan hapus data mata pelajaran
5. WHEN Admin memilih kategori Data Siswa, THE Sistem Jurnal SHALL menampilkan daftar siswa per kelas dengan opsi tambah, ubah, dan hapus data siswa
6. WHEN Admin memilih kategori Jadwal Mengajar, THE Sistem Jurnal SHALL menampilkan daftar jadwal dengan kombinasi guru, hari, jam, mata pelajaran, dan kelas dengan opsi tambah, ubah, dan hapus jadwal

### Requirement 3: Dashboard Guru Menampilkan Jadwal Hari Ini

**User Story:** Sebagai Guru, saya ingin melihat jadwal mengajar saya hari ini di dashboard, sehingga saya dapat dengan cepat mengetahui sesi pembelajaran yang perlu saya isi jurnalnya.

#### Acceptance Criteria

1. WHEN Guru login dan mengakses Dashboard Guru, THE Sistem Jurnal SHALL menampilkan daftar jadwal mengajar untuk hari ini berdasarkan Data Master Jadwal
2. WHILE menampilkan jadwal, THE Sistem Jurnal SHALL menampilkan informasi waktu, kelas, dan mata pelajaran untuk setiap sesi pembelajaran
3. WHEN jurnal untuk sesi pembelajaran belum diisi, THE Sistem Jurnal SHALL menampilkan tombol "Isi Jurnal" pada sesi tersebut
4. WHEN jurnal untuk sesi pembelajaran sudah diisi, THE Sistem Jurnal SHALL menampilkan indikator "Terisi" dengan tanda centang pada sesi tersebut
5. IF tidak ada jadwal mengajar untuk hari ini, THEN THE Sistem Jurnal SHALL menampilkan pesan informasi bahwa tidak ada jadwal hari ini

### Requirement 4: Pengisian Formulir Jurnal dengan Info Sesi Otomatis

**User Story:** Sebagai Guru, saya ingin formulir jurnal menampilkan informasi sesi pembelajaran secara otomatis, sehingga saya tidak perlu mengetik ulang data yang sudah ada di jadwal.

#### Acceptance Criteria

1. WHEN Guru menekan tombol "Isi Jurnal" pada sesi pembelajaran, THE Sistem Jurnal SHALL menampilkan formulir jurnal dalam satu halaman
2. WHILE menampilkan formulir, THE Sistem Jurnal SHALL mengisi otomatis field waktu/jam dari jadwal yang dipilih
3. WHILE menampilkan formulir, THE Sistem Jurnal SHALL mengisi otomatis field kelas dari jadwal yang dipilih
4. WHILE menampilkan formulir, THE Sistem Jurnal SHALL mengisi otomatis field mata pelajaran dari jadwal yang dipilih
5. THE Sistem Jurnal SHALL mencegah Guru mengubah field yang telah diisi otomatis (waktu, kelas, mata pelajaran)

### Requirement 5: Input Detail Pembelajaran

**User Story:** Sebagai Guru, saya ingin mengisi detail pembelajaran (tujuan, kegiatan, asesmen) dalam formulir jurnal, sehingga saya dapat mendokumentasikan apa yang telah saya ajarkan.

#### Acceptance Criteria

1. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan field text area untuk Tujuan Pembelajaran
2. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan field text area untuk Kegiatan Pembelajaran
3. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan field text area opsional untuk Asesmen/Penilaian
4. WHEN Guru menyimpan jurnal tanpa mengisi Tujuan Pembelajaran, THE Sistem Jurnal SHALL menampilkan pesan validasi bahwa field wajib diisi
5. WHEN Guru menyimpan jurnal tanpa mengisi Kegiatan Pembelajaran, THE Sistem Jurnal SHALL menampilkan pesan validasi bahwa field wajib diisi

### Requirement 6: Absensi Siswa dengan Smart Checklist

**User Story:** Sebagai Guru, saya ingin mencatat absensi siswa dengan cepat menggunakan smart checklist, sehingga saya tidak perlu menandai setiap siswa yang hadir satu per satu.

#### Acceptance Criteria

1. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menampilkan daftar lengkap nama siswa dari kelas yang sesuai berdasarkan Data Master Siswa
2. WHILE menampilkan daftar siswa, THE Sistem Jurnal SHALL mengatur status default semua siswa sebagai "Hadir"
3. WHEN Guru mengetuk nama siswa yang tidak hadir, THE Sistem Jurnal SHALL menampilkan opsi status "Sakit", "Izin", atau "Alpa"
4. WHEN Guru memilih status untuk siswa, THE Sistem Jurnal SHALL mengubah status siswa tersebut dari "Hadir" ke status yang dipilih
5. WHILE Guru mengisi absensi, THE Sistem Jurnal SHALL menghitung dan menampilkan rekap otomatis jumlah siswa Hadir, Sakit, Izin, dan Alpa

### Requirement 7: Lampiran Bukti Pembelajaran

**User Story:** Sebagai Guru, saya ingin melampirkan link dokumentasi pembelajaran (seperti Google Drive), sehingga saya dapat mendokumentasikan bukti aktivitas kelas yang telah saya upload di platform penyimpanan cloud.

#### Acceptance Criteria

1. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan field input text opsional untuk "Link Bukti Pembelajaran" pada bagian Catatan & Tindak Lanjut
2. WHEN Guru memasukkan URL, THE Sistem Jurnal SHALL memvalidasi format URL yang diinput
3. IF URL tidak valid, THEN THE Sistem Jurnal SHALL menampilkan pesan error validasi format URL
4. THE Sistem Jurnal SHALL memperbolehkan Guru menyimpan jurnal tanpa mengisi Link Bukti Pembelajaran
5. WHEN Guru menyimpan jurnal dengan Link Bukti Pembelajaran, THE Sistem Jurnal SHALL menyimpan URL tersebut ke database terkait dengan jurnal yang bersangkutan

### Requirement 8: Penandaan Siswa untuk Tindak Lanjut

**User Story:** Sebagai Guru, saya ingin menandai siswa tertentu dengan tag tindak lanjut, sehingga saya dapat mengidentifikasi siswa yang memerlukan perhatian khusus.

#### Acceptance Criteria

1. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan tombol "Tandai Siswa" pada bagian Catatan & Tindak Lanjut
2. WHEN Guru menekan tombol "Tandai Siswa", THE Sistem Jurnal SHALL menampilkan daftar siswa dari kelas yang sesuai
3. WHEN Guru memilih siswa dari daftar, THE Sistem Jurnal SHALL menampilkan opsi tag "Perlu Remedial", "Perlu Pengayaan", "Masalah Perilaku", dan "Rujuk ke BK"
4. WHEN Guru memilih tag untuk siswa, THE Sistem Jurnal SHALL menyimpan tag tersebut terkait dengan siswa dan jurnal yang bersangkutan
5. WHILE Guru menandai siswa, THE Sistem Jurnal SHALL memperbolehkan Guru menandai lebih dari satu siswa dengan tag yang berbeda dalam satu jurnal

### Requirement 9: Penyimpanan Jurnal Mengajar

**User Story:** Sebagai Guru, saya ingin menyimpan jurnal yang telah saya isi, sehingga data pembelajaran tercatat dalam sistem dan dapat digunakan untuk pelaporan.

#### Acceptance Criteria

1. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan tombol "Simpan" di bagian bawah formulir
2. WHEN Guru menekan tombol "Simpan" dengan semua field wajib terisi, THE Sistem Jurnal SHALL menyimpan data jurnal ke database
3. WHEN jurnal berhasil disimpan, THE Sistem Jurnal SHALL menampilkan notifikasi sukses dan mengarahkan Guru kembali ke Dashboard Guru
4. WHEN jurnal berhasil disimpan, THE Sistem Jurnal SHALL mengubah status sesi pembelajaran di dashboard dari "Isi Jurnal" menjadi "Terisi"
5. IF terjadi error saat menyimpan, THEN THE Sistem Jurnal SHALL menampilkan pesan error dan mempertahankan data yang telah diisi Guru

### Requirement 10: Analitik Keterlaksanaan Pembelajaran

**User Story:** Sebagai Guru, saya ingin melihat analitik keterlaksanaan tujuan pembelajaran saya, sehingga saya dapat mengetahui progress pengajaran saya dalam satu semester.

#### Acceptance Criteria

1. WHEN Guru mengakses menu Analitik Personal, THE Sistem Jurnal SHALL menampilkan halaman analitik yang hanya berisi data jurnal milik Guru tersebut
2. WHILE menampilkan analitik, THE Sistem Jurnal SHALL menghitung jumlah tujuan pembelajaran yang telah diajarkan dari total tujuan pembelajaran dalam semester
3. THE Sistem Jurnal SHALL menampilkan persentase keterlaksanaan tujuan pembelajaran dengan format "Anda sudah mengajar X dari Y TP semester ini"
4. THE Sistem Jurnal SHALL menampilkan visualisasi grafik atau chart untuk keterlaksanaan pembelajaran
5. THE Sistem Jurnal SHALL menghitung data analitik berdasarkan jurnal yang telah disimpan oleh Guru

### Requirement 11: Analitik Absensi Siswa Personal

**User Story:** Sebagai Guru, saya ingin melihat analitik absensi siswa di mata pelajaran saya, sehingga saya dapat mengidentifikasi siswa yang sering tidak hadir.

#### Acceptance Criteria

1. WHEN Guru mengakses halaman Analitik Personal, THE Sistem Jurnal SHALL menampilkan bagian analitik absensi siswa
2. THE Sistem Jurnal SHALL menghitung frekuensi ketidakhadiran setiap siswa dalam 30 hari terakhir berdasarkan jurnal Guru tersebut
3. THE Sistem Jurnal SHALL menampilkan daftar siswa yang paling sering tidak hadir dengan jumlah ketidakhadiran
4. THE Sistem Jurnal SHALL menampilkan informasi dengan format "Dalam 30 hari terakhir di pelajaran Anda, siswa [Nama] paling sering absen (Xx)"
5. THE Sistem Jurnal SHALL memisahkan analitik berdasarkan jenis ketidakhadiran (Sakit, Izin, Alpa)

### Requirement 12: Analitik Tindak Lanjut Siswa

**User Story:** Sebagai Guru, saya ingin melihat analitik siswa yang telah saya tandai untuk tindak lanjut, sehingga saya dapat memastikan tidak ada siswa yang terlewat untuk ditindaklanjuti.

#### Acceptance Criteria

1. WHEN Guru mengakses halaman Analitik Personal, THE Sistem Jurnal SHALL menampilkan bagian analitik tindak lanjut siswa
2. THE Sistem Jurnal SHALL menghitung jumlah siswa yang ditandai dengan setiap jenis tag (Remedial, Pengayaan, Masalah Perilaku, Rujuk BK)
3. THE Sistem Jurnal SHALL menampilkan daftar siswa yang ditandai namun belum ditindaklanjuti
4. THE Sistem Jurnal SHALL menampilkan informasi dengan format "Anda memiliki X siswa yang ditandai [Jenis Tag] yang belum ditindaklanjuti"
5. WHEN Guru menekan nama siswa dalam daftar, THE Sistem Jurnal SHALL menampilkan detail jurnal dimana siswa tersebut ditandai

### Requirement 13: Dashboard Admin untuk Monitoring Keterisian Jurnal

**User Story:** Sebagai Admin, saya ingin melihat laporan keterisian jurnal semua guru, sehingga saya dapat memonitor kedisiplinan pengisian jurnal di sekolah.

#### Acceptance Criteria

1. WHEN Admin mengakses Dashboard Admin, THE Sistem Jurnal SHALL menampilkan menu Laporan Keterisian Jurnal
2. WHEN Admin membuka Laporan Keterisian Jurnal, THE Sistem Jurnal SHALL menampilkan daftar semua guru dengan persentase keterisian jurnal
3. THE Sistem Jurnal SHALL menghitung persentase keterisian berdasarkan jumlah jurnal yang diisi dibanding total jadwal mengajar dalam periode tertentu
4. THE Sistem Jurnal SHALL menyediakan filter periode waktu (hari ini, minggu ini, bulan ini, semester ini)
5. THE Sistem Jurnal SHALL menampilkan indikator visual (warna) untuk membedakan guru yang rutin mengisi (hijau) dan tidak rutin (merah)

### Requirement 14: Laporan Agregat Absensi Sekolah

**User Story:** Sebagai Admin, saya ingin melihat laporan agregat absensi seluruh siswa, sehingga saya dapat memonitor tingkat kehadiran siswa di sekolah.

#### Acceptance Criteria

1. WHEN Admin mengakses Dashboard Admin, THE Sistem Jurnal SHALL menampilkan menu Laporan Agregat Absensi
2. WHEN Admin membuka Laporan Agregat Absensi, THE Sistem Jurnal SHALL menampilkan total absensi siswa per hari atau per minggu
3. THE Sistem Jurnal SHALL menghitung jumlah total siswa Hadir, Sakit, Izin, dan Alpa dari semua jurnal yang diisi
4. THE Sistem Jurnal SHALL menyediakan filter berdasarkan kelas, periode waktu, dan jenis ketidakhadiran
5. THE Sistem Jurnal SHALL menampilkan visualisasi grafik trend absensi dalam periode yang dipilih

### Requirement 15: Catatan Khusus dalam Jurnal

**User Story:** Sebagai Guru, saya ingin menambahkan catatan khusus dalam jurnal, sehingga saya dapat mendokumentasikan hambatan, keberhasilan, atau hal penting lainnya dalam pembelajaran.

#### Acceptance Criteria

1. WHEN formulir jurnal ditampilkan, THE Sistem Jurnal SHALL menyediakan field text area untuk Catatan Khusus pada bagian Catatan & Tindak Lanjut
2. THE Sistem Jurnal SHALL memperbolehkan field Catatan Khusus bersifat opsional
3. WHEN Guru mengisi Catatan Khusus, THE Sistem Jurnal SHALL menyimpan catatan tersebut bersama data jurnal lainnya
4. WHEN Guru melihat jurnal yang telah disimpan, THE Sistem Jurnal SHALL menampilkan Catatan Khusus jika ada
5. THE Sistem Jurnal SHALL memperbolehkan Guru mengisi Catatan Khusus dengan teks hingga 1000 karakter
