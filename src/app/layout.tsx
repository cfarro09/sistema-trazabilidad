import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Sistema de Trazabilidad y Licitaciones OSCE | Gestión de Servicios Estatales',
  description:
    'Gestión integral de contrataciones públicas, trazabilidad desde TDR hasta SIAF, acreditación de experiencia y empaquetador de expedientes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full bg-slate-100">
      <body className="h-full flex overflow-hidden text-slate-800 antialiased font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50">{children}</main>
        </div>
      </body>
    </html>
  );
}
