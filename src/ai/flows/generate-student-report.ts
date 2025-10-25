'use server';

/**
 * @fileOverview A student report generation AI agent.
 *
 * - generateStudentReport - A function that handles the report generation process.
 * - GenerateStudentReportInput - The input type for the generateStudentReport function.
 * - GenerateStudentReportOutput - The return type for the generateStudentReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudentReportInputSchema = z.object({
  studentName: z.string().describe('Nama siswa.'),
  grades: z
    .array(z.object({
      assignment: z.string(),
      grade: z.number(),
    }))
    .describe('Nilai siswa.'),
  attendancePercentage: z.number().describe('Persentase kehadiran siswa.'),
  teacherNotes: z.string().optional().describe('Catatan opsional dari guru tentang siswa.'),
});
export type GenerateStudentReportInput = z.infer<typeof GenerateStudentReportInputSchema>;

const GenerateStudentReportOutputSchema = z.object({
  report: z.string().describe('Laporan kinerja siswa yang dihasilkan.'),
});
export type GenerateStudentReportOutput = z.infer<typeof GenerateStudentReportOutputSchema>;

export async function generateStudentReport(input: GenerateStudentReportInput): Promise<GenerateStudentReportOutput> {
  return generateStudentReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentReportPrompt',
  input: {schema: GenerateStudentReportInputSchema},
  output: {schema: GenerateStudentReportOutputSchema},
  prompt: `Anda adalah asisten AI yang dirancang untuk membuat laporan kinerja siswa untuk para guru.

  Berdasarkan nilai, kehadiran, dan catatan guru, buatlah laporan yang komprehensif.

  Nama Siswa: {{{studentName}}}
  Nilai:
  {{#each grades}}
  - {{assignment}}: {{grade}}
  {{/each}}
  Persentase Kehadiran: {{{attendancePercentage}}}%
  Catatan Guru: {{#if teacherNotes}}{{{teacherNotes}}}{{else}}Tidak ada catatan yang diberikan.{{/if}}

  Buat laporan yang merangkum kinerja siswa, menyoroti kekuatan dan area yang perlu ditingkatkan.`,
});

const generateStudentReportFlow = ai.defineFlow(
  {
    name: 'generateStudentReportFlow',
    inputSchema: GenerateStudentReportInputSchema,
    outputSchema: GenerateStudentReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
