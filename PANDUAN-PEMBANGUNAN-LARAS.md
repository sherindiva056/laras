# Laras — Panduan Pembangunan Sistem

Tanggal penyusunan: 4 November 2026  
Status: rancangan produk dan panduan implementasi; belum merupakan fitur yang sudah dibangun.

## 1. Nama dan ringkasan sistem

**Laras** adalah nama untuk sistem manajemen proyek IT yang menggabungkan pengelolaan tim, metode pengembangan, task, jadwal, budget, biaya, dan asisten AI dalam satu workspace.

Tagline: **Selaraskan tim, tuntaskan proyek.**

Nama Laras dipilih karena melambangkan keselarasan antara tim, pekerjaan, waktu, dan biaya. Ketersediaan merek dan domain belum diperiksa.

Sistem membantu project manager menjawab:

- Apa yang sedang dikerjakan tim dan siapa penanggung jawabnya?
- Apakah milestone dan jadwal proyek masih sesuai rencana?
- Pekerjaan mana yang terhambat dan apa dampaknya?
- Berapa biaya yang sudah terjadi, sudah terikat, dan diperkirakan masih dibutuhkan?
- Keputusan atau persetujuan apa yang perlu segera ditindaklanjuti?

## 2. Tujuan dan pengguna sasaran

### Tujuan

1. Menyatukan informasi proyek sehingga PM tidak perlu menyusun ulang laporan dari banyak tempat.
2. Menyediakan workflow yang mengikuti metode pengelolaan proyek.
3. Mempermudah anggota tim memperbarui pekerjaan dan melaporkan hambatan.
4. Menghubungkan perubahan scope dengan dampak jadwal dan biaya.
5. Menggunakan AI untuk membantu memahami data, menyusun draft, dan menentukan tindak lanjut.

### Sasaran awal

- Tim pengembangan aplikasi dan software house.
- Tim IT internal perusahaan.
- PM yang menangani satu atau beberapa proyek dengan anggota lintas proyek.

Asumsi awal: aplikasi web responsif untuk satu atau beberapa organisasi, dikembangkan oleh individu atau tim kecil. Jumlah pengguna, target beban, dan anggaran hosting harus dipastikan sebelum menentukan kapasitas produksi.

## 3. Batasan istilah dan prinsip produk

SDLC adalah siklus pengembangan software. Waterfall dan Spiral adalah model pengembangan; Scrum adalah framework Agile; Kanban adalah metode pengelolaan aliran kerja. Di antarmuka, gunakan label **Metode pengelolaan proyek** untuk pilihan tersebut.

Prinsip utama:

- Anggota memperbarui pekerjaan sekali; dashboard dan laporan menggunakan data yang sama.
- Task, anggota, milestone, biaya, dan risiko mempunyai fondasi data bersama untuk semua metode.
- Metode menentukan struktur workflow, aturan transisi, dan tampilan yang relevan.
- Penghitungan keuangan dilakukan oleh kode backend yang teruji.
- AI menjelaskan data dan mengusulkan tindakan; perubahan penting membutuhkan konfirmasi pengguna berwenang.
- Setiap akses data dibatasi oleh workspace, keanggotaan proyek, dan izin pengguna.
- Status kesehatan proyek harus mempunyai alasan yang terlihat, bukan sekadar warna atau skor AI.

## 4. Ruang lingkup rilis

### MVP — rilis pertama

- Akun, login, sesi, dan pemulihan akses.
- Workspace, undangan anggota, serta role per proyek.
- Pembuatan proyek dengan template Waterfall atau Scrum.
- Task, subtask/checklist, penanggung jawab, status, prioritas, deadline, komentar, dan blocker.
- Milestone untuk semua proyek; backlog dan sprint untuk Scrum.
- Dashboard proyek serta halaman Pekerjaan Saya.
- Budget yang disetujui, pencatatan actual cost, komitmen biaya, dan estimasi biaya tersisa secara manual.
- Change request dengan persetujuan dan riwayat perubahan rencana.
- Notifikasi dalam aplikasi serta reminder terjadwal.
- Chatbot dengan data proyek yang diizinkan dan draft laporan mingguan.
- Audit log untuk perubahan sensitif.

### Rilis berikutnya

- Kanban dengan batas WIP dan metrik aliran kerja.
- Timesheet yang disetujui dan penghitungan biaya tenaga kerja otomatis.
- Tampilan kapasitas lintas proyek serta timeline dependency yang lebih lengkap.
- Email reminder dan integrasi kalender.
- Dokumen rapat, action item, serta pencarian dokumen untuk AI.
- Spiral dan Hybrid setelah kebutuhan workflow-nya divalidasi.
- Integrasi repository, issue tracker, dan sistem keuangan.

MVP tidak mencakup payroll, akuntansi lengkap, perpajakan, aplikasi mobile native, maupun pengembangan model AI sendiri.

## 5. Role dan hak akses

Role workspace dan role proyek dipisahkan. Seseorang dapat menjadi PM di proyek A dan Team Member di proyek B.

