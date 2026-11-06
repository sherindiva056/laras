import type { Metadata } from 'next';
import Account from './account';
export const metadata: Metadata = { title: 'Laras — Selaraskan tim, tuntaskan proyek', description: 'Workspace manajemen proyek, tim, dan budget.' };
export default function Page() { return <Account />; }
