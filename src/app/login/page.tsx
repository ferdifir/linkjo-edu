import LoginForm from './components/login-form';
import { GraduationCap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
       <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
            <GraduationCap className="h-16 w-16 text-primary" />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-10">
                Selamat Datang di Linkjo
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                Sistem Manajemen Sekolah Terpadu
            </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 space-y-2">
          <p className="font-medium">Akun Demo Tersedia:</p>
          <div className="space-y-1 text-xs">
            <p><span className="font-semibold">Admin:</span> admin@sekolah.edu / admin123</p>
            <p><span className="font-semibold">Guru:</span> davis@sekolah.edu / teacher123</p>
            <p><span className="font-semibold">Guru 2:</span> smith@sekolah.edu / teacher123</p>
          </div>
          <p className="text-xs mt-2 text-gray-50 dark:text-gray-400">
            Catatan: Gunakan akun demo untuk mengakses sistem
          </p>
        </div>
      </div>
    </div>
  );
}
