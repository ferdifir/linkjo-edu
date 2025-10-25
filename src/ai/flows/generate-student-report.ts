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
  studentName: z.string().describe('The name of the student.'),
  grades: z
    .array(z.object({
      assignment: z.string(),
      grade: z.number(),
    }))
    .describe('The grades of the student.'),
  attendancePercentage: z.number().describe('The attendance percentage of the student.'),
  teacherNotes: z.string().optional().describe('Optional notes from the teacher about the student.'),
});
export type GenerateStudentReportInput = z.infer<typeof GenerateStudentReportInputSchema>;

const GenerateStudentReportOutputSchema = z.object({
  report: z.string().describe('The generated student performance report.'),
});
export type GenerateStudentReportOutput = z.infer<typeof GenerateStudentReportOutputSchema>;

export async function generateStudentReport(input: GenerateStudentReportInput): Promise<GenerateStudentReportOutput> {
  return generateStudentReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudentReportPrompt',
  input: {schema: GenerateStudentReportInputSchema},
  output: {schema: GenerateStudentReportOutputSchema},
  prompt: `You are an AI assistant designed to generate student performance reports for teachers.

  Based on the student's grades, attendance, and teacher's notes, create a comprehensive report.

  Student Name: {{{studentName}}}
  Grades:
  {{#each grades}}
  - {{assignment}}: {{grade}}
  {{/each}}
  Attendance Percentage: {{{attendancePercentage}}}%
  Teacher's Notes: {{#if teacherNotes}}{{{teacherNotes}}}{{else}}No notes provided.{{/if}}

  Generate a report summarizing the student's performance, highlighting strengths and areas for improvement.`,
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
