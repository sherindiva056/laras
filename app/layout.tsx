import '@fontsource-variable/manrope';
import type { Metadata } from 'next'; import './globals.css'; export const metadata: Metadata = { title: 'Laras — Workspace', icons: { icon: '/brand/laras-symbol.svg', apple: '/brand/laras-symbol.png' } }; export default function Layout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang='id'><body>{children}</body></html>; }
