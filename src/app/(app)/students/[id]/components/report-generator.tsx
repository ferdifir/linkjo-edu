'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generateReport } from '../actions';
import { Loader2 } from 'lucide-react';
import { Student } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles } from 'lucide-react';

const reportFormSchema = z.object({
  teacherNotes: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export default function ReportGenerator({ student }: { student: Student }) {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      teacherNotes: '',
    },
  });

  async function onSubmit(data: ReportFormValues) {
    setIsLoading(true);
    setReport(null);

    const input = {
      studentName: student.name,
      grades: student.grades.map((g) => ({
        assignment: `${g.subject}: ${g.assignment}`,
        grade: g.grade,
      })),
      attendancePercentage: student.attendance,
      teacherNotes: data.teacherNotes,
    };

    const result = await generateReport(input);

    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Gagal membuat laporan',
        description: result.error,
      });
    } else {
      setReport(result.report || 'Tidak ada laporan yang dibuat.');
      toast({
        title: 'Laporan Berhasil Dibuat',
        description: 'Ringkasan kinerja AI siap untuk ditinjau.',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan Kinerja Berbasis AI</CardTitle>
        <CardDescription>
          Buat ringkasan kinerja otomatis untuk siswa ini berdasarkan
          nilai, kehadiran, dan catatan tambahan apa pun.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="teacherNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan Tambahan Guru (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="misalnya, 'Menunjukkan potensi besar dalam diskusi kelas tetapi perlu fokus untuk menyerahkan pekerjaan rumah tepat waktu.'"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Buat Laporan
            </Button>
          </CardFooter>
        </form>
      </Form>
      {(isLoading || report) && (
        <CardContent>
          <Alert>
             <Sparkles className="h-4 w-4" />
            <AlertTitle>Laporan yang Dihasilkan</AlertTitle>
            <AlertDescription>
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat...
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {report}
                </pre>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
