# Fitur dasar manajemen Laras

## Tersedia untuk akun Supabase dan demo

- Proyek: tambah, buka detail melalui kartu proyek, edit nama/deskripsi/metode/budget rencana, hapus dengan konfirmasi.
- Tugas: tambah, detail/edit nama/deskripsi/proyek/penanggung jawab/status/prioritas/deadline, centang selesai, hapus dengan konfirmasi.
- Semua tugas dan Tugas saya, pencarian judul/penanggung jawab/deskripsi, filter proyek/status/prioritas, urut deadline/prioritas/nama.
- Jadwal: daftar seluruh pekerjaan berurutan tanggal dan akses detail.
- Catatan proyek: CRUD milestone, sprint, tahap, risiko, blocker, change request, catatan anggota, dan catatan biaya.
- Laporan: ringkasan proyek/tugas/catatan dan unduh teks.
- Loading, tombol nonaktif ketika menyimpan, pesan error, empty state, dan penyimpanan setelah operasi database berhasil.

## Cara mencoba

1. Buka /demo untuk data fiktif, atau /login untuk data akun.
2. Buat proyek. Buka kartu proyek, lalu Edit proyek untuk mengganti detailnya.
3. Tambah tugas. Klik nama tugas atau ikon pensil untuk membuka detail dan mengedit.
4. Di Semua tugas, gunakan filter dan urutan. Jadwal menampilkan deadline.
5. Di Perencanaan atau Risiko & perubahan, tambah catatan; ikon pensil mengisi form edit. Hapus meminta konfirmasi.
6. Ubah data lalu refresh. Akun tersimpan di Supabase, demo tersimpan di browser.
7. Hapus proyek percobaan; peringatan menjelaskan bahwa tugas dan catatannya ikut dihapus permanen.

## Akses dan batasan

Workspace masih pribadi per akun. Penanggung jawab berupa label nama, bukan undangan akun atau hak akses. Semua query database dibatasi RLS mengikuti pemilik proyek. Pemilik akun tidak bisa diubah lewat client. Actual cost tetap tidak dapat diedit langsung dari client.

Catatan status bukan persetujuan formal. Catatan sprint bukan implementasi lengkap Scrum. Catatan biaya bukan transaksi finansial. Kolaborasi multiuser, upload, komentar, audit historis, approval, reminder server, dan AI belum tersedia.

SQL perubahan: supabase/crud-projects-tasks-notes.sql. Pengujian akses: supabase/tests/crud-access.sql (menggunakan transaksi rollback, tidak meninggalkan data). Uji mencakup edit tugas/catatan, perlindungan ownership, penolakan baca/edit/hapus lintas akun, serta cascade delete.

Security advisor: RLS tabel baru aktif. Ada peringatan Auth bahwa leaked-password protection belum aktif; lihat https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection untuk konfigurasi yang sesuai paket proyek.