| Role | Cakupan | Tanggung jawab |
| --- | --- | --- |
| Workspace Owner | Workspace | Mengelola kepemilikan, kebijakan akses, dan pengaturan workspace. |
| Workspace Admin | Workspace | Mengundang anggota dan mengelola konfigurasi sesuai delegasi owner. |
| Project Manager | Proyek | Mengelola scope, task, tim, jadwal, risiko, dan keuangan sesuai izin. |
| Team Member | Proyek | Mengerjakan task, memperbarui status, memberi komentar, dan melaporkan blocker. |
| Stakeholder / Client | Proyek | Melihat informasi yang dibagikan dan menyetujui item jika ditunjuk sebagai approver. |

### Matriks izin awal

| Aksi | Owner/Admin | PM proyek | Team Member | Stakeholder |
| --- | --- | --- | --- | --- |
| Mengelola anggota workspace | Sesuai role | Tidak | Tidak | Tidak |
| Membuat proyek | Sesuai kebijakan | Jika diberi izin | Tidak | Tidak |
| Mengelola anggota proyek | Jika diberi akses proyek | Ya | Tidak | Tidak |
| Mengelola rencana dan task | Jika diberi akses proyek | Ya | Task yang diizinkan | Baca yang dibagikan |
| Melaporkan blocker / komentar | Jika diberi akses proyek | Ya | Ya | Sesuai izin |
| Melihat detail keuangan | Izin finance | Izin finance | Tidak secara default | Ringkasan jika dibagikan |
| Menyetujui budget / perubahan | Jika ditunjuk | Jika ditunjuk | Tidak | Jika ditunjuk |
| Menggunakan chatbot | Sesuai akses data | Sesuai akses data | Sesuai akses data | Sesuai akses data |

Admin workspace tidak otomatis memperoleh semua detail keuangan proyek. Terapkan izin eksplisit seperti `finance.view`, `finance.manage`, dan `budget.approve`. Tarif tenaga kerja membutuhkan izin terpisah.

MVP dapat memakai satu approver per permintaan. Pembuat permintaan tidak menyetujui permintaannya sendiri; untuk workspace satu orang, sediakan aktivasi mandiri awal yang dicatat sebagai pengecualian, bukan approval dua pihak.

## 6. Modul dan fitur

### 6.1 Workspace dan tim

- Membuat workspace dan profil organisasi.
- Mengundang anggota melalui email dengan token kedaluwarsa dan hanya dapat digunakan sesuai aturan undangan.
- Menentukan role workspace dan keanggotaan proyek.
- Menonaktifkan anggota tanpa menghapus riwayat pekerjaannya.
- Menampilkan direktori anggota dan proyek yang diikuti.

### 6.2 Project dan metode kerja

- Identitas proyek: nama, deskripsi, tujuan, PM, periode, mata uang, dan metode.
- Scope awal, deliverable, milestone, serta kriteria keberhasilan.
- Template workflow disalin saat proyek dibuat agar perubahan template tidak mengubah proyek aktif.
- Perubahan metode pada proyek aktif ditunda dari MVP karena memerlukan pemetaan status, sprint, dan riwayat.

| Metode | Struktur | Aturan utama |
| --- | --- | --- |
| Waterfall | Requirement → Design → Development → Testing → Deployment | Setiap tahap memiliki deliverable dan gate persetujuan; pengerjaan paralel hanya jika aturan proyek mengizinkan. |
| Scrum | Product backlog → Sprint planning → Sprint aktif → Review → Retrospective | Sprint memiliki goal, periode, dan scope awal; perubahan selama sprint tetap tercatat. |
| Kanban, lanjutan | Kolom workflow dan batas WIP | Catat waktu masuk/keluar status untuk mengukur cycle time dan mendeteksi penumpukan. |
| Spiral, lanjutan | Tujuan → Analisis risiko → Pengembangan → Evaluasi per siklus | Setiap siklus mencatat risiko dan hasil evaluasi. |
| Hybrid, lanjutan | Tahap besar dengan sprint atau board di dalamnya | Definisikan pemetaan tahap, pekerjaan, dan aturan pelaporan sebelum digunakan. |

### 6.3 Task dan pelacakan pekerjaan

- Judul, deskripsi, tipe pekerjaan, prioritas, dan label.
- Satu penanggung jawab utama; kolaborator dapat lebih dari satu.
- Status sesuai workflow, deadline, estimasi usaha, checklist, dan lampiran.
- Relasi ke tahap, milestone, atau sprint sesuai konteks.
- Dependency awal memakai hubungan sederhana: task B menunggu task A selesai.
- Tolak dependency melingkar.
- Blocker memiliki deskripsi, pemilik tindak lanjut, tingkat dampak, dan status penyelesaian.
- Komentar, mention, dan riwayat perubahan.
- Halaman Pekerjaan Saya: tugas aktif, terlambat, menunggu review, dan terblokir.

Jangan menilai produktivitas orang hanya dari jumlah task selesai. Story point bukan jam kerja, tidak dipakai sebagai tarif, dan tidak dibandingkan antar tim sebagai ukuran produktivitas.

### 6.4 Dashboard dan laporan

- Ringkasan milestone, deadline terdekat, blocker, serta task terlambat.
- Budget disetujui, actual cost, komitmen terbuka, dan forecast biaya akhir.
- Status kesehatan dengan alasan, misalnya milestone melewati target atau forecast melampaui budget.
- Penanda kapan data terakhir diperbarui.
- Laporan mingguan: pencapaian, rencana berikutnya, hambatan, keputusan yang dibutuhkan, dan keuangan sesuai hak akses.

