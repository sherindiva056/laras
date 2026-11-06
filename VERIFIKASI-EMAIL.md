# Desain dan konfigurasi verifikasi email

## Tampilan tersedia

- Setelah mendaftar: kartu cek kotak masuk, alamat email, langkah verifikasi, dan tombol kirim ulang.
- Callback asli: http://localhost:3002/auth/verify. Menampilkan proses pemeriksaan, berhasil jika Supabase mengonfirmasi user, atau status gagal jika tautan/sesi tidak dapat digunakan.
- Preview dokumentasi: http://localhost:3002/demo/verification. Empat status dapat dipilih tanpa login dan tanpa mengirim email. Status berhasil pada preview hanyalah simulasi.
- Template email siap dipasang: emails/confirm-signup.html.

## Pasang template di Supabase Laras

1. Buka proyek Laras → Authentication → Email Templates (pada beberapa versi dashboard berada di bagian Emails).
2. Pilih Confirm signup.
3. Subject: Konfirmasi email kamu — Laras.
4. Ganti isi HTML dengan seluruh isi emails/confirm-signup.html, lalu simpan.
5. Pertahankan placeholder {{ .ConfirmationURL }}. Jangan menggantinya dengan link preview atau callback langsung karena akan melewati verifikasi token.
6. Authentication → URL Configuration: pertahankan Site URL http://localhost:3002 dan tambahkan redirect URL http://localhost:3002/auth/verify. Ulangi untuk domain production jika sudah ada.

Template ini belum dipasang secara remote; koneksi Supabase yang tersedia tidak memiliki operasi pembaruan template email. SMTP tetap mengikuti konfigurasi pengirim proyek saat ini.

## Verifikasi alur nyata

1. Daftar akun baru yang kamu kelola. Halaman cek email muncul jika konfirmasi diperlukan.
2. Buka email dan klik tombol konfirmasi; pastikan kembali ke /auth/verify dan status berhasil.
3. Klik Buka workspace dan pastikan akun dapat digunakan.
4. Coba /auth/verify pada browser tanpa sesi: tidak boleh menampilkan sukses tanpa akun terkonfirmasi.
5. Coba link kedaluwarsa: status gagal dan jalan kembali ke login harus tersedia.
6. Kirim ulang hanya dengan klik pengguna. UI membatasi percobaan selama 60 detik setelah permintaan berhasil; batas Supabase tetap berlaku.

Token/password tidak ditampilkan pada UI atau log. Parameter callback dibersihkan setelah pemeriksaan. Pengujian screenshot tidak memerlukan email nyata; gunakan preview.
