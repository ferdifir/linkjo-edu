import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function locationsAdminMiddleware() {
  const isAdminUser = await isAdmin();
  
  if (!isAdminUser) {
    redirect('/dashboard');
  }
}