Progres awal dapat memakai persentase task selesai dengan label yang jelas. Jika memakai bobot, simpan bobot eksplisit dan jelaskan rumusnya. Progres tersebut tidak otomatis menunjukkan persentase nilai bisnis yang sudah diperoleh.

### 6.5 Budget dan cost

- Satu mata uang per proyek pada MVP; konversi mata uang ditunda.
- Budget awal yang disetujui dan revisinya disimpan sebagai baseline berversi.
- Alokasi budget per kategori; pemetaan ke tahap/sprint opsional dan tidak boleh menduplikasi jumlah.
- Actual cost: tanggal biaya, nominal, kategori, uraian, pencatat, referensi, dan bukti.
- Komitmen biaya: nilai yang disepakati, vendor bila ada, dan realisasi yang terkait.
- Estimasi biaya tersisa di luar komitmen terbuka, dengan tanggal dan penanggung jawab estimasi.
- Status transaksi: draft, submitted, approved/posted, rejected, dan void sesuai kebutuhan. Hanya transaksi posted yang masuk actual.
- Koreksi transaksi posted melalui pembatalan/reversal yang diaudit, bukan menghilangkan jejak.

Actual cost berarti biaya telah diakui sesuai kebijakan proyek; tidak harus berarti uang sudah dibayar. Status pembayaran dicatat terpisah bila diperlukan. Definisikan perlakuan pajak dan tanggal pengakuan secara konsisten sebelum input data.

#### Rumus dasar

```text
Budget aktif = baseline budget terbaru yang disetujui
Actual cost = total biaya posted setelah koreksi/reversal
Komitmen terbuka = nilai komitmen aktif - bagian yang sudah direalisasikan - bagian yang dibatalkan
Forecast biaya akhir = actual cost + komitmen terbuka + estimasi tersisa di luar komitmen
Sisa budget setelah actual = budget aktif - actual cost
Budget yang belum terikat = budget aktif - actual cost - komitmen terbuka
Prediksi pembengkakan = maksimum(0, forecast biaya akhir - budget aktif)
```

Contoh: budget Rp100 juta, actual Rp45 juta, komitmen terbuka Rp15 juta, dan estimasi tersisa di luar komitmen Rp50 juta menghasilkan forecast Rp110 juta dan prediksi pembengkakan Rp10 juta.

Saat biaya komitmen direalisasikan Rp5 juta, actual naik Rp5 juta dan komitmen terbuka turun Rp5 juta. Forecast tidak naik dua kali untuk kejadian yang sama. Gunakan relasi realisasi komitmen dan transaksi database untuk menjaga konsistensinya.

Simpan nilai uang sebagai `numeric/decimal` dengan presisi dan skala eksplisit. Pertahankan presisi dalam kode; hindari konversi ke floating point JavaScript untuk kalkulasi uang. Tetapkan aturan pembulatan.

Timesheet lanjutan menghitung biaya dari jam yang disetujui × snapshot tarif yang berlaku. Perubahan tarif berikutnya tidak mengubah biaya historis; cegah penghitungan ganda dengan biaya tenaga kerja yang dicatat manual.

### 6.6 Risiko dan change request

- Risiko: kemungkinan, dampak, pemilik, mitigasi, dan status.
- Change request: alasan, perubahan scope, dampak jadwal, tambahan biaya, serta approver.
- Alur: draft → submitted → approved/rejected → applied.
- Approval mengunci versi yang dinilai. Perubahan isi setelah approval membutuhkan pengajuan baru.
- Penerapan perubahan dilakukan sekali, dalam transaksi, dengan jejak baseline sebelumnya.
- PM dapat membandingkan rencana awal dengan rencana aktif.

### 6.7 Asisten AI

Fitur MVP:

1. Chatbot yang menjawab pertanyaan berbasis data proyek.
2. Draft laporan mingguan berdasarkan snapshot data dan periode tertentu.
3. Ringkasan blocker, risiko jadwal, dan kondisi budget.
4. Saran tindak lanjut yang bisa ditinjau PM.

Contoh pertanyaan:

- “Task apa yang menghambat milestone rilis?”
- “Jelaskan penyebab forecast melebihi budget.”
- “Buat draft laporan progres minggu ini.”

Aturan implementasi:

- Model mengakses fungsi backend terbatas seperti `getProjectSummary`, `getUpcomingTasks`, dan `getBudgetSummary`.
- Backend menentukan workspace dan izin dari sesi; jangan mempercayai project ID atau role yang dikirim model.
- Jangan memberikan akses SQL bebas atau seluruh database kepada model.
- Jawaban faktual menyertakan referensi task, milestone, atau transaksi serta waktu pembaruan data.
- Jika data tidak cukup, AI menyatakannya dan tidak membuat angka atau kepastian palsu.
- Dokumen, komentar, dan lampiran adalah data tidak tepercaya; isinya tidak boleh mengubah aturan akses atau instruksi sistem.
- Pada MVP, tool AI bersifat baca. Draft baru disimpan setelah pengguna mengonfirmasi.
- Perubahan budget, assignment, deadline, atau pengiriman pesan memerlukan preview dan konfirmasi dengan pemeriksaan izin ulang.
- Terapkan kuota, batas panjang konteks, timeout, dan pencatatan penggunaan per workspace.
- Log tidak boleh membocorkan token, kredensial, tarif privat, atau isi sensitif yang tidak diperlukan.
- Jika layanan AI gagal, task, keuangan, dan reminder berbasis aturan tetap berfungsi.

