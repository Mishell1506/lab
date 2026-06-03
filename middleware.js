import { NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/home', '/registro', '/listado', '/buscar'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isProtected) {
    const userId = request.cookies.get('userId');

    // No cookie = not authenticated → redirect to login
    if (!userId?.value) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Add no-cache headers so browser back button won't show stale pages after logout
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home', '/registro', '/listado', '/buscar'],
};
