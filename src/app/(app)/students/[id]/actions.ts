'use server';

import {
  generateStudentReport,
  GenerateStudentReportInput,
} from '@/ai/flows/generate-student-report';
import { addStudent, updateStudent, deleteStudent } from '@/lib/api';
import type { Student } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


export async function generateReport(
  input: GenerateStudentReportInput
): Promise<{ report?: string; error?: string }> {
  try {
    const { report } = await generateStudentReport(input);
    return { report };
  } catch (e) {
    console.error('Pembuatan laporan gagal:', e);
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan yang tidak diketahui.';
    return { error: `Gagal membuat laporan. ${errorMessage}` };
  }
}

export async function saveStudentAction(
  studentId: string | null,
  data: Omit<Student, 'id' | 'grades' | 'courses' | 'avatar'>
) {
  try {
    if (studentId) {
      await updateStudent(studentId, data);
    } else {
      await addStudent(data);
    }
  } catch (error) {
    console.error('Failed to save student:', error);
    return { error: 'Gagal menyimpan siswa.' };
  }

  revalidatePath('/students');
  redirect('/students');
}

export async function deleteStudentAction(studentId: string) {
    try {
        await deleteStudent(studentId);
    } catch (error) {
        console.error('Failed to delete student:', error);
        return { error: 'Gagal menghapus siswa.' };
    }
    revalidatePath('/students');
}
