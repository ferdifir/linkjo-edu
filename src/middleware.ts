import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/auth';

// Rute yang memerlukan otentikasi
const protectedRoutes = [
 '/dashboard',
  '/students',
  '/grades',
  '/schedule',
  '/announcements',
  '/attendance',
  '/take-attendance',
];

export async function middleware(request: NextRequest) {
  // Cek apakah rute saat ini adalah rute yang dilindungi
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

 if (isProtectedRoute) {
    // Cek apakah pengguna sudah login
    const session = await getSession();
    
    if (!session) {
      // Jika tidak login, redirect ke halaman login
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.search = `?callbackUrl=${request.nextUrl.pathname}`;
      return NextResponse.redirect(url);
    }
 }

  // Jika rute bukan rute yang dilindungi atau pengguna sudah login, lanjutkan
  return NextResponse.next();
}

// Tentukan rute mana yang akan dijalani middleware
export const config = {
  matcher: [
    /*
     * Jalankan middleware pada semua rute kecuali:
     * - Rute statis (_next/static, _next/image, dll.)
     * - File publik (favicon.ico, dll.)
     * - Halaman login
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
};
