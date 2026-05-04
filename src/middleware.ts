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
  const hostname = req.headers.get('host') || '';

  // 1. Skip middleware for root main domains (No rewrite needed)
  const mainDomains = ['visisekolah.id', 'visi-sekolah.vercel.app', 'localhost:3099'];
  if (mainDomains.includes(hostname) || hostname === '') {
    return NextResponse.next();
  }

  // 2. Subdomain Extraction
  let subdomain = '';
  if (hostname.endsWith('.visisekolah.id')) {
    subdomain = hostname.replace('.visisekolah.id', '');
  } else if (hostname.endsWith('.localhost:3099')) {
    subdomain = hostname.replace('.localhost:3099', '');
  } else if (hostname.endsWith('.vercel.app')) {
    // For Vercel previews: school.visi-sekolah.vercel.app
    const base = 'visi-sekolah.vercel.app';
    if (hostname.endsWith(`.${base}`)) {
      subdomain = hostname.replace(`.${base}`, '');
    }
  }

  // 3. Routing Logic
  if (subdomain === 'admin') {
    return NextResponse.rewrite(new URL(`/admin${url.pathname}${url.search}`, req.url));
  }

  if (subdomain) {
    return NextResponse.rewrite(new URL(`/_sites/${subdomain}${url.pathname}${url.search}`, req.url));
  }

  return NextResponse.next();
}
