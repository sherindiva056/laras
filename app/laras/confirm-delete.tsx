'use client';
import { useEffect, useRef, useState } from 'react';
export default function ConfirmDelete({title,description,onCancel,onConfirm}:{title:string;description:string;onCancel:()=>void;onConfirm:()=>Promise<void>}){
 const ref=useRef<HTMLDialogElement>(null);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{ref.current?.showModal();},[]);
 return <dialog className="lr-dialog lr-confirm" ref={ref} aria-labelledby="delete-title" onCancel={e=>{if(busy)e.preventDefault();else onCancel();}}><h2 id="delete-title">{title}</h2><p>{description}</p>{error&&<p role="alert">{error}</p>}<div className="lr-dialog-actions"><button autoFocus disabled={busy} onClick={onCancel}>Batal</button><button className="lr-danger" disabled={busy} onClick={async()=>{setBusy(true);setError('');try{await onConfirm();onCancel();}catch(err){setError(err instanceof Error?err.message:'Penghapusan gagal. Coba lagi.');}finally{setBusy(false);}}}>{busy?'Menghapus…':'Ya, hapus'}</button></div></dialog>
}
