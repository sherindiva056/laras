import type { Metadata } from 'next';
import Verification from '../../laras/verification';
export const metadata: Metadata = {title:'Preview verifikasi email — Laras',robots:{index:false,follow:false}};
export default function Page(){return <Verification preview/>;}
