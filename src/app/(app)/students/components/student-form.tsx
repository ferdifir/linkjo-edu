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
import { useToast } from '@/hooks/use-toast';
import { saveStudentAction } from '../[id]/actions';
import { Loader2 } from 'lucide-react';
import { Student } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const studentFormSchema = z.object({
  name: z.string().min(1, { message: 'Nama harus diisi.' }),
  email: z.string().email({ message: 'Email tidak valid.' }),
  class: z.string().min(1, { message: 'Kelas harus diisi.' }),
  attendance: z.coerce.number().min(0).max(100, { message: 'Kehadiran harus antara 0 dan 100.' }),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

interface StudentFormProps {
  student?: Student;
}

export default function StudentForm({ student }: StudentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: student?.name || '',
      email: student?.email || '',
      class: student?.class || '',
      attendance: student?.attendance || 0,
    },
  });

  async function onSubmit(data: StudentFormValues) {
    setIsLoading(true);
    
    const result = await saveStudentAction(student?.id || null, data);

    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Gagal menyimpan siswa',
        description: result.error,
      });
    } else {
      toast({
        title: `Siswa ${student ? 'diperbarui' : 'ditambahkan'}`,
        description: `Data untuk ${data.name} telah berhasil disimpan.`,
      });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{student ? 'Edit Detail Siswa' : 'Masukkan Detail Siswa Baru'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Email</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Kelas 10A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="attendance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Persentase Kehadiran</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {student ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
