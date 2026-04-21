'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Layers, CheckCircle } from 'lucide-react';

interface ModuleStats {
  name: string;
  totalQuestions: number;
  uniqueTopics: number;
  completedCount: number;
}

export default function Home() {
  const [modules, setModules] = useState<ModuleStats[]>([]);
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
      <div className="page-header">
        <h1 className="page-title">Modules</h1>
        <p className="page-subtitle">Select a module to review materials and practice questions.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading modules...</p>
      ) : (
        <div className="grid grid-cols-2">
          {modules.map(module => {
            const progressPct = module.totalQuestions > 0 ? (module.completedCount / module.totalQuestions) * 100 : 0;
            return (
              <Link key={module.name} href={`/module/${encodeURIComponent(module.name)}`}>
                <div className="card card-interactive">
                  <h2 className="card-title line-clamp-2" title={module.name}>{module.name}</h2>
                  
                  <div className="card-meta">
                    <span className="card-meta-item">
                      <BookOpen size={14} />
                      {module.totalQuestions} Questions
                    </span>
                    <span className="card-meta-item">
                      <Layers size={14} />
                      {module.uniqueTopics} Topics
                    </span>
                    {module.completedCount > 0 && (
                      <span className="card-meta-item" style={{ color: 'var(--success)' }}>
                        <CheckCircle size={14} />
                        {module.completedCount} Done
                      </span>
                    )}
                  </div>
                  
                  {module.completedCount > 0 && (
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
