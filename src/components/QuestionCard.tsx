'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface QuestionCardProps {
  question: {
    id: string;
    year: number;
    paper: string;
    question_number: number;
    question_text: string;
    topic?: string;
    status: string;
    score: number | null;
  };
  onStatusChange: (id: string, status: string, score: number | null) => void;
}

export default function QuestionCard({ question, onStatusChange }: QuestionCardProps) {
  const [score, setScore] = React.useState(question.score !== null ? question.score.toString() : '');

  // Render text and math properly
  // Since the text has mixed text and LaTeX like \n\\[...\\] and $...$, we should ideally parse it.
  // For MVP, we can split by \\[ and \\] or $ and $. 
  // An easier way is just passing the whole string to TeX if we use math mode, but it's mixed.
  // Let's implement a simple parser for $...$ and \\[...\\]
  
  const renderContent = (text: string) => {
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$|\\\[.*?\\\])/gs);
    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // @ts-ignore
        return <BlockMath key={index} math={part.slice(2, -2)} />;
      } else if (part.startsWith('\\[') && part.endsWith('\\]')) {
        // @ts-ignore
        return <BlockMath key={index} math={part.slice(2, -2)} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // @ts-ignore
        return <InlineMath key={index} math={part.slice(1, -1)} />;
      }
      return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
    });
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(e.target.value);
  };

  const saveScore = () => {
    const numericScore = score === '' ? null : parseInt(score, 10);
    onStatusChange(question.id, question.status, numericScore);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 className="card-title">Q{question.question_number} ({question.year})</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Topic: {question.topic}</p>
        </div>
        <div>
          {question.status === 'Complete' && <span className="badge badge-success">Complete</span>}
          {question.status === 'Failed' && <span className="badge badge-danger">Failed</span>}
          {question.status === 'Unattempted' && <span className="badge badge-outline">Unattempted</span>}
        </div>
      </div>
      
      <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {renderContent(question.question_text)}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-success" 
            onClick={() => onStatusChange(question.id, 'Complete', question.score)}
          >
            Mark Complete
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => onStatusChange(question.id, 'Failed', question.score)}
          >
            Mark Failed
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => onStatusChange(question.id, 'Unattempted', null)}
          >
            Reset
          </button>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Score:</label>
          <input 
            type="number" 
            className="input" 
            style={{ width: '80px', padding: '0.5rem' }} 
            value={score} 
            onChange={handleScoreChange}
            onBlur={saveScore}
            placeholder="%"
          />
        </div>
      </div>
    </div>
  );
}
