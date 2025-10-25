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
    console.error('Report generation failed:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate report. ${errorMessage}` };
  }
}
