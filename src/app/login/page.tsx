import LoginForm from './components/login-form';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
       <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
            <GraduationCap className="h-16 w-16 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Selamat Datang di Linkjo
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Sistem Manajemen Sekolah Terpadu
            </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
