import fs from 'fs';
import path from 'path';

export interface Question {
  id: string;
  module: string;
  year: number;
  paper: string;
  question_number: number;
  question_text: string;
  source_pdf: string;
  needs_review: boolean;
  topic?: string;
}

let cachedQuestions: Question[] | null = null;

export function getAllQuestions(): Question[] {
  if (cachedQuestions) {
    return cachedQuestions;
  }

  const questionsDir = path.join(process.cwd(), 'structured-questions');
  let files: string[] = [];
  try {
    files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));
  } catch (e) {
    console.error("Could not read structured-questions directory:", e);
    return [];
  }
  
  const questions: Question[] = [];
  for (const file of files) {
    const filePath = path.join(questionsDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content) as Question[];
      parsed.forEach(q => {
        if (!q.topic) {
          q.topic = "Uncategorised";
        }
        questions.push(q);
      });
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }

  cachedQuestions = questions;
  return questions;
}

export function getModules(): string[] {
  const questions = getAllQuestions();
  const modules = new Set<string>();
  questions.forEach(q => modules.add(q.module));
  return Array.from(modules).sort();
}
