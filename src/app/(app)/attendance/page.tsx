import { getStudents } from '@/lib/api';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function AttendancePage() {
  const students = await getStudents();

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Laporan Kehadiran
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Kehadiran Siswa</CardTitle>
          <CardDescription>
            Ringkasan kehadiran untuk semua siswa semester ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead className="text-right">Persentase Kehadiran</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students
                  .sort((a, b) => a.attendance - b.attendance)
                  .map((student) => {
                    const avatarData = PlaceHolderImages.find(
                      (img) => img.id === student.avatar
                    );
                    const initials = student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('');
                    const attendance = student.attendance;
                    const color =
                      attendance > 90
                        ? 'bg-green-100 text-green-800'
                        : attendance > 80
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800';

                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={avatarData?.imageUrl}
                                alt={student.name}
                                data-ai-hint={avatarData?.imageHint}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="grid">
                              <span className="font-medium">{student.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {student.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`border-none ${color}`}>{attendance}%</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
