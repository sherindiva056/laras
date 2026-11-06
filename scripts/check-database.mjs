import nextEnv from '@next/env';
import { createClient } from '@supabase/supabase-js';
nextEnv.loadEnvConfig(process.cwd(), true);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Konfigurasi Supabase belum lengkap.');
const host = new URL(url).hostname;
if (host !== 'cylkfetuwqvanetmlhxq.supabase.co') throw new Error('Environment tidak mengarah ke project Laras. Periksa konfigurasi tanpa mengubah project lain.');
const settings = await fetch(new URL('/auth/v1/settings', url), { headers: { apikey: key }, signal: AbortSignal.timeout(15000) });
if (!settings.ok) throw new Error(`Koneksi autentikasi gagal: HTTP ${settings.status}.`);
const config = await settings.json();
console.log('Laras: URL dan publishable key berhasil terhubung.');
console.log(`Login email: ${config.external?.email ? 'aktif' : 'tidak aktif'}.`);
console.log(`Konfirmasi email: ${config.mailer_autoconfirm ? 'otomatis' : 'diperlukan'}.`);
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }) } });
for (const table of ['projects', 'tasks']) {
 const { data, error } = await db.from(table).select('id').limit(1);
 if (error && error.code !== '42501') throw new Error(`Pemeriksaan ${table} gagal (${error.code || 'network'}).`);
 if (!error && data?.length) throw new Error(`Data ${table} terbuka tanpa login.`);
 console.log(`${table}: akses tanpa login terlindungi.`);
}
console.log('Koneksi terverifikasi. Uji penyimpanan per akun dilakukan setelah pengguna login. Tidak ada data yang ditulis.');
