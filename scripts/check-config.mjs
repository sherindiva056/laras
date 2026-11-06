import fs from 'node:fs';
const env = { ...process.env };
for (const file of ['.env', '.env.local']) {
 if (!fs.existsSync(file)) continue;
 for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
 }
}
const groups = {
 'Supabase (database dan login)': ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'],
 'AI (provider perlu dipilih)': ['AI_API_KEY','AI_MODEL'],
 'Email': ['EMAIL_API_KEY','EMAIL_FROM'],
 'Background jobs': ['TRIGGER_SECRET_KEY'],
};
for (const [name, keys] of Object.entries(groups)) {
 const missing = keys.filter(k => !env[k] || env[k].startsWith('your-'));
 console.log(`${name}: ${missing.length ? 'BELUM — '+missing.join(', ') : 'ENV TERISI (koneksi belum diuji)'}`);
}
console.log('Pemeriksaan ini tidak menampilkan secret dan tidak menyatakan integrasi sudah berjalan.');
