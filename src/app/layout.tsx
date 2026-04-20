import './globals.css';
import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export const metadata = {
  title: 'ReviseBank',
  description: 'Past paper question bank',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={24} />
            ReviseBank
          </Link>
          <div className="navbar-links">
            <Link href="/">Modules</Link>
            <Link href="/history">History</Link>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
