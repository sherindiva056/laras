'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleCheck, FolderKanban, LayoutDashboard, Leaf, ListTodo, Plus, Search, Sparkles, Users, Wallet, X } from 'lucide-react';
import './workspace.css';
import Modules from './modules';
import { supabase } from '../../lib/supabase';

type Project = { id: string; name: string; description: string; method: string; budget: number; spent: number; color: string };
type Task = { id: string; name: string; project: string; owner: string; status: string; priority: string; date: string };
const initialProjects: Project[] = [
  { id: 'p1', name: 'Website company profile', description: 'Desain dan pengembangan website perusahaan.', method: 'Scrum', budget: 45000000, spent: 28500000, color: 'sage' },
  { id: 'p2', name: 'Aplikasi HR internal', description: 'Sistem pengelolaan karyawan dan operasional.', method: 'Waterfall', budget: 80000000, spent: 32000000, color: 'peach' },
  { id: 'p3', name: 'Customer portal', description: 'Portal akun dan layanan pelanggan.', method: 'Scrum', budget: 60000000, spent: 12000000, color: 'violet' },
];
const initialTasks: Task[] = [
  { id: 't1', name: 'Review desain halaman utama', project: 'p1', owner: 'Sherin', status: 'Review', priority: 'Tinggi', date: '2026-11-04' },
  { id: 't2', name: 'Integrasi API autentikasi', project: 'p3', owner: 'Raka', status: 'Dikerjakan', priority: 'Tinggi', date: '2026-11-05' },
  { id: 't3', name: 'Finalisasi dokumen requirement', project: 'p2', owner: 'Nadia', status: 'Dikerjakan', priority: 'Sedang', date: '2026-11-06' },
  { id: 't4', name: 'Susun komponen design system', project: 'p1', owner: 'Dimas', status: 'Selesai', priority: 'Sedang', date: '2026-11-03' },
  { id: 't5', name: 'Pengujian alur registrasi', project: 'p3', owner: 'Sherin', status: 'Direncanakan', priority: 'Sedang', date: '2026-11-09' },
  { id: 't6', name: 'Implementasi halaman tentang kami', project: 'p1', owner: 'Raka', status: 'Selesai', priority: 'Rendah', date: '2026-11-03' },
];
const people = ['Sherin', 'Raka', 'Nadia', 'Dimas'];
const statuses = ['Direncanakan', 'Dikerjakan', 'Review', 'Selesai'];
const money = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
const nav = [{ name: 'Overview', icon: LayoutDashboard }, { name: 'Proyek', icon: FolderKanban }, { name: 'Tugas saya', icon: ListTodo }, { name: 'Budget', icon: Wallet }, { name: 'Tim', icon: Users }, { name: 'Perencanaan', icon: CalendarDays }, { name: 'Risiko & perubahan', icon: ListTodo }, { name: 'Laporan', icon: FolderKanban }, { name: 'Integrasi', icon: Sparkles }];

