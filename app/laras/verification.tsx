'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './verification.css';
type State = 'waiting'|'checking'|'success'|'error';
export default function Verification({email,preview=false,onBack}:{email?:string;preview?:boolean;onBack?:()=>void}) {
 const [state,setState]=useState<State>(email||preview?'waiting':'checking');
 const [busy,setBusy]=useState(false);const [notice,setNotice]=useState('');const [cooldown,setCooldown]=useState(0);
 const verification=useRef<Promise<boolean>|null>(null);
 useEffect(()=>{if(!cooldown)return;const timer=setTimeout(()=>setCooldown(v=>v-1),1000);return()=>clearTimeout(timer);},[cooldown]);
 useEffect(()=>{
  if(email||preview)return;
  let active=true;
  if(!verification.current) verification.current=(async()=>{
   if(!supabase)return false;
   const params=new URLSearchParams(window.location.search);const hash=new URLSearchParams(window.location.hash.slice(1));
   if(params.has('error')||hash.has('error'))return false;
   const code=params.get('code');
   if(code){const result=await supabase.auth.exchangeCodeForSession(code);if(result.error)return false;}
   // getUser waits for supabase-js to initialize and process an implicit-flow callback.
   const {data,error}=await supabase.auth.getUser();
   return !error&&Boolean(data.user?.email_confirmed_at);
  })();
  verification.current.then(ok=>{if(active){setState(ok?'success':'error');window.history.replaceState({},'',window.location.pathname);}}).catch(()=>{if(active){setState('error');window.history.replaceState({},'',window.location.pathname);}});
  return()=>{active=false;};
 },[email,preview]);
 const content={waiting:{title:'Cek kotak masukmu.',description:'Satu langkah lagi untuk memulai. Klik tombol verifikasi pada email yang kami kirimkan.',label:'KONFIRMASI AKUN'},checking:{title:'Memverifikasi email…',description:'Sebentar, kami sedang memeriksa konfirmasi akunmu.',label:'MEMERIKSA AKUN'},success:{title:'Email terverifikasi.',description:'Akunmu siap digunakan. Sekarang kamu bisa mulai mengelola proyek di Laras.',label:'AKUN SIAP DIGUNAKAN'},error:{title:'Tautan belum bisa digunakan.',description:'Tautan mungkin kedaluwarsa, sudah digunakan, atau sesi tidak tersedia. Coba masuk; jika akun belum terkonfirmasi, minta email baru.',label:'VERIFIKASI BELUM SELESAI'}}[state];
 const Icon=state==='success'?Check:state==='error'?TriangleAlert:Mail;
 return <div className="lr-verification"><header><a href="/" aria-label="Beranda Laras"><img src="/brand/laras-logo.svg" alt="Laras" width="129" height="36"/></a><span>WORKSPACE MANAGEMENT</span></header><main><section className="lv-card" aria-labelledby="verification-title"><div className={`lv-icon ${state}`}><Icon size={29} strokeWidth={1.6}/></div><div className="lv-overline">{content.label}</div><h1 id="verification-title">{content.title}</h1><p role="status">{content.description}</p>{(email||preview)&&state==='waiting'&&<div className="lv-address"><Mail size={16}/>{email||'sherin@example.com'}</div>}{state==='waiting'&&<><div className="lv-steps"><span><Check size={13}/>Akun dibuat</span><i/><span className="current">2. Verifikasi email</span><i/><span>3. Mulai bekerja</span></div><button className="lv-primary" disabled={busy||cooldown>0} onClick={async()=>{
 if(preview){setNotice('Preview: tidak ada email yang dikirim.');return;}if(!supabase||!email)return;
 setBusy(true);setNotice('');try{const {error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:`${window.location.origin}/auth/verify`}});if(error)throw error;setNotice('Permintaan diproses. Periksa kotak masuk dan folder spam.');setCooldown(60);}catch{setNotice('Email belum dapat dikirim. Tunggu sebentar lalu coba lagi.');setCooldown(30);}finally{setBusy(false);}
 }}>{busy?'Mengirim…':cooldown?`Coba lagi dalam ${cooldown} detik`:'Kirim ulang email'}<ArrowRight size={16}/></button><small>Belum menerima email? Periksa folder spam atau promosi.</small></>}{state==='success'&&<a className="lv-primary" href="/laras">Buka workspace<ArrowRight size={16}/></a>}{state==='error'&&<a className="lv-primary" href="/login">Kembali ke halaman masuk<ArrowRight size={16}/></a>}{notice&&<div className="lv-notice" role="status">{notice}</div>}{onBack?<button className="lv-back" onClick={onBack}>Kembali ke halaman masuk</button>:state==='waiting'&&<a className="lv-back" href="/login">Kembali ke halaman masuk</a>}<div className="lv-security"><ShieldCheck size={15}/>Akses akun dilindungi dengan verifikasi email.</div></section><div className="lv-caption">Lebih teratur. Lebih terhubung. Lebih selaras.</div>{preview&&<nav className="lv-preview" aria-label="Preview status verifikasi"><span>Preview dokumentasi · simulasi</span>{(['waiting','checking','success','error'] as State[]).map(s=><button key={s} aria-pressed={state===s} onClick={()=>{setState(s);setNotice('');}}>{{waiting:'Menunggu',checking:'Memeriksa',success:'Berhasil',error:'Gagal'}[s]}</button>)}</nav>}</main><footer>© Laras · Selaraskan tim, tuntaskan proyek.</footer></div>;
}
