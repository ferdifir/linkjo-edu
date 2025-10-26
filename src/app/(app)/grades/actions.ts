'use server';

import { addGrade, updateGrade, deleteGrade } from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

type GradeInput = { studentId: string, subject: string, assignment: string, grade: number };

export async function saveGradeAction(
  gradeId: string | null,
  data: GradeInput
) {
  try {
    if (gradeId) {
      await updateGrade(gradeId, data);
    } else {
      await addGrade(data);
    }
  } catch (error) {
    console.error('Failed to save grade:', error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'Gagal menyimpan nilai.' };
  }

  revalidatePath('/grades');
  redirect('/grades');
}

export async function deleteGradeAction(gradeId: string) {
    try {
        await deleteGrade(gradeId);
    } catch (error) {
        console.error('Failed to delete grade:', error);
        return { error: 'Gagal menghapus nilai.' };
    }
    revalidatePath('/grades');
}
