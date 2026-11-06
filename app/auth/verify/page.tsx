import type { Metadata } from 'next';
import Verification from '../../laras/verification';
export const metadata: Metadata = {title:'Verifikasi email — Laras',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function Page(){return <Verification/>;}
