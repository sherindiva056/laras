import '@fontsource-variable/plus-jakarta-sans';
import type { Metadata } from 'next'; import './globals.css'; export const metadata: Metadata = { title: 'Laras — Workspace' }; export default function Layout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang='id'><body>{children}</body></html>; }
