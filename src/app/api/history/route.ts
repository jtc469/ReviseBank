import { NextResponse } from 'next/server';
import { getAllQuestions } from '@/lib/questions';
import { getAllProgress } from '@/lib/db';

export async function GET() {
  try {
    const questions = getAllQuestions();
    const progress = getAllProgress();
    
    const progressMap = new Map();
    progress.forEach(p => progressMap.set(p.question_id, p));

    const moduleStats: Record<string, any> = {};
    const topicStats: Record<string, any> = {};

    let totalQuestions = questions.length;
    let totalComplete = 0;
    let totalFailed = 0;

    questions.forEach(q => {
      const p = progressMap.get(q.id);
      const status = p ? p.status : 'Unattempted';
      
      if (!moduleStats[q.module]) {
        moduleStats[q.module] = { total: 0, complete: 0, failed: 0 };
      }
      moduleStats[q.module].total++;
      
      const topic = q.topic || 'Uncategorised';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, complete: 0, failed: 0, scores: [] as number[] };
      }
      topicStats[topic].total++;

      if (status === 'Complete') {
        moduleStats[q.module].complete++;
        topicStats[topic].complete++;
        totalComplete++;
        if (p?.score != null) {
          topicStats[topic].scores.push(p.score);
        }
      } else if (status === 'Failed') {
        moduleStats[q.module].failed++;
        topicStats[topic].failed++;
        totalFailed++;
        if (p?.score != null) {
          topicStats[topic].scores.push(p.score);
        }
      }
    });

    // Calculate averages and weakest topics
    const topicSummary = Object.keys(topicStats).map(topic => {
      const stats = topicStats[topic];
      const attempts = stats.complete + stats.failed;
      const avgScore = stats.scores.length > 0 
        ? stats.scores.reduce((a: number, b: number) => a + b, 0) / stats.scores.length 
        : null;
      const successRate = attempts > 0 ? (stats.complete / attempts) * 100 : 0;
      
      return {
        topic,
        attempts,
        successRate,
        avgScore
      };
    }).filter(t => t.attempts > 0);

    topicSummary.sort((a, b) => a.successRate - b.successRate);

    return NextResponse.json({
      overall: {
        totalQuestions,
        totalComplete,
        totalFailed,
        successRate: (totalComplete + totalFailed) > 0 ? (totalComplete / (totalComplete + totalFailed)) * 100 : 0
      },
      moduleStats,
      weakestTopics: topicSummary.slice(0, 5),
      topicProgress: topicSummary
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get history' }, { status: 500 });
  }
}
