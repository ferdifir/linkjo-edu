import { getGrades } from '@/lib/api';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { GradeActions } from './components/grade-actions';

export default async function GradesPage() {
  const allGrades = await getGrades();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Laporan Nilai
        </h1>
        <Button asChild>
          <Link href="/grades/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Nilai
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Semua Nilai Siswa</CardTitle>
          <CardDescription>
            Tinjauan komprehensif tentang nilai siswa di semua mata pelajaran.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Siswa</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Tugas</TableHead>
                  <TableHead className="text-right">Nilai</TableHead>
                  <TableHead className="w-[50px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allGrades.map((grade) => {
                  const avatarData = PlaceHolderImages.find(
                    (img) => img.id === grade.studentAvatar
                  );
                  const initials = grade.studentName
                    .split(' ')
                    .map((n) => n[0])
                    .join('');

                  return (
                    <TableRow key={grade.id}>
                      <TableCell>
                         <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={avatarData?.imageUrl}
                                alt={grade.studentName}
                                data-ai-hint={avatarData?.imageHint}
                              />
                              <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{grade.studentName}</span>
                          </div>
                      </TableCell>
                      <TableCell>{grade.subject}</TableCell>
                      <TableCell>{grade.assignment}</TableCell>
                      <TableCell className="text-right font-medium">{grade.grade}%</TableCell>
                       <TableCell className="text-right">
                         <GradeActions gradeId={grade.id} />
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
