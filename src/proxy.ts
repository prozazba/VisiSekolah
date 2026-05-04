import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || 'visisekolah.id';

  // Define allowed domains (including localhost for development)
  const allowedDomains = ['visisekolah.id', 'localhost:3000'];
  
  // Extract subdomain
  let subdomain = '';
  if (hostname.includes('.visisekolah.id')) {
    subdomain = hostname.replace('.visisekolah.id', '');
  } else if (hostname.includes('.localhost:3000')) {
    subdomain = hostname.replace('.localhost:3000', '');
  }

  // Case 1: Main landing page (visisekolah.id)
  if (!subdomain || allowedDomains.includes(hostname)) {
    return NextResponse.next();
  }

  // Case 2: Super Admin (admin.visisekolah.id)
  if (subdomain === 'admin') {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}${url.search}`, req.url));
  }

  // Case 3: School Tenants ([school-slug].visisekolah.id)
  // Rewrite to /_sites/[subdomain]/...
  return NextResponse.rewrite(new URL(`/_sites/${subdomain}${url.pathname}${url.search}`, req.url));
}
