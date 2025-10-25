'use server';

import {
  generateStudentReport,
  GenerateStudentReportInput,
} from '@/ai/flows/generate-student-report';

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
