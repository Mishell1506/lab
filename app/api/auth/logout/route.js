import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function GET(request) {
  await clearAuthCookie();

  // Build absolute URL from the incoming request
  const url = new URL('/', request.url);
  return NextResponse.redirect(url);
}
