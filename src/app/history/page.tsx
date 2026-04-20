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
