import { NextResponse } from 'next/server';
import { getModulesWithStats, getAllQuestions } from '@/lib/questions';
import { getAllProgress } from '@/lib/db';

export async function GET() {
  try {
    const modules = getModulesWithStats();
    const progress = getAllProgress();
    const questions = getAllQuestions();
    
    // Create a map from question_id to module name
    const qToModule = new Map<string, string>();
    questions.forEach(q => qToModule.set(q.id, q.module));

    // Count completions per module
    const completionsMap = new Map<string, number>();
    progress.forEach(p => {
      if (p.status === 'Complete') {
        const modName = qToModule.get(p.question_id);
        if (modName) {
          completionsMap.set(modName, (completionsMap.get(modName) || 0) + 1);
        }
      }
    });

    const enrichedModules = modules.map(m => ({
      ...m,
      completedCount: completionsMap.get(m.name) || 0
    }));

    return NextResponse.json(enrichedModules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get modules' }, { status: 500 });
  }
}
