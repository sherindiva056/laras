import type { Metadata } from 'next';
import Laras from '../laras/workspace';
export const metadata: Metadata = { title: 'Laras — Preview dokumentasi', robots: { index: false, follow: false } };
export default function Demo(){return <Laras />;}
