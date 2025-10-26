import type { ReactNode } from 'react';

export default function TakeAttendanceLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
