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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default async function GradesPage() {
  const students = await getStudents();

  // Flatten the grades data
  const allGrades = students.flatMap(student =>
    student.grades.map(grade => ({
      ...grade,
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
    }))
  ).sort((a, b) => a.studentName.localeCompare(b.studentName) || a.subject.localeCompare(b.subject));


  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Laporan Nilai
      </h1>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {allGrades.map((grade, index) => {
                  const avatarData = PlaceHolderImages.find(
                    (img) => img.id === grade.studentAvatar
                  );
                  const initials = grade.studentName
                    .split(' ')
                    .map((n) => n[0])
                    .join('');

                  return (
                    <TableRow key={`${grade.studentId}-${grade.subject}-${grade.assignment}`}>
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