Pencarian dokumen berbasis embedding/RAG ditambahkan setelah kebutuhan dokumen terbukti. Data terstruktur proyek cukup diakses melalui fungsi backend pada MVP.

### 6.8 Reminder dan notifikasi

- Aturan awal: deadline mendekat, task terlambat, blocker belum selesai, dan approval menunggu.
- Scheduler memeriksa data; AI hanya membantu merangkum atau menjelaskan konteks bila diperlukan.
- Simpan preferensi kanal, timezone, quiet hours, dan frekuensi ringkasan.
- Simpan waktu sebagai UTC, lalu tampilkan mengikuti timezone pengguna. Tanggal tanpa jam seperti akhir sprint perlu aturan timezone proyek yang eksplisit.
- Gunakan kunci deduplikasi per aturan, objek, penerima, dan periode pengingat.
- Job dapat dicoba ulang tanpa menghasilkan notifikasi ganda.
- Periksa status terbaru sebelum mengirim agar task yang sudah selesai tidak diingatkan lagi.
- Anggota yang aksesnya dicabut tidak menerima isi proyek tersebut.

## 7. Flow penggunaan

### 7.1 Onboarding

1. Pengguna mendaftar dan memverifikasi email.
2. Membuat workspace serta memilih timezone.
3. Owner mengundang anggota.
4. Anggota menerima undangan dan bergabung.
5. PM membuat proyek dan menentukan anggota beserta role proyek.

### 7.2 Membuat proyek

1. Isi tujuan, scope, deliverable, periode, dan mata uang.
2. Pilih Waterfall atau Scrum.
3. Sistem menyalin template workflow ke proyek.
4. PM menyusun milestone dan tahap atau backlog awal.
5. Masukkan proposal budget dan tentukan approver.
6. Approver menyetujui baseline; PM mengaktifkan proyek setelah prasyarat terpenuhi.

### 7.3 Pekerjaan harian

1. Anggota membuka Pekerjaan Saya.
2. Membuka task, memperbarui status, dan menambahkan hasil pekerjaan.
3. Jika terhambat, membuat blocker dengan kebutuhan bantuan.
4. PM melihat dashboard dan menindaklanjuti hambatan atau beban kerja.
5. Reviewer memeriksa hasil sesuai workflow sebelum task selesai.
6. Sistem memperbarui ringkasan dan mengirim reminder sesuai aturan.

### 7.4 Alur Waterfall

1. PM menyusun tahap dan deliverable.
2. Tim menyelesaikan task pada tahap aktif.
3. Reviewer memeriksa deliverable.
4. Approver menyetujui gate tahap.
5. Tahap berikutnya dibuka sesuai aturan proyek.
6. Perubahan scope diajukan sebagai change request.

### 7.5 Alur Scrum

1. PM atau pemilik produk menyusun dan memprioritaskan backlog.
2. Tim melakukan sprint planning dan menyepakati sprint goal.
3. Pilih task serta simpan scope awal sprint.
4. Tim memperbarui pekerjaan dan blocker selama sprint.
5. Review hasil, tutup sprint, dan catat retrospective.
6. Task yang belum selesai dipindahkan secara eksplisit ke backlog/sprint berikutnya; simpan riwayatnya.

Role Scrum seperti Product Owner dan Scrum Master dapat dicatat sebagai tanggung jawab tambahan. Jangan menganggap PM otomatis menjalankan semua tanggung jawab tersebut.

### 7.6 Keuangan dan perubahan

1. Pengguna berizin mencatat biaya atau komitmen.
2. Approver memeriksa bukti dan klasifikasi.
3. Biaya yang disetujui diposting; realisasi komitmen dicatat bila terkait.
4. PM memperbarui estimasi biaya tersisa secara berkala.
5. Sistem menghitung forecast dan menandai selisih terhadap budget aktif.
6. Jika perlu perubahan scope/budget, PM mengajukan change request.
7. Setelah disetujui, sistem membuat baseline baru dan mempertahankan baseline lama.

### 7.7 Chatbot dan laporan

1. Pengguna memilih konteks proyek dan mengajukan pertanyaan.
2. Backend memverifikasi sesi dan akses.
3. Fungsi backend mengambil data yang diizinkan.
4. AI menyusun jawaban dengan referensi sumber.
5. Untuk laporan, pengguna memeriksa draft sebelum menyimpan atau membagikannya.

### 7.8 Penutupan proyek

1. Periksa deliverable, task terbuka, dan keputusan yang belum selesai.
2. Rekonsiliasi actual, komitmen terbuka, serta forecast.
3. Catat penerimaan hasil dan evaluasi proyek.
4. Tandai proyek selesai dan arsipkan dengan akses baca sesuai izin.
5. Hentikan reminder operasional proyek yang telah ditutup.

