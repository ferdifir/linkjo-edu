import { cookies } from 'next/headers';
import { AuthUser } from './api';

// Nama cookie untuk session
const SESSION_COOKIE_NAME = 'linkjo-edu-session';

// Tipe untuk session data
interface SessionData {
  user: AuthUser;
  expiresAt: number; // timestamp
}

// Fungsi untuk membuat session
export async function createSession(user: AuthUser): Promise<string> {
  // Dalam implementasi sebenarnya, Anda mungkin ingin menggunakan JWT atau
 // sistem session yang lebih aman
  const sessionData: SessionData = {
    user,
    expiresAt: Date.now() + 24 * 60 * 1000, // 24 jam
 };

  // Dalam contoh ini, kita hanya menyimpan data sebagai string JSON
 // Dalam produksi, Anda harus mengenkripsi data ini
  const sessionToken = JSON.stringify(sessionData);
  
  // Set cookie
  (await cookies()).set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60, // 24 jam dalam detik
    path: '/',
    sameSite: 'strict',
  });

  return sessionToken;
}

// Fungsi untuk mendapatkan session
export async function getSession(): Promise<SessionData | null> {
  const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionToken) as SessionData;
    
    // Cek apakah session masih berlaku
    if (sessionData.expiresAt < Date.now()) {
      // Session sudah kadaluarsa
      await destroySession();
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
 }
}

// Fungsi untuk mendapatkan user dari session
export async function getCurrentUser(): Promise<AuthUser | null> {
 const session = await getSession();
  return session ? session.user : null;
}

// Fungsi untuk mengecek apakah user adalah admin
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

// Fungsi untuk mengecek apakah user adalah guru
export async function isTeacher(): Promise<boolean> {
 const user = await getCurrentUser();
  return user?.role === 'TEACHER';
}

// Fungsi untuk mengecek apakah user adalah admin atau guru
export async function isAdminOrTeacher(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN' || user?.role === 'TEACHER';
}

// Fungsi untuk menghancurkan session
export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}

// Fungsi untuk mengecek apakah user sudah login
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
