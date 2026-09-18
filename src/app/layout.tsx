import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArogyaKiosk - SIH',
  description: 'AI-Powered Smart Health Kiosk',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#020617',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="bg-slate-950 text-white min-h-full w-full overflow-x-hidden antialiased font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