## 8. Halaman aplikasi

| Area | Halaman utama |
| --- | --- |
| Akun | Login, registrasi, verifikasi, pemulihan akses |
| Workspace | Dashboard, daftar proyek, anggota, undangan, pengaturan |
| Personal | Pekerjaan Saya, notifikasi, profil dan preferensi |
| Proyek | Overview, task board/list, milestone, tim |
| Waterfall | Tahap, deliverable, gate approval |
| Scrum | Backlog, daftar sprint, sprint aktif, retrospective |
| Finance | Ringkasan budget, biaya, komitmen, forecast, revisi budget |
| Governance | Risiko, blocker, change request, approval, audit log |
| AI | Chat proyek dan draft laporan |

Pada layar kecil, utamakan task list dan pembaruan status. Board dan tabel lebar perlu alternatif yang tetap bisa digunakan dengan keyboard dan perangkat sentuh.

## 9. Tech stack yang direkomendasikan

| Bagian | Pilihan | Alasan |
| --- | --- | --- |
| Bahasa | TypeScript | Bahasa bersama untuk UI, backend, dan background jobs. |
| Web dan backend | Next.js App Router + React | Halaman aplikasi serta endpoint backend dalam satu codebase. |
| Styling | Tailwind CSS | Membantu konsistensi token dan layout. |
| Komponen | shadcn/ui | Komponen yang dapat disesuaikan dengan kebutuhan aplikasi. |
| Database | PostgreSQL | Relasi, transaksi, dan tipe numerik presisi untuk data keuangan. |
| ORM | Prisma versi stabil yang kompatibel | Query bertipe dan migrasi database. |
| Autentikasi | Better Auth | Akun, sesi, undangan/organisasi melalui integrasi yang diverifikasi saat implementasi. |
| Validasi | Zod | Memvalidasi input pada batas backend dan struktur input tool AI. |
| Background jobs | Trigger.dev | Reminder terjadwal, retry, dan pembuatan laporan di background. |
| AI | Vercel AI SDK + penyedia model | Chat, streaming jawaban, dan pemanggilan fungsi backend terbatas. |
| File | Object storage kompatibel S3 | Lampiran proyek dan bukti biaya dengan akses privat. |
| Pengujian | Vitest + Playwright | Pengujian aturan bisnis dan flow pengguna penting. |
| Deployment | Hosting Next.js + PostgreSQL terkelola | Pilihan vendor ditentukan berdasarkan budget, region, dan kebutuhan operasional. |

Email transaksional memerlukan penyedia tambahan untuk verifikasi, pemulihan akun, dan undangan. Pilih setelah mengecek biaya, domain pengirim, serta kebijakan pengiriman.

Pilih versi stabil secara eksplisit dan simpan lockfile. Jangan berasumsi tag `latest` selalu stabil. Cocokkan versi ORM, adapter autentikasi, Node.js, dan Next.js sebelum instalasi.

### Catatan workspace saat ini

Workspace yang diperiksa adalah proyek portofolio dengan Next.js, React, dan TypeScript; sistem Laras belum dibangun di dalamnya. Sebaiknya implementasi produk dibuat pada repository/folder tersendiri setelah lokasi disepakati agar aplikasi portofolio tidak tertimpa.

Sebelum menulis kode Next.js, baca panduan relevan di `node_modules/next/dist/docs/` sesuai instruksi AGENTS.md. Jika konfigurasi aplikasi menggunakan static export, evaluasi ulang: autentikasi, database, dan API membutuhkan runtime server atau backend terpisah.

## 10. Arsitektur awal

Gunakan satu aplikasi dengan modul bisnis yang terpisah secara logis. Background jobs berjalan di runtime worker/layanan job, menggunakan aturan bisnis dan database yang sama.

```text
Browser
  |
  v
Next.js: UI + backend
  |-- Session dan pemeriksaan izin
  |-- Workspace / project / task
  |-- Finance / approval / audit
  |-- AI tools yang dibatasi izin ---> Penyedia model AI
  |
  |-- PostgreSQL
  |-- Object storage privat
  |-- Penyedia email
  |
  +-- Background jobs
        |-- Pemeriksaan deadline
        |-- Notifikasi terjadwal
        +-- Draft laporan
```

Kredensial database, model AI, email, dan storage hanya berada di server. Browser tidak memanggil provider AI memakai secret aplikasi.

Realtime bukan prasyarat MVP. Mulai dengan pembaruan setelah aksi dan refresh berkala yang terukur. Tambahkan sinkronisasi realtime ketika kebutuhan kolaborasi membenarkannya.

## 11. Rancangan data awal

