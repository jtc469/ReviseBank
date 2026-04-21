import './globals.css';
import 'katex/dist/katex.min.css';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable}`}>
        <Navbar />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
