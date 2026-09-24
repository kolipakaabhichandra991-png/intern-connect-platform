import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This middleware prevents Next.js Turbopack from traversing up the directory tree
// and accidentally picking up the parent project's middleware.ts.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
