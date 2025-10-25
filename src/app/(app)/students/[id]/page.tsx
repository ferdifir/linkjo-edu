import { getStudentById } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ReportGenerator from './components/report-generator';
import { Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function StudentProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const student = await getStudentById(params.id);

  if (!student) {
    notFound();
  }

  const avatarData = PlaceHolderImages.find((img) => img.id === student.avatar);
  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
        <div className='flex gap-4 items-start'>
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={avatarData?.imageUrl} alt={student.name} data-ai-hint={avatarData?.imageHint} />
            <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h1 className="font-headline text-3xl font-bold">{student.name}</h1>
            <p className="text-muted-foreground">{student.class}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                <span>{student.email}</span>
              </div>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href={`/students/${student.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Siswa
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="report">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="grades">Nilai</TabsTrigger>
          <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
          <TabsTrigger value="report">Laporan Kinerja AI</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Mata Pelajaran yang Diikuti</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Guru</TableHead>
                    <TableHead>Jadwal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{course.teacher}</TableCell>
                      <TableCell>{course.schedule}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Nilai</CardTitle>
              <CardDescription>
                Nilai terbaru untuk tugas dan ujian.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mata Pelajaran</TableHead>
                    <TableHead>Tugas</TableHead>
                    <TableHead className="text-right">Nilai</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.grades.map((g, i) => (
                    <TableRow key={i}>
                      <TableCell>{g.subject}</TableCell>
                      <TableCell className="font-medium">
                        {g.assignment}
                      </TableCell>
                      <TableCell className="text-right">{g.grade}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Kehadiran</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <h2 className="text-4xl font-bold">{student.attendance}%</h2>
              <p className="text-muted-foreground">
                Tingkat kehadiran keseluruhan untuk semester ini.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="mt-4">
          <ReportGenerator student={student} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
