'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { saveGradeAction } from '../actions';
import { Loader2 } from 'lucide-react';
import type { Student, Course, GradeWithId } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const gradeFormSchema = z.object({
  studentId: z.string().min(1, { message: 'Siswa harus dipilih.' }),
  subject: z.string().min(1, { message: 'Mata pelajaran harus diisi.' }),
  assignment: z.string().min(1, { message: 'Tugas harus diisi.' }),
  grade: z.coerce.number().min(0, { message: 'Nilai minimal 0.' }).max(100, { message: 'Nilai maksimal 100.' }),
});

type GradeFormValues = z.infer<typeof gradeFormSchema>;

interface GradeFormProps {
  grade?: GradeWithId;
  students: Student[];
  courses: Course[];
}

export default function GradeForm({ grade, students, courses }: GradeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      studentId: grade?.studentId || '',
      subject: grade?.subject || '',
      assignment: grade?.assignment || '',
      grade: grade?.grade || 0,
    },
  });

  async function onSubmit(data: GradeFormValues) {
    setIsLoading(true);
    
    const result = await saveGradeAction(grade?.id || null, data);

    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Gagal menyimpan nilai',
        description: result.error,
      });
    } else {
      toast({
        title: `Nilai ${grade ? 'diperbarui' : 'ditambahkan'}`,
        description: `Nilai telah berhasil disimpan.`,
      });
      router.push('/grades');
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{grade ? 'Edit Nilai' : 'Tambah Nilai Baru'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Siswa</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!grade}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih seorang siswa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mata Pelajaran</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih mata pelajaran" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {courses.map(course => (
                            <SelectItem key={course.id} value={course.name}>{course.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="assignment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tugas</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Ujian Tengah Semester" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nilai</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0-100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {grade ? 'Simpan Perubahan' : 'Tambah Nilai'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