| Entitas | Data/relasi penting |
| --- | --- |
| User | Identitas pengguna; sesi dan akun mengikuti skema auth. |
| Workspace | Nama, timezone default, pengaturan. |
| WorkspaceMember | User, workspace, role, status keanggotaan. |
| Invitation | Email, workspace/proyek, role tujuan, token hash, kedaluwarsa, status. |
| Project | Workspace, metode, PM, periode, mata uang, status. |
| ProjectMember | Project, user, role proyek, izin tambahan. |
| WorkflowStatus | Project, nama, urutan, kategori status, aturan transisi. |
| Phase | Tahap Waterfall, urutan, status, persetujuan. |
| Deliverable | Hasil tahap dan referensi bukti/penerimaan. |
| Milestone | Target tanggal, kriteria selesai, status. |
| Sprint | Project, goal, periode, status. |
| Task | Project, assignee, status, prioritas, deadline, estimasi, phase/milestone bila ada. |
| SprintTask | Riwayat keikutsertaan task pada sprint dan scope awal. |
| TaskDependency | Predecessor dan successor dalam proyek yang sama. |
| TaskStatusHistory | Perubahan status, pelaku, dan waktu. |
| ChecklistItem / Comment | Task, isi, status atau penulis. |
| Attachment | Metadata file, lokasi privat, pemilik objek, ukuran, tipe. |
| Blocker / Risk | Project/task, dampak, pemilik, tindak lanjut, status. |
| BudgetRevision | Project, versi, total, status approval, tanggal berlaku. |
| BudgetAllocation | Revisi, kategori, alokasi; dimensi tahap/sprint bila digunakan. |
| CostEntry | Project, kategori, nominal, tanggal, status, bukti, idempotency key. |
| CostCommitment | Nilai komitmen, perubahan/pembatalan, vendor, status. |
| CommitmentRealization | Komitmen, cost entry, jumlah yang direalisasikan. |
| CostForecast | Snapshot komitmen dan estimasi tersisa, waktu, pembuat, asumsi. |
| ChangeRequest | Scope, dampak waktu/biaya, versi, status. |
| Approval | Target dan versi yang ditinjau, approver, keputusan, waktu. |
| Notification / Delivery | Penerima, referensi objek, kanal, status, deduplication key. |
| ReminderRule | Jenis pengingat, jadwal, preferensi. |
| AiConversation / AiMessage | Konteks proyek, pesan, referensi sumber, kebijakan retensi. |
| Report | Periode, snapshot sumber, draft/final, pembuat. |
| AuditLog | Aktor, aksi, objek, waktu, perubahan relevan. |
| Timesheet / Rate | Lanjutan: jam disetujui dan snapshot tarif privat. |

### Aturan integritas

- Semua data bisnis memiliki hubungan yang dapat diverifikasi ke workspace dan proyek.
- Validasi bahwa assignee masih menjadi anggota aktif proyek.
- Gunakan constraint unik untuk keanggotaan dan kunci idempotensi.
- Reference lintas workspace/proyek harus ditolak di backend dan, bila memungkinkan, lewat constraint database.
- Approval, posting biaya, realisasi komitmen, dan penerapan revisi harus atomik melalui transaksi.
- Gunakan version check untuk mencegah pembaruan bersamaan menimpa data terbaru.
- Indeks awal: keanggotaan, task per proyek/status/assignee/deadline, notifikasi penerima, serta biaya per proyek/tanggal/status.
- Penghapusan anggota atau pengarsipan proyek tidak menghapus riwayat keuangan.
- Retensi dan penghapusan data pribadi perlu kebijakan eksplisit; audit bukan alasan menyimpan semua isi selamanya.

## 12. Step by step pembangunan

### Tahap 1 — Kunci kebutuhan MVP

1. Pastikan target pengguna, jenis organisasi, dan jumlah proyek awal.
2. Tentukan Waterfall dan Scrum sebagai dua metode pertama.
3. Putuskan aturan approval budget dan change request.
4. Definisikan mata uang, timezone, kategori biaya, dan arti actual cost.
5. Susun user story dan acceptance criteria.

Hasil: scope MVP yang disetujui, daftar role, dan aturan bisnis tertulis.

### Tahap 2 — Rancang flow dan antarmuka

1. Buat sitemap berdasarkan bagian halaman aplikasi.
2. Rancang flow onboarding, membuat proyek, update task, biaya, dan approval.
3. Buat design system untuk warna, tipografi, spacing, tabel, form, dan status.
4. Rancang kondisi kosong, loading, error, akses ditolak, dan data terlambat diperbarui.
5. Evaluasi navigasi keyboard, kontras, label form, dan reduced motion.

Untuk implementasi UI di proyek ini, ikuti workflow design-system pada skill UI UX Pro Max dan panduan Emil Kowalski sesuai AGENTS.md. Deteksi stack aktual sebelum memilih panduan stack.

Hasil: wireframe dan spesifikasi komponen untuk flow MVP.

### Tahap 3 — Siapkan fondasi aplikasi

1. Buat repository produk dan konfigurasi Next.js + TypeScript pada versi kompatibel.
2. Pasang styling, komponen, validasi, serta tooling pemeriksaan kode.
3. Siapkan environment development, staging, dan production yang terpisah.
4. Siapkan PostgreSQL, migrasi awal, dan seed data sintetis.
5. Buat continuous integration untuk typecheck, build, dan pengujian penting.
6. Siapkan pengelolaan secret, logging terstruktur, dan penanganan error.

Hasil: aplikasi dasar bisa dijalankan dan dideploy ke staging.

### Tahap 4 — Bangun autentikasi dan isolasi workspace

1. Implementasikan login, verifikasi, pemulihan akses, dan sesi.
2. Tambahkan workspace, membership, dan undangan.
3. Buat pemeriksaan izin backend terpusat.
4. Tambahkan role proyek dan izin finance.
5. Uji akses langsung menggunakan ID proyek milik workspace lain.

