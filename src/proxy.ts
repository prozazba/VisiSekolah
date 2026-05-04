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
  
  // Get hostname from x-forwarded-host (reliable on Vercel) or host header
  const hostname = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';

  // 1. Skip proxy for static files and internal Next.js paths
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') // Simple check for file extensions
  ) {
    return NextResponse.next();
  }

  // 2. Identify the main landing page domains
  const isMainDomain = 
    hostname === 'visisekolah.id' || 
    hostname === 'visi-sekolah.vercel.app' || 
    hostname === 'localhost:3099';

  if (isMainDomain) {
    // Super Admin check on main domain (e.g., visisekolah.id/admin)
    // or handle via dedicated subdomain if preferred.
    return NextResponse.next();
  }

  // 3. Handle Subdomains
  let subdomain = '';
  if (hostname.endsWith('.visisekolah.id')) {
    subdomain = hostname.replace('.visisekolah.id', '');
  } else if (hostname.endsWith('.localhost:3099')) {
    subdomain = hostname.replace('.localhost:3099', '');
  } else if (hostname.endsWith('.vercel.app')) {
    // Support school.visi-sekolah.vercel.app
    const base = 'visi-sekolah.vercel.app';
    if (hostname.endsWith(`.${base}`)) {
      subdomain = hostname.replace(`.${base}`, '');
    }
  }

  // Case 2: Super Admin Subdomain (admin.visisekolah.id)
  if (subdomain === 'admin') {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}${url.search}`, req.url));
  }

  // Case 3: School Tenants ([school-slug].visisekolah.id)
  if (subdomain) {
    return NextResponse.rewrite(new URL(`/_sites/${subdomain}${url.pathname}${url.search}`, req.url));
  }

  // Fallback to main app
  return NextResponse.next();
}
