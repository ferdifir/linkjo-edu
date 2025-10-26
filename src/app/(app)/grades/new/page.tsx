import GradeForm from '../components/grade-form';
import { getStudents, getCourses } from '@/lib/api';

export default async function NewGradePage() {
  const students = await getStudents();
  const courses = await getCourses();
  
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight text-center">
        Tambah Nilai Baru
      </h1>
      <GradeForm students={students} courses={courses} />
    </div>
  );
}
