'use client';

import React from 'react';

interface FilterBarProps {
  years: string[];
  topics: string[];
  selectedYear: string;
  selectedTopic: string;
  selectedStatus: string;
  onYearChange: (year: string) => void;
  onTopicChange: (topic: string) => void;
  onStatusChange: (status: string) => void;
}

export default function FilterBar({
  years,
  topics,
  selectedYear,
  selectedTopic,
  selectedStatus,
  onYearChange,
  onTopicChange,
  onStatusChange,
}: FilterBarProps) {
  return (
    <div className="card" style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 200px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</label>
        <select className="input select" value={selectedStatus} onChange={(e) => onStatusChange(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Complete">Complete</option>
          <option value="Failed">Failed</option>
          <option value="Unattempted">Unattempted</option>
        </select>
      </div>

      <div style={{ flex: '1 1 200px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Year</label>
        <select className="input select" value={selectedYear} onChange={(e) => onYearChange(e.target.value)}>
          <option value="All">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div style={{ flex: '1 1 200px' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Topic</label>
        <select className="input select" value={selectedTopic} onChange={(e) => onTopicChange(e.target.value)}>
          <option value="All">All Topics</option>
          {topics.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
