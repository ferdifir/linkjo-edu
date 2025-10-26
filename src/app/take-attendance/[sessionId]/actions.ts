'use server';

import { getAttendanceSession, markStudentPresent, endAttendanceSession } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function getSessionDetails(sessionId: string) {
    return await getAttendanceSession(sessionId);
}

export async function markPresentAction(sessionId: string, nfcCardId: string) {
    try {
        const student = await markStudentPresent(sessionId, nfcCardId);
        revalidatePath(`/take-attendance/${sessionId}`);
        return { success: true, studentName: student?.name };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Terjadi kesalahan yang tidak diketahui." };
    }
}

export async function endSessionAction(sessionId: string) {
    try {
        await endAttendanceSession(sessionId);
        revalidatePath(`/take-attendance/${sessionId}`);
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Gagal mengakhiri sesi." };
    }
}
