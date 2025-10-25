import { getSchedule } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteScheduleAction } from './actions';
import { ScheduleActions } from './components/schedule-actions';


export default async function SchedulePage() {
  const scheduleData = await getSchedule();
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const dayNames: { [key: string]: string } = {
    monday: 'Senin',
    tuesday: 'Selasa',
    wednesday: 'Rabu',
    thursday: 'Kamis',
    friday: 'Jumat',
  };

  return (
    <div className="space-y-8">
       <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Jadwal Kelas
        </h1>
        <Button asChild>
          <Link href="/schedule/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Jadwal
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jadwal Mingguan</CardTitle>
          <CardDescription>
            Gambaran umum kelas untuk minggu ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Waktu</TableHead>
                  {days.map((day) => (
                    <TableHead key={day}>{dayNames[day]}</TableHead>
                  ))}
                   <TableHead className="w-[50px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((event) => (
                  <TableRow key={event.time}>
                    <TableCell className="font-medium">{event.time}</TableCell>
                    {days.map((day) => {
                      const entry = event[day as keyof typeof event] as { course: string; teacher: string } | undefined;
                      return (
                        <TableCell key={day}>
                          {entry && entry.course ? (
                            <div className="grid">
                              <span className="font-semibold">{entry.course}</span>
                              <span className="text-xs text-muted-foreground">{entry.teacher}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                       <ScheduleActions time={event.time} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
