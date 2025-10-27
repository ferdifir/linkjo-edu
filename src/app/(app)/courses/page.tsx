import { getCoursesForAdmin } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { CourseActions } from './components/course-actions';
import { coursesAdminMiddleware } from './middleware';

export default async function CoursesPage() {
  await coursesAdminMiddleware();
  
  const courses = await getCoursesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Mata Pelajaran</h1>
        <Button asChild>
          <Link href="/courses/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Mata Pelajaran
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mata Pelajaran</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada mata pelajaran yang ditambahkan.</p>
              <Button asChild className="mt-4">
                <Link href="/courses/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Mata Pelajaran Pertama
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Guru: {course.teacher}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {course.schedule || 'Jadwal belum ditentukan'}
                      </span>
                      <CourseActions courseId={course.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
