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
    <html lang="es" className="h-full bg-slate-100 print:bg-white print:h-auto">
      <body className="h-full flex overflow-hidden text-slate-800 antialiased font-sans print:overflow-visible print:h-auto print:block print:bg-white">
        <div className="print:hidden flex shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden print:overflow-visible print:h-auto print:block">
          <div className="print:hidden">
            <Navbar />
          </div>
          <main className="flex-1 overflow-y-auto p-6 bg-slate-50 print:overflow-visible print:h-auto print:p-0 print:bg-white print:m-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
