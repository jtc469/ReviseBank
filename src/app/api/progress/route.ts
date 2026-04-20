import { NextResponse } from 'next/server';
import { upsertProgress } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question_id, status, score } = body;

    if (!question_id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    upsertProgress(question_id, status, score !== undefined ? score : null);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
