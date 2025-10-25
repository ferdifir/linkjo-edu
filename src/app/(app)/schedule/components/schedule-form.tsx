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
  CardDescription,
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
import { saveScheduleAction } from '../actions';
import { Loader2 } from 'lucide-react';
import { ScheduleEvent } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const daySchema = z.object({
    course: z.string().optional(),
    teacher: z.string().optional(),
}).optional();

const scheduleFormSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s-\s([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Format waktu harus HH:mm - HH:mm' }),
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleFormProps {
  event?: ScheduleEvent;
}

const days = [
  { id: 'monday', name: 'Senin' },
  { id: 'tuesday', name: 'Selasa' },
  { id: 'wednesday', name: 'Rabu' },
  { id: 'thursday', name: 'Kamis' },
  { id: 'friday', name: 'Jumat' },
] as const;

export default function ScheduleForm({ event }: ScheduleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      time: event?.time || '',
      monday: event?.monday || { course: '', teacher: '' },
      tuesday: event?.tuesday || { course: '', teacher: '' },
      wednesday: event?.wednesday || { course: '', teacher: '' },
      thursday: event?.thursday || { course: '', teacher: '' },
      friday: event?.friday || { course: '', teacher: '' },
    },
  });

  async function onSubmit(data: ScheduleFormValues) {
    setIsLoading(true);
    
    const result = await saveScheduleAction(event?.time || null, data);

    setIsLoading(false);

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Gagal menyimpan jadwal',
        description: result.error,
      });
    } else {
      toast({
        title: `Jadwal ${event ? 'diperbarui' : 'ditambahkan'}`,
        description: `Jadwal untuk waktu ${data.time} telah berhasil disimpan.`,
      });
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{event ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</CardTitle>
            <CardDescription>{event ? `Mengedit jadwal untuk waktu ${event.time}` : 'Buat slot waktu baru dalam jadwal mingguan.'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. 09:00 - 10:00" {...field} disabled={!!event} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4 rounded-md border p-4">
                 <h3 className="text-lg font-medium">Kelas per Hari</h3>
                 <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {days.map(day => (
                        <div key={day.id} className="space-y-2">
                            <h4 className="font-semibold">{day.name}</h4>
                             <FormField
                                control={form.control}
                                name={`${day.id}.course`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Mata Pelajaran</FormLabel>
                                    <FormControl>
                                        <Input placeholder="cth. Matematika" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name={`${day.id}.teacher`}
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Guru</FormLabel>
                                    <FormControl>
                                        <Input placeholder="cth. Bpk. Budi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                    ))}
                 </div>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
