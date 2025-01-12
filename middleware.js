import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Middleware function to handle authentication and authorization
export async function middleware(request) {
  // Retrieve the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Allow requests for Next.js internal paths
  if (request.nextUrl.pathname.startsWith('/_next')) return NextResponse.next();
  // Allow requests for API routes
  if (request.nextUrl.pathname.startsWith('/api')) return NextResponse.next();
  // Allow requests for the login page
  if (request.nextUrl.pathname === '/login') return NextResponse.next();
  // Allow requests for the login form
  if (request.nextUrl.pathname === '/loginForm') return NextResponse.next();

  // If no token is present, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify the JWT token
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // For admin routes, check if the user has admin role
    if (request.nextUrl.pathname.startsWith('/admin') && 
        verified.payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // If everything is fine, allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    // If token verification fails, redirect to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configuration for the middleware matcher
export const config = {
  matcher: [
    // Match all routes except for API, static files, and favicon
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};