Hasil: pengguna hanya dapat mengakses data sesuai keanggotaannya, termasuk lewat endpoint langsung.

### Tahap 5 — Bangun project dan workflow

1. Implementasikan pembuatan dan pengarsipan proyek.
2. Buat template Waterfall dan Scrum yang disalin per proyek.
3. Tambahkan milestone, phase, deliverable, backlog, dan sprint.
4. Validasi transisi status, gate approval, serta periode sprint.

Hasil: dua proyek contoh dapat berjalan dengan metode berbeda tanpa data saling tercampur.

### Tahap 6 — Bangun task dan kolaborasi

1. Tambahkan task CRUD, assignee, checklist, komentar, dan lampiran privat.
2. Buat tampilan list/board serta Pekerjaan Saya.
3. Tambahkan blocker dan dependency dengan deteksi siklus.
4. Rekam riwayat status dan perubahan penting.
5. Tangani pembaruan bersamaan dan pencabutan akses anggota.

Hasil: tim dapat mengerjakan flow task lengkap dari dibuat sampai ditinjau dan selesai.

### Tahap 7 — Bangun finance dan approval

1. Implementasikan baseline budget serta alokasi kategori.
2. Tambahkan pencatatan biaya, bukti, review, dan posting.
3. Tambahkan komitmen serta realisasinya.
4. Implementasikan snapshot estimasi tersisa dan rumus forecast.
5. Bangun change request, approval versi, dan penerapan baseline baru.
6. Uji presisi, pembulatan, reversal, double submission, dan realisasi parsial.

Hasil: angka dashboard dapat direkonsiliasi dengan transaksi sumber dan tidak dihitung ganda.

### Tahap 8 — Bangun dashboard dan laporan biasa

1. Definisikan query agregasi dan rumus progres.
2. Tampilkan alasan status kesehatan proyek.
3. Tambahkan filter yang relevan serta penanda waktu pembaruan.
4. Buat laporan berbasis template tanpa AI terlebih dahulu.

Hasil: PM dapat membaca kondisi proyek walaupun fitur AI dinonaktifkan.

### Tahap 9 — Tambahkan reminder

1. Konfigurasi background jobs serta jadwal pemeriksaan.
2. Tambahkan aturan deadline, blocker, dan approval.
3. Buat notifikasi dalam aplikasi dan preferensi pengguna.
4. Implementasikan deduplikasi, retry, quiet hours, dan pengecekan akses terbaru.
5. Pantau job gagal; sediakan mekanisme menjalankan ulang dengan aman.

Hasil: reminder berjalan saat browser ditutup dan tidak berulang akibat retry.

### Tahap 10 — Tambahkan AI

1. Pilih model berdasarkan evaluasi kualitas Bahasa Indonesia, biaya, latensi, serta kebijakan data.
2. Buat fungsi baca backend dengan input terstruktur dan izin eksplisit.
3. Implementasikan chat dengan referensi sumber.
4. Tambahkan draft laporan mingguan dan ringkasan risiko.
5. Terapkan kuota, timeout, fallback, serta pencatatan penggunaan.
6. Uji pertanyaan lintas izin, data kurang lengkap, angka keuangan, dan instruksi berbahaya dalam komentar.

Hasil: AI memberi bantuan yang dapat diperiksa tanpa membuka akses data tambahan.

### Tahap 11 — Verifikasi end-to-end

1. Jalankan flow Owner mengundang PM dan anggota.
2. Jalankan proyek Waterfall dan Scrum dari pembuatan hingga penutupan.
3. Uji approval, biaya, komitmen, perubahan budget, dan reminder.
4. Uji role stakeholder dengan informasi yang dibatasi.
5. Uji akses keyboard, layar kecil, dan koneksi lambat.
6. Jalankan uji beban sesuai target pengguna yang sudah ditetapkan.

Hasil: acceptance criteria MVP terpenuhi dengan bukti pengujian.

### Tahap 12 — Pilot dan rilis

1. Gunakan staging dengan data sintetis untuk demonstrasi.
2. Siapkan backup database dan lakukan uji restore.
3. Pastikan migrasi produksi serta rencana rollback/forward-fix telah ditinjau.
4. Siapkan pemantauan error, job gagal, penggunaan AI, dan biaya layanan.
5. Jalankan pilot pada satu tim dan satu proyek nyata dengan akses yang disepakati.
6. Perbaiki masalah utama sebelum membuka penggunaan lebih luas.

Hasil: rilis yang dapat dioperasikan, dipantau, dan dipulihkan.

## 13. Pengujian yang diprioritaskan

