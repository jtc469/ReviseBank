'use client';

import { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading history...</div>;

  return (
    <div>
      <h1 className="page-title">History & Dashboard</h1>
      <p className="page-subtitle">Track your revision progress across all modules.</p>

      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-title">Questions Attempted</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {stats.overall.totalComplete + stats.overall.totalFailed} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {stats.overall.totalQuestions}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Completed</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--success)' }}>
            {stats.overall.totalComplete}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Success Rate</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {stats.overall.successRate.toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        {/* Bar Chart: Progress by Module */}
        <div className="card">
          <h2 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Progress by Module</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
            {Object.entries(stats.moduleStats).map(([module, data]: [string, any]) => {
              const rate = data.total > 0 ? (data.complete / data.total) * 100 : 0;
              const shortModule = module.length > 12 ? module.substring(0, 10) + '...' : module;
              return (
                <div key={module} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rate.toFixed(0)}%</div>
                  <div style={{ width: '100%', maxWidth: '30px', backgroundColor: 'var(--accent)', height: `${rate}%`, minHeight: '4px', borderRadius: '2px 2px 0 0' }}></div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
             {Object.keys(stats.moduleStats).map((module: string) => (
                <div key={module} style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {module.length > 10 ? module.substring(0, 8) + '...' : module}
                </div>
             ))}
          </div>
        </div>

        {/* Pie Chart: Overall Question Status */}
        <div className="card">
          <h2 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Overall Question Status</h2>
          {(() => {
            const total = stats.overall.totalQuestions || 1;
            const comp = stats.overall.totalComplete || 0;
            const fail = stats.overall.totalFailed || 0;
            const unattempted = total - comp - fail;
            const compPct = (comp / total) * 100;
            const failPct = (fail / total) * 100;
            
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', height: '180px' }}>
                <div style={{ 
                  width: '140px', 
                  height: '140px', 
                  borderRadius: '50%', 
                  background: `conic-gradient(var(--accent) 0% ${compPct}%, #9ca3af ${compPct}% ${compPct + failPct}%, var(--bg-surface-hover) ${compPct + failPct}% 100%)`,
                  border: '1px solid var(--border-color)',
                  flexShrink: 0
                }}></div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--accent)', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>Completed <span style={{ color: 'var(--text-secondary)' }}>({comp})</span></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: '#9ca3af', borderRadius: '2px' }}></div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>Attempted <span style={{ color: 'var(--text-secondary)' }}>({fail})</span></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '2px', border: '1px solid var(--border-color)' }}></div>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>Unattempted <span style={{ color: 'var(--text-secondary)' }}>({unattempted})</span></span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Weakest Topics</h2>
      <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
        {stats.weakestTopics.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Not enough data yet.</p>
        ) : (
          stats.weakestTopics.map((topic: any) => (
            <div key={topic.topic} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{topic.topic}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{topic.attempts} attempts</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: topic.successRate < 50 ? 'var(--danger)' : 'var(--success)' }}>
                  {topic.successRate.toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>success</div>
              </div>
            </div>
          ))
        )}
      </div>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Module Progress</h2>
      <div className="grid grid-cols-2">
        {Object.entries(stats.moduleStats).map(([module, data]: [string, any]) => {
          const attempts = data.complete + data.failed;
          const rate = data.total > 0 ? (attempts / data.total) * 100 : 0;
          return (
            <div key={module} className="card">
              <div className="card-title" style={{ fontSize: '1rem' }}>{module}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>{attempts} / {data.total} attempted</span>
                <span>{rate.toFixed(0)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${rate}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
