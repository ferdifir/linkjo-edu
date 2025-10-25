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
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Jadwal Kelas
      </h1>

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
                          {entry ? (
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