| Area | Skenario wajib |
| --- | --- |
| Isolasi data | Anggota workspace A tidak bisa membaca/mengubah data workspace B melalui UI, API, file, atau AI. |
| Role | Member tidak bisa menaikkan izin, melihat tarif privat, atau menyetujui budget tanpa wewenang. |
| Task | Assignee tidak sah, dependency melingkar, status tidak valid, dan update bersamaan ditangani. |
| Finance | Actual/komitmen tidak dihitung ganda, realisasi parsial benar, reversal terlacak, dan presisi terjaga. |
| Approval | Pengajuan versi lama tidak diterapkan, penerapan ganda ditolak, dan aturan approver berlaku. |
| Reminder | Retry tidak menggandakan kiriman; task selesai dan akses dicabut menghentikan reminder relevan. |
| AI | Tidak membocorkan data, tidak membuat angka, menyertakan sumber, dan gagal dengan jelas saat provider bermasalah. |
| Operasional | Migrasi, backup/restore, secret, dan batas penggunaan diverifikasi. |

Contoh acceptance criteria:

- Ketika member proyek mencoba endpoint budget tanpa izin finance, backend menolak dan tidak mengirim nominal.
- Ketika komitmen Rp10 juta direalisasikan Rp4 juta, komitmen terbuka menjadi Rp6 juta dan actual bertambah Rp4 juta.
- Ketika job deadline dicoba ulang, hanya satu notifikasi untuk penerima dan periode yang sama.
- Ketika AI tidak menemukan estimasi tersisa, jawaban menjelaskan forecast belum lengkap.
- Ketika change request disetujui lalu diterapkan dua kali, hanya satu baseline baru tercipta.

## 14. Urutan backlog yang bisa langsung dikerjakan

| Urutan | Paket pekerjaan | Syarat selesai |
| --- | --- | --- |
| 1 | Spesifikasi dan wireframe | Flow, role, rumus finance, dan scope MVP jelas. |
| 2 | Fondasi dan deployment staging | Build, database, migrasi, dan CI berjalan. |
| 3 | Auth, workspace, undangan | Akses lintas workspace terisolasi. |
| 4 | Project dan metode | Template Waterfall/Scrum bisa digunakan. |
| 5 | Task dan kolaborasi | Anggota dapat memperbarui task dan blocker. |
| 6 | Budget, cost, dan approval | Transaksi dapat ditelusuri dan forecast benar. |
| 7 | Dashboard dan laporan | Ringkasan cocok dengan data sumber. |
| 8 | Reminder | Pengingat terjadwal aman dicoba ulang. |
| 9 | AI | Jawaban memakai data berizin dan referensi sumber. |
| 10 | Pilot dan kesiapan produksi | Flow penting, pemulihan, serta monitoring terverifikasi. |

Durasi belum ditetapkan. Estimasi dibuat setelah ukuran tim, tingkat pengalaman, prioritas, dan kedalaman setiap fitur diketahui.

## 15. Checklist rilis MVP

- [ ] Login, pemulihan akses, dan undangan berfungsi.
- [ ] Workspace dan proyek terisolasi dengan pengujian backend.
- [ ] Role serta izin finance diterapkan di server.
- [ ] Waterfall dan Scrum dapat digunakan end-to-end.
- [ ] Task, komentar, blocker, dan milestone berfungsi.
- [ ] Budget, actual, komitmen, dan forecast dapat direkonsiliasi.
- [ ] Approval dan revisi baseline mempunyai audit trail.
- [ ] File privat menggunakan pemeriksaan akses dan tautan berumur terbatas bila diperlukan.
- [ ] Reminder menghormati timezone, preferensi, dan deduplikasi.
- [ ] Chatbot menggunakan sumber data berizin dan memiliki batas penggunaan.
- [ ] Alur utama tetap berjalan saat AI gagal.
- [ ] Error penting, job gagal, dan biaya layanan dapat dipantau.
- [ ] Backup sudah diuji pemulihannya.
- [ ] Pilot pengguna selesai dan masalah penghambat telah diperbaiki.

## 16. Keputusan yang perlu ditentukan sebelum implementasi

1. Lokasi repository/folder produk baru.
2. Apakah sistem untuk organisasi internal atau produk SaaS banyak pelanggan.
3. Jumlah pengguna dan proyek aktif yang menjadi target awal.
4. Pihak yang berwenang menyetujui budget dan perubahan scope.
5. Aturan pengakuan biaya, pajak, mata uang, serta pembulatan.
6. Apakah timesheet dibutuhkan sejak awal atau setelah MVP.
7. Budget bulanan hosting, email, storage, background jobs, dan AI.
8. Kebutuhan lokasi penyimpanan data, retensi, dan kebijakan penggunaan provider AI.

Keputusan ini tidak menghalangi pembuatan wireframe dan backlog, tetapi harus dijawab sebelum fitur terkait dikunci untuk produksi.

## 17. Referensi teknis

Dokumentasi dapat berubah. Verifikasi versi dan kompatibilitas pada saat implementasi.

- Next.js: https://nextjs.org/docs/app
- shadcn/ui: https://ui.shadcn.com/docs
- PostgreSQL numeric types: https://www.postgresql.org/docs/current/datatype-numeric.html
- Prisma ORM: https://www.prisma.io/docs/orm
- Better Auth: https://better-auth.com/docs/introduction
- Trigger.dev: https://trigger.dev/docs/introduction
- Vercel AI SDK: https://ai-sdk.dev/docs/introduction

Dokumen ini mendefinisikan arah produk dan urutan pembangunan. Pemilihan vendor, versi paket, estimasi durasi, biaya aktual, serta validasi merek Laras masih perlu dilakukan sebelum peluncuran.
