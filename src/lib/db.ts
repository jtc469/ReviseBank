import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'progress.db');

let db: Database.Database;

try {
  db = new Database(dbPath);
  
  // Initialize table
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS progress (
      question_id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      score INTEGER,
      attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
} catch (error) {
  console.error('Failed to initialize database:', error);
}

export interface ProgressRecord {
  question_id: string;
  status: string; // 'Complete', 'Failed', 'Unattempted'
  score: number | null;
  attempted_at: string;
}

export function getProgress(questionId: string): ProgressRecord | undefined {
  if (!db) return undefined;
  const stmt = db.prepare('SELECT * FROM progress WHERE question_id = ?');
  return stmt.get(questionId) as ProgressRecord | undefined;
}

export function getAllProgress(): ProgressRecord[] {
  if (!db) return [];
  const stmt = db.prepare('SELECT * FROM progress');
  return stmt.all() as ProgressRecord[];
}

export function upsertProgress(questionId: string, status: string, score: number | null) {
  if (!db) return;
  const stmt = db.prepare(`
    INSERT INTO progress (question_id, status, score, attempted_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(question_id) DO UPDATE SET
      status = excluded.status,
      score = excluded.score,
      attempted_at = CURRENT_TIMESTAMP
  `);
  stmt.run(questionId, status, score);
}
