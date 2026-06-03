import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function GET(request) {
  await clearAuthCookie();

  // Build absolute URL from the incoming request
  const url = new URL('/', request.url);
  const response = NextResponse.redirect(url);
  
  // Wipe all browser cache, cookies, and storage for security
  response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  
  return response;
}
