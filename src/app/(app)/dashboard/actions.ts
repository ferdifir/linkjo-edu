'use server';

import { startAttendanceSession } from '@/lib/api';
import { redirect } from 'next/navigation';

export async function startSessionAction(courseName: string, teacherName: string) {
  try {
    const session = await startAttendanceSession(courseName, teacherName);
    redirect(`/take-attendance/${session.id}`);
  } catch (error) {
    console.error("Failed to start session:", error);
    // You might want to return an error to the UI instead of just logging
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'Gagal memulai sesi kehadiran.' };
  }
}