export default function Laras({ account }: { account?: {id:string;email:string} }) {
  const displayName = account?.email.split('@')[0] || 'Sherin';
  const members = account ? [displayName] : people;
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState('Overview');
  const [projects, setProjects] = useState<Project[]>(account ? [] : initialProjects);
  const [tasks, setTasks] = useState<Task[]>(account ? [] : initialTasks);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('Semua metode');
  const [selected, setSelected] = useState('all');
  const [modal, setModal] = useState<'project' | 'task' | null>(null);
  const [notice, setNotice] = useState('');
  const [assistant, setAssistant] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (account && supabase) {
      let active = true;
      Promise.all([supabase.from('projects').select('id,name,description,method,budget,spent,color').order('created_at'), supabase.from('tasks').select('id,name,project,owner,status,priority,date').order('created_at')]).then(([p,t]) => {
        if (!active) return;
        if (p.error || t.error) { setNotice('Memuat data gagal. Coba muat ulang: ' + (p.error?.message || t.error?.message)); return; }
        setProjects((p.data || []).map(row => ({...row,budget:Number(row.budget),spent:Number(row.spent)})));
        setTasks(t.data || []); setReady(true);
      }).catch(() => { if(active) setNotice('Koneksi database gagal. Muat ulang untuk mencoba lagi.'); });
      return () => { active = false; };
    }
    try { const saved = localStorage.getItem('laras-demo-v1'); if (saved) { const data = JSON.parse(saved); if (Array.isArray(data.projects) && Array.isArray(data.tasks)) { setProjects(data.projects); setTasks(data.tasks); } } } catch { setNotice('Data demo tidak dapat dibaca.'); }
    setReady(true);
  }, [account?.id]);
  useEffect(() => { if (ready && !account) { try { localStorage.setItem('laras-demo-v1', JSON.stringify({projects,tasks})); } catch { setNotice('Penyimpanan demo tidak tersedia.'); } } }, [projects,tasks,ready,account]);
  useEffect(() => { if (modal) dialog.current?.showModal(); else dialog.current?.close(); }, [modal]);
  const total = projects.reduce((s, p) => s + p.budget, 0);
  const spent = projects.reduce((s, p) => s + p.spent, 0);
  const done = tasks.filter(t => t.status === 'Selesai').length;
  const visibleProjects = projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) && (method === 'Semua metode' || p.method === method));
  const visibleTasks = tasks.filter(t => t.name.toLowerCase().includes(query.toLowerCase()) && (selected === 'all' || t.project === selected) && (page !== 'Tugas saya' || t.owner === displayName));
  async function updateTask(id: string, status: string) {
    if(saving || !ready) return;
    setSaving(true);
    try { if(account && supabase) { const {data,error}=await supabase.from('tasks').update({status}).eq('id',id).select('id').single(); if(error || !data) throw error || new Error('Tugas tidak ditemukan.'); }
      setTasks(current=>current.map(t=>t.id===id?{...t,status}:t));setNotice('Status tugas tersimpan.');
    } catch(err) { setNotice(err instanceof Error ? err.message : 'Penyimpanan gagal.'); } finally { setSaving(false); }
  }
  function navigate(name: string) { setPage(name); setQuery(''); setSelected('all'); }
  const progress = (id: string) => { const list = tasks.filter(t => t.project === id); return list.length ? Math.round(list.filter(t => t.status === 'Selesai').length / list.length * 100) : 0; };
  return <div className="laras-app">
    <aside className="lr-sidebar">
      <a className="lr-logo" href="/laras"><span><Leaf size={25} /></span>laras<span className="lr-logo-dot">.</span></a>
      <div className="lr-workspace"><span className="lr-workspace-icon">S</span><div><strong>{account ? `${displayName}’s workspace` : "Sherin’s workspace"}</strong><small>{account ? "Workspace pribadi" : "Demo workspace"}</small></div></div>
      <div className="lr-nav-label">WORKSPACE</div>
      <nav aria-label="Navigasi utama">{nav.map(({ name, icon: Icon }) => <button key={name} className={page === name ? 'active' : ''} onClick={() => navigate(name)} aria-current={page === name ? 'page' : undefined}><Icon size={19} />{name}{name === 'Tugas saya' && <span className="lr-count">{tasks.filter(t => t.owner === displayName && t.status !== 'Selesai').length}</span>}</button>)}</nav>
      <div className="lr-sidebar-projects"><div className="lr-nav-label">PROYEK AKTIF</div>{projects.slice(0, 4).map(p => <button key={p.id} onClick={() => { setPage('Board proyek'); setSelected(p.id); setQuery(''); }}><i className={p.color} />{p.name}</button>)}</div>
      <div className="lr-sidebar-bottom"><div className="lr-quiet-card"><Leaf size={22} /><strong>Ruang untuk bertumbuh.</strong><p>Satu langkah kecil hari ini, satu tujuan besar bersama.</p></div><div className="lr-profile"><span className="lr-avatar">{displayName.slice(0,2).toUpperCase()}</span><div><strong>{account ? displayName : "Sherin Diva"}</strong><small>{account ? "Workspace pribadi" : "Project Manager · Demo"}</small></div></div></div>
    </aside>
    <div className="lr-main"><header className="lr-topbar"><div>Workspace <ChevronRight size={14} /><strong>{page}</strong></div><div className="lr-top-actions"><span className="lr-demo">{account ? "DATABASE TERHUBUNG" : "DEMO LOKAL"}</span><button aria-label="Lihat pengingat" onClick={() => { setAssistant(!assistant); }}><Bell size={19} /><i /></button><span className="lr-avatar small">{displayName.slice(0,2).toUpperCase()}</span>{account && <button onClick={async()=>{const result=await supabase?.auth.signOut();if(result?.error)setNotice(result.error.message);}}>Keluar</button>}</div></header>
      <main className="lr-content"><div className="lr-heading"><div><div className="lr-eyebrow">SELARASKAN TIM, TUNTASKAN PROYEK</div><h1>{page === 'Overview' ? `Halo, ${displayName}` : page === 'Board proyek' ? projects.find(p => p.id === selected)?.name : page === 'Proyek' ? 'Proyek' : page === 'Budget' ? 'Budget & biaya' : page === 'Tim' ? 'Anggota tim' : 'Workspace'}<span className="lr-heading-dot">.</span></h1><p>{page === 'Overview' ? 'Mari lihat progres tim dan hal yang perlu perhatianmu hari ini.' : 'Kelola pekerjaan, pantau progres, dan koordinasikan tim.'}</p></div><button className="lr-primary" disabled={!ready} onClick={() => setModal(page === 'Tugas saya' || page === 'Board proyek' ? 'task' : 'project')}><Plus size={17} />{page === 'Tugas saya' || page === 'Board proyek' ? 'Tambah tugas' : 'Proyek baru'}</button></div>
      {notice && <div role="status" className="lr-notice">{notice}<button aria-label="Tutup pesan" onClick={() => setNotice('')}><X size={16} /></button></div>}
      {page === 'Overview' && <><div className="lr-metrics">{[{ label: 'Proyek aktif', value: projects.length, icon: FolderKanban, sub: 'Dalam perjalanan menuju tujuan', tone: 'sage' }, { label: 'Tugas selesai', value: `${done}/${tasks.length}`, icon: CircleCheck, sub: `${tasks.length ? Math.round(done / tasks.length * 100) : 0}% dari seluruh tugas`, tone: 'blue' }, { label: 'Total anggaran', value: money(total), icon: Wallet, sub: `${money(total - spent)} belum terpakai`, tone: 'peach' }, { label: 'Anggota tim', value: members.length.toString().padStart(2, '0'), icon: Users, sub: 'Berkolaborasi di workspace', tone: 'violet' }].map(m => <article className="lr-metric" key={m.label}><div><span>{m.label}</span><span className={`lr-icon ${m.tone}`}><m.icon size={19} /></span></div><strong>{m.value}</strong><small>{m.sub}</small></article>)}</div><div className="lr-insight"><span className="lr-insight-icon"><Sparkles size={22} /></span><div><strong>Review yang perlu perhatian</strong><p>{tasks.filter(t => t.status === 'Review').length} tugas menunggu review. Selesaikan review untuk membantu tim melanjutkan pekerjaan.</p></div><button onClick={() => setAssistant(!assistant)}>Lihat ringkasan <ArrowUpRight size={17} /></button></div></>}
      {(page === 'Overview' || page === 'Proyek') && <section><div className="lr-section-heading"><h2>Proyek aktif <span>{projects.length}</span></h2>{page === 'Overview' ? <button onClick={() => navigate('Proyek')}>Semua proyek <ArrowUpRight size={16} /></button> : <select aria-label="Filter metode" value={method} onChange={e => setMethod(e.target.value)}><option>Semua metode</option><option>Scrum</option><option>Waterfall</option></select>}</div>{page === 'Proyek' && <label className="lr-search"><Search size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari proyek…" /></label>}<div className="lr-project-grid">{visibleProjects.map(p => <button className="lr-project" key={p.id} onClick={() => { setPage('Board proyek'); setSelected(p.id); setQuery(''); }}><div className="lr-project-top"><span className={`lr-project-icon ${p.color}`}><FolderKanban size={23} /></span><span className="lr-tag">{p.method}</span><ArrowUpRight size={17} /></div><h3>{p.name}</h3><p>{p.description}</p><div className="lr-progress-label"><span>Progres tugas</span><strong>{progress(p.id)}%</strong></div><div className="lr-progress"><div style={{ width: `${progress(p.id)}%` }} /></div><div className="lr-project-foot"><div className="lr-avatar-stack">{members.slice(0, 3).map((person, i) => <span key={person} className={`lr-avatar a${i}`}>{person.slice(0, 1)}</span>)}</div><span>{tasks.filter(t => t.project === p.id).length} tugas <ChevronRight size={14} /></span></div></button>)}</div>{!visibleProjects.length && <p className="lr-empty">Tidak ada proyek yang cocok.</p>}</section>}
      {(page === 'Overview' || page === 'Tugas saya' || page === 'Board proyek') && <div className={page === 'Overview' ? 'lr-bottom-grid' : ''}><section className="lr-panel"><div className="lr-section-heading"><h2>{page === 'Overview' ? 'Prioritas tim' : 'Board tugas'}</h2><button onClick={() => setModal('task')}><Plus size={16} /> Tambah tugas</button></div><div className="lr-task-toolbar"><label className="lr-search"><Search size={16} /><input placeholder="Cari tugas…" value={query} onChange={e => setQuery(e.target.value)} /></label><span>{visibleTasks.length} tugas</span></div><div className="lr-task-list">{visibleTasks.map(t => <article className="lr-task" key={t.id}><button className={`lr-check ${t.status === 'Selesai' ? 'checked' : ''}`} aria-label={`${t.status === 'Selesai' ? 'Buka kembali' : 'Selesaikan'} ${t.name}`} disabled={saving || !ready} onClick={() => updateTask(t.id, t.status === 'Selesai' ? 'Direncanakan' : 'Selesai')}>{t.status === 'Selesai' && <Check size={13} />}</button><div className="lr-task-name"><strong>{t.name}</strong><small>{projects.find(p => p.id === t.project)?.name} · {t.owner}</small></div><span className={`lr-priority ${t.priority === 'Tinggi' ? 'high' : ''}`}>{t.priority}</span><select disabled={saving || !ready} aria-label={`Status ${t.name}`} value={t.status} onChange={e => updateTask(t.id, e.target.value)}>{statuses.map(s => <option key={s}>{s}</option>)}</select></article>)}{!visibleTasks.length && <p className="lr-empty">Belum ada tugas. Tambahkan pekerjaan pertamamu.</p>}</div></section>{page === 'Overview' && <aside className="lr-budget-card"><div className="lr-section-heading"><h2>Ringkasan budget</h2><Wallet size={18} /></div><div className="lr-donut" style={{ '--usage': `${total ? Math.min(100, spent / total * 100) : 0}%` } as React.CSSProperties}><div><strong>{total ? Math.round(spent / total * 100) : 0}%</strong><span>terpakai</span></div></div><div className="lr-budget-line"><span><i />Realisasi biaya</span><strong>{money(spent)}</strong></div><div className="lr-budget-line"><span><i />Sisa anggaran</span><strong>{money(total - spent)}</strong></div><button onClick={() => navigate('Budget')}>Lihat detail anggaran <ArrowUpRight size={16} /></button></aside>}</div>}
      {page === 'Budget' && <section className="lr-panel"><div className="lr-section-heading"><h2>Alokasi per proyek</h2><span>{account ? "Budget proyek · IDR" : "Contoh biaya · IDR"}</span></div>{projects.map(p => <article className="lr-finance" key={p.id}><div><h3>{p.name}</h3><small>{p.method}</small></div><div><small>Anggaran</small><strong>{money(p.budget)}</strong></div><div><small>Actual cost</small><strong>{money(p.spent)}</strong></div><div><small>Sisa anggaran</small><strong>{money(p.budget - p.spent)}</strong></div></article>)}<p className="lr-footnote">Angka demo untuk eksplorasi tampilan. Pencatatan transaksi, komitmen, dan approval belum terhubung.</p></section>}
      {page === 'Tim' && <div className="lr-project-grid">{members.map((person, i) => <article className="lr-person" key={person}><span className={`lr-avatar a${i % 3}`}>{person[0]}</span><h3>{person}</h3><p>{['Project Manager', 'Developer', 'Business Analyst', 'UI/UX Designer'][i]}</p><div><strong>{tasks.filter(t => t.owner === person && t.status !== 'Selesai').length}</strong> tugas aktif</div></article>)}</div>}
      <Modules key={account?.id || "demo"} page={page} projects={projects} tasks={tasks} cloud={Boolean(account)} /><div className="lr-footer"><Leaf size={14} /><span>Ruang kerja yang selaras.</span><span>{account ? "Proyek dan tugas tersimpan di Supabase" : "Data contoh · Tersimpan di browser ini"}</span></div>
    </main></div>
    {assistant && <aside className="lr-assistant" aria-label="Ringkasan workspace"><div className="lr-section-heading"><h2><Sparkles size={19} /> Asisten Laras</h2><button aria-label="Tutup asisten" onClick={() => setAssistant(false)}><X size={20} /></button></div><span className="lr-demo">PRATINJAU · BELUM TERHUBUNG AI</span><h3>Ini fokus tim saat ini.</h3><p>{tasks.filter(t => t.status === 'Review').length} tugas menunggu review dan {tasks.filter(t => t.status === 'Dikerjakan').length} tugas sedang dikerjakan.</p><p>Realisasi biaya contoh adalah {money(spent)} dari anggaran {money(total)}.</p><button className="lr-primary" onClick={() => { navigate('Tugas saya'); setAssistant(false); }}>Buka tugas saya <ArrowUpRight size={16} /></button><small>Ringkasan dihitung langsung dari data demo. Chat AI tersedia setelah integrasi backend.</small></aside>}
    <dialog ref={dialog} className="lr-dialog" onCancel={() => setModal(null)} onClose={() => setModal(null)}><form onSubmit={async e => { e.preventDefault(); if(saving || !ready) return; const form=e.currentTarget; const data = new FormData(form); const name = String(data.get('name') || '').trim(); if (!name) return; setSaving(true); try {
      if (modal === 'project') {
        const project = {id:crypto.randomUUID(),name,description:String(data.get('description') || '').trim(),method:String(data.get('method')),budget:Number(data.get('budget')),spent:0,color:'sage'};
        if(account && supabase){const {error}=await supabase.from('projects').insert(project);if(error)throw error;}
        setProjects(current=>[...current,project]);setNotice('Proyek berhasil disimpan.');
      } else {
        const task = {id:crypto.randomUUID(),name,project:String(data.get('project')),owner:String(data.get('owner')),status:'Direncanakan',priority:String(data.get('priority')),date:String(data.get('date'))};
        if(!projects.some(p=>p.id===task.project))throw new Error('Buat atau pilih proyek terlebih dahulu.');
        if(account && supabase){const {error}=await supabase.from('tasks').insert(task);if(error)throw error;}
        setTasks(current=>[...current,task]);setNotice('Tugas berhasil disimpan.');
      }
      form.reset();setModal(null);
    } catch(err){setNotice(err instanceof Error?err.message:'Gagal menyimpan.');} finally {setSaving(false);} }}><div className="lr-section-heading"><h2>{modal === 'project' ? 'Mulai proyek baru' : 'Tambahkan tugas'}</h2><button type="button" aria-label="Tutup dialog" onClick={() => setModal(null)}><X size={20} /></button></div><p>Isi detail pekerjaan yang ingin disimpan.</p>{notice && <p role="status">{notice}</p>}<label>Nama {modal === 'project' ? 'proyek' : 'tugas'}<input name="name" required maxLength={100} placeholder="Apa yang ingin kamu kerjakan?" /></label>{modal === 'project' ? <><label>Deskripsi<textarea name="description" maxLength={240} placeholder="Ceritakan tujuan proyek ini" /></label><label>Metode<select name="method"><option>Scrum</option><option>Waterfall</option></select></label><label>Anggaran (Rp)<input name="budget" type="number" min="0" max="1000000000000" step="1" defaultValue="0" required /></label></> : <><label>Proyek<select name="project" defaultValue={selected !== 'all' ? selected : projects[0]?.id}>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Penanggung jawab<select name="owner">{members.map(p => <option key={p}>{p}</option>)}</select></label><div className="lr-form-row"><label>Prioritas<select name="priority"><option>Sedang</option><option>Tinggi</option><option>Rendah</option></select></label><label>Deadline<input type="date" name="date" required /></label></div></>}<div className="lr-dialog-actions"><button type="button" onClick={() => setModal(null)}>Batal</button><button className="lr-primary" type="submit" disabled={saving || !ready}>{modal === 'project' ? 'Buat proyek' : 'Simpan tugas'}<ArrowUpRight size={16} /></button></div></form></dialog>
  </div>;
}
