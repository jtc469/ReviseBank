'use client';

import { useEffect, useState, useMemo, use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import FilterBar from '@/components/FilterBar';

export default function ModulePage(props: { params: Promise<{ module: string }> }) {
  const params = use(props.params);
  const decodedModule = decodeURIComponent(params.module);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [year, setYear] = useState('All');
  const [topic, setTopic] = useState('All');
  const [status, setStatus] = useState('All');

  const fetchQuestions = () => {
    setLoading(true);
    let url = `/api/questions?module=${encodeURIComponent(decodedModule)}`;
    if (year !== 'All') url += `&year=${year}`;
    if (topic !== 'All') url += `&topic=${encodeURIComponent(topic)}`;
    if (status !== 'All') url += `&status=${status}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, [decodedModule, year, topic, status]);

  const handleStatusChange = async (id: string, newStatus: string, score: number | null) => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: id, status: newStatus, score }),
    });
    // Optimistic update
    setQuestions(questions.map(q => q.id === id ? { ...q, status: newStatus, score } : q));
  };

  // Derive filter options from the current module's questions
  // We need to fetch ALL questions for this module to get the filter options, 
  // but since our API returns filtered questions, we need to extract them from a separate call or locally.
  // For simplicity, we can just extract from the currently fetched questions, but that reduces options when filtered.
  // Better approach: fetch all questions for the module once, then filter locally, OR fetch filter options separately.
  // Let's filter locally for a better UX.
  
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  useEffect(() => {
    fetch(`/api/questions?module=${encodeURIComponent(decodedModule)}`)
      .then(res => res.json())
      .then(data => setAllQuestions(data));
  }, [decodedModule]);

  const years = useMemo(() => {
    const y = new Set(allQuestions.map(q => q.year ? q.year.toString() : 'N/A'));
    return Array.from(y).sort().reverse();
  }, [allQuestions]);

  const topics = useMemo(() => {
    const t = new Set(allQuestions.map(q => q.topic || 'Uncategorised'));
    return Array.from(t).sort();
  }, [allQuestions]);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchYear = year === 'All' || (q.year ? q.year.toString() : 'N/A') === year;
      const matchTopic = topic === 'All' || (q.topic || 'Uncategorised') === topic;
      const matchStatus = status === 'All' || q.status === status;
      return matchYear && matchTopic && matchStatus;
    });
  }, [allQuestions, year, topic, status]);

  return (
    <div>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        <ArrowLeft size={20} /> Back to Modules
      </Link>
      
      <h1 className="page-title">{decodedModule}</h1>
      <p className="page-subtitle">Practice questions and track your progress.</p>

      <FilterBar 
        years={years}
        topics={topics}
        selectedYear={year}
        selectedTopic={topic}
        selectedStatus={status}
        onYearChange={setYear}
        onTopicChange={setTopic}
        onStatusChange={setStatus}
      />

      <div className="grid">
        {filteredQuestions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
            No questions match your filters.
          </div>
        ) : (
          filteredQuestions.map(q => (
            <QuestionCard key={q.id} question={q} onStatusChange={(id, newStatus, score) => {
              // Update server
              fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question_id: id, status: newStatus, score }),
              });
              // Update local state
              setAllQuestions(allQuestions.map(aq => aq.id === id ? { ...aq, status: newStatus, score } : aq));
            }} />
          ))
        )}
      </div>
    </div>
  );
}
