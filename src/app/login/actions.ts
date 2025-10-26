'use server';

import { redirect } from 'next/navigation';
import { authenticateUser, type LoginCredentials } from '@/lib/api';
import { createSession, destroySession } from '@/lib/auth';

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const credentials: LoginCredentials = {
    email,
    password
  };

  const user = await authenticateUser(credentials);

  if (user) {
    await createSession(user);
    redirect('/dashboard');
  }

  return { error: 'Email atau password salah' };
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
