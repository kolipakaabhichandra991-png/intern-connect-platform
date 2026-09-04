import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "super-secret-prototype-key-do-not-use-in-prod" });
  const { pathname } = req.nextUrl;

  // Protect Admin Dashboard
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/analytics') || pathname.startsWith('/reports')) {
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect Intern Panel
  if (pathname.startsWith('/intern-panel') || pathname.match(/^\/intern-/)) {
    if (!token) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // Note: In a real app, you might check if the intern is trying to access someone else's portal
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/intern-panel/:path*', '/analytics/:path*', '/reports/:path*', '/intern-:path*'],
};
