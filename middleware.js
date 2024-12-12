import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  
  if (request.nextUrl.pathname.startsWith('/_next')) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith('/api')) return NextResponse.next();
  if (request.nextUrl.pathname === '/login') return NextResponse.next();
  if (request.nextUrl.pathname === '/loginForm') return NextResponse.next();

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // For admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && 
        verified.payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};