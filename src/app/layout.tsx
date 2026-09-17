// @ts-ignore
import './globals.css';

export const metadata = {
  title: 'ArogyaKiosk - SIH',
  description: 'AI-Powered Smart Health Kiosk',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}