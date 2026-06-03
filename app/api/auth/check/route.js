import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

// GET /api/auth/check — Lightweight endpoint to verify session
export async function GET() {
  const user = await getAuthUser();

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user: { id: user.id, username: user.username } });
}
