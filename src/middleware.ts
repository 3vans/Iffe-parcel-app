
import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      // Not logged in, redirect to home (login modal can be triggered there)
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    // @ts-expect-error Custom property role
    if (token.role !== 'admin') {
      // Logged in but not an admin, redirect to home or an unauthorized page
      const url = req.nextUrl.clone();
      url.pathname = '/'; // Or a dedicated /unauthorized page
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
