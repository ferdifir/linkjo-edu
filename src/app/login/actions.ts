'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;


export async function loginAction(credentials: LoginFormValues) {
  // For now, we'll just simulate a successful login and redirect.
  // In a real app, you would validate credentials here.
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (credentials.email === 'teacher@linkjo.com' && credentials.password === 'password') {
    redirect('/dashboard');
  }

  return {
    error: 'Email atau password salah. Silakan coba lagi.'
  };
}
