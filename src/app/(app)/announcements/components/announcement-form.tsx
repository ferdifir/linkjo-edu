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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { saveAnnouncementAction } from '../actions';
import { Loader2 } from 'lucide-react';
import type { Announcement } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const announcementFormSchema = z.object({
  title: z.string().min(1, { message: 'Judul harus diisi.' }),
  content: z.string().min(1, { message: 'Konten harus diisi.' }),
  author: z.string().min(1, { message: 'Penulis harus diisi.' }),
});

type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;

interface AnnouncementFormProps {
  announcement?: Announcement;
}

export default function AnnouncementForm({ announcement }: AnnouncementFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: announcement?.title || '',
      content: announcement?.content || '',
      author: announcement?.author || '',
    },
  });

  async function onSubmit(data: AnnouncementFormValues) {
    setIsLoading(true);
    
    const result = await saveAnnouncementAction(announcement?.id || null, data);

    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Gagal menyimpan pengumuman',
        description: result.error,
      });
    } else {
      toast({
        title: `Pengumuman ${announcement ? 'diperbarui' : 'ditambahkan'}`,
        description: `Pengumuman "${data.title}" telah berhasil disimpan.`,
      });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{announcement ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul pengumuman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konten</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan isi pengumuman" {...field} className="min-h-[150px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penulis</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Kepala Sekolah" {...field} />
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
              {announcement ? 'Simpan Perubahan' : 'Tambah Pengumuman'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
