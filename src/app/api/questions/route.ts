import { NextResponse } from 'next/server';
import { getAllQuestions, Question } from '@/lib/questions';
import { getAllProgress, ProgressRecord } from '@/lib/db';

export type QuestionWithProgress = Question & {
  status: string;
  score: number | null;
  attempted_at: string | null;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleFilter = searchParams.get('module');
    const yearFilter = searchParams.get('year');
    const topicFilter = searchParams.get('topic');
    const statusFilter = searchParams.get('status');

    let questions = getAllQuestions();
    
    // Apply filters
    if (moduleFilter) {
      questions = questions.filter(q => q.module === moduleFilter);
    }
    if (yearFilter) {
      questions = questions.filter(q => q.year.toString() === yearFilter);
    }
    if (topicFilter) {
      questions = questions.filter(q => q.topic === topicFilter);
    }

    // Join with progress
    const allProgress = getAllProgress();
    const progressMap = new Map<string, ProgressRecord>();
    allProgress.forEach(p => progressMap.set(p.question_id, p));

    let joined: QuestionWithProgress[] = questions.map(q => {
      const p = progressMap.get(q.id);
      return {
        ...q,
        status: p ? p.status : 'Unattempted',
        score: p ? p.score : null,
        attempted_at: p ? p.attempted_at : null
      };
    });

    if (statusFilter && statusFilter !== 'All') {
      joined = joined.filter(q => q.status === statusFilter);
    }

    return NextResponse.json(joined);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get questions' }, { status: 500 });
  }
}
