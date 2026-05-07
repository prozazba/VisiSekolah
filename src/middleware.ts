import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // 1. Identify reserved root paths
  const reservedPaths = [
    '/admin',
    '/login',
    '/register',
    '/payment',
    '/api',
    '/dashboard',
    '/features',
    '/pricing',
    '/about',
    '/contact',
  ];

  // 2. Check if the path starts with a reserved segment
  const isReserved = reservedPaths.some(rp => path.startsWith(rp) || path === '/');

  if (isReserved) {
    return NextResponse.next();
  }

  // 3. Extract the first segment as the slug
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0) {
    const slug = segments[0];
    const remainingPath = segments.slice(1).join('/');

    // 4. Rewrite the request to our dynamic tenant handler
    // We rewrite /[slug]/... to /_sites/[slug]/...
    // Note: You need to have the directory src/app/_sites/[site]/... existing
    return NextResponse.rewrite(
      new URL(`/_sites/${slug}/${remainingPath}`, req.url)
    );
  }

  return NextResponse.next();
}
