# Menjalankan Laras

Project mandiri: C:\Users\ASUS\Documents\ChatGPT\laras

1. Jalankan `npm install`.
2. Jalankan `npm run dev`.
3. Buka http://localhost:3002 (atau /laras).

## Status implementasi

Berjalan lokal: proyek, tugas, status, pencarian, filter metode, milestone/sprint/tahap berupa catatan, risiko/blocker/change request berupa catatan, ringkasan budget contoh, catatan biaya, catatan koordinasi tim, ekspor laporan teks.

Belum diimplementasikan: otorisasi role, akun bersama, posting/reversal biaya, realisasi komitmen, approval antar pengguna, workflow gate Waterfall, sprint lifecycle Scrum, upload privat, audit backend, email, scheduler dan AI sungguhan. Mengisi environment saja belum mengaktifkan fitur tersebut.

## Konfigurasi layanan untuk tahap backend

1. Buat PostgreSQL development dan production terpisah. Simpan connection string di `.env.local` sebagai DATABASE_URL. Jangan commit file ini.
2. Integrasikan Prisma versi stabil dan jalankan migrasi berdasarkan entitas di PANDUAN-PEMBANGUNAN-LARAS.md.
3. Implementasikan Better Auth dengan BETTER_AUTH_SECRET dan BETTER_AUTH_URL. Tambahkan keanggotaan workspace, project role, dan izin finance pada setiap operasi server.
4. Pilih provider email; verifikasi domain lalu konfigurasi EMAIL_API_KEY dan EMAIL_FROM.
5. Pilih provider/model AI; simpan AI_API_KEY dan AI_MODEL di server. Buat tools baca berizin dan validasi output sebelum mengaktifkan chat.
6. Buat project Trigger.dev; konfigurasi TRIGGER_SECRET_KEY dan implementasikan reminder idempoten.
7. Siapkan object storage privat dan izin upload/download.
8. Uji isolasi workspace, posting biaya atomik, duplikasi job, dan data AI sebelum rilis tim.

Data demo browser berada di origin lama localhost:3001; data itu tidak otomatis berpindah ke localhost:3002. Data contoh bawaan tetap tersedia pada aplikasi baru.

## Konfigurasi yang sedang disiapkan

Keputusan terbaru: Supabase untuk PostgreSQL dan autentikasi, menggantikan rencana Better Auth. Proyek MAPAN adalah proyek terpisah dan tidak digunakan untuk Laras.

1. Buat proyek bernama Laras di dashboard Supabase, region Singapore bila tersedia.
2. Tunggu status healthy. Jangan membagikan password database atau secret melalui chat.
3. Setelah proyek tersedia, konfigurasi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY di .env.local. Keduanya ditujukan untuk client; jangan masukkan service-role key ke variable NEXT_PUBLIC.
4. Berikutnya implementasikan session SSR, tabel workspace/project/task, membership serta RLS. Keberadaan environment belum mengaktifkan penyimpanan bersama.
5. Pilih penyedia AI dan atur API key hanya pada server. Chat AI baru diaktifkan setelah autentikasi dan izin akses data teruji.
6. Jalankan npm run check:config untuk memeriksa nama variabel yang belum terisi tanpa menampilkan secret.

Font: Plus Jakarta Sans Variable disimpan melalui paket @fontsource-variable, tidak mengambil font dari Google saat aplikasi dibuka.

## Integrasi Supabase aktif — 6 November 2026

Project: Laras (`cylkfetuwqvanetmlhxq`), Singapore. MAPAN tidak diubah.

- URL dan publishable key sudah di `.env.local` (diabaikan Git).
- Halaman `/` dan `/laras` menyediakan pendaftaran, login, dan logout akun aplikasi.
- Proyek dan tugas akun disimpan di tabel `projects` dan `tasks`; setiap akun hanya dapat mengakses data miliknya melalui RLS.
- Penambahan proyek/tugas serta perubahan status menunggu respons database. Data demo tidak diimpor otomatis.
- `/demo` tetap lokal dan tidak mengakses data akun.
- Finance, anggota tim bersama, planning, dan approval multiuser masih menunggu integrasi. Pondasi sekarang adalah workspace pribadi, belum shared workspace.
- Tarif/actual tidak bisa ditulis dari client; posting biaya belum tersedia.

### Langkah pengguna

1. Supabase → Authentication → URL Configuration: Site URL `http://localhost:3002`; tambahkan redirect URL `http://localhost:3002` (dan domain deployment nantinya).
2. Di Laras, pilih Daftar dengan email dan password baru untuk aplikasi, bukan password database.
3. Periksa email konfirmasi jika diwajibkan. Setelah konfirmasi, kembali ke Laras dan masuk. Pengiriman email development mengikuti batas Supabase; jangan menonaktifkan verifikasi untuk production.
4. Buat proyek, tambah tugas, ubah status, lalu refresh untuk memeriksa data tersimpan.

Security advisor tidak menemukan lint setelah migrasi. Uji transaksi rollback memverifikasi akses akun pemilik, penolakan baca/tulis lintas akun, dan penyisipan task lintas proyek. Belum ada akun pengguna nyata yang dibuat otomatis dan pengiriman email belum diuji end-to-end.
# laras
