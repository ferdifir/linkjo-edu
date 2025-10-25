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

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Class Schedule
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
          <CardDescription>
            Overview of classes for the current week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Time</TableHead>
                  <TableHead>Monday</TableHead>
                  <TableHead>Tuesday</TableHead>
                  <TableHead>Wednesday</TableHead>
                  <TableHead>Thursday</TableHead>
                  <TableHead>Friday</TableHead>
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
