import { NextResponse } from 'next/server';
import { getModules } from '@/lib/questions';

export async function GET() {
  try {
    const modules = getModules();
    return NextResponse.json(modules);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get modules' }, { status: 500 });
  }
}
