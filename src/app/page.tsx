'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';

export default function Home() {
  const [modules, setModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/modules')
      .then(res => res.json())
      .then(data => {
        setModules(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="page-title">Modules</h1>
      <p className="page-subtitle">Select a module to start revising.</p>

      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <div className="grid grid-cols-2">
          {modules.map(module => (
            <Link key={module} href={`/module/${encodeURIComponent(module)}`}>
              <div className="card card-interactive" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ padding: '0.75rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                    <BookOpen size={24} />
                  </div>
                  <span className="card-title" style={{ margin: 0 }}>{module}</span>
                </div>
                <ChevronRight color="var(--text-secondary)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
