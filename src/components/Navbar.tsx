'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Moon, Sun, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  const [palette, setPalette] = useState('classic');
  const [mounted, setMounted] = useState(false);
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedPalette = localStorage.getItem('palette') || 'oxford';
    setTheme(savedTheme);
    setPalette(savedPalette);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-palette', savedPalette);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const changePalette = (newPalette: string) => {
    setPalette(newPalette);
    localStorage.setItem('palette', newPalette);
    document.documentElement.setAttribute('data-palette', newPalette);
    setShowPaletteMenu(false);
  };

  // Determine if we are in a module and extract the module name
  let moduleName = '';
  if (pathname.startsWith('/module/')) {
    moduleName = decodeURIComponent(pathname.replace('/module/', ''));
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link href="/" className="navbar-brand">
          <BookOpen size={22} />
          ReviseBank
        </Link>
      </div>

      <div className="navbar-center">
        {moduleName && <span className="navbar-module-name">{moduleName}</span>}
      </div>

      <div className="navbar-right">
        <div className="navbar-links">
          <Link href="/">Modules</Link>
          <Link href="/history">History</Link>
        </div>

        {mounted && (
          <div className="navbar-actions">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="palette-container">
              <button 
                className="icon-btn" 
                onClick={() => setShowPaletteMenu(!showPaletteMenu)} 
                aria-label="Change palette"
              >
                <Palette size={18} />
              </button>
              {showPaletteMenu && (
                <div className="palette-menu">
                  <button onClick={() => changePalette('oxford')} className={palette === 'oxford' ? 'active' : ''}>Oxford Blue</button>
                  <button onClick={() => changePalette('indigo')} className={palette === 'indigo' ? 'active' : ''}>Deep Indigo</button>
                  <button onClick={() => changePalette('emerald')} className={palette === 'emerald' ? 'active' : ''}>Muted Emerald</button>
                  <button onClick={() => changePalette('burgundy')} className={palette === 'burgundy' ? 'active' : ''}>Burgundy</button>
                  <button onClick={() => changePalette('slate-violet')} className={palette === 'slate-violet' ? 'active' : ''}>Slate Violet</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
