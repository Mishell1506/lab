import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Gestor de Tickets · SoporteApp',
  description: 'Gestor de incidencias y tickets de soporte técnico',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
