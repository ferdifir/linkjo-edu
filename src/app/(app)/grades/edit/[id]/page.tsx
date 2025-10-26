import GradeForm from '../../components/grade-form';
import { getGradeById, getStudents, getCourses } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EditGradePage({ params }: { params: { id: string } }) {
  const grade = await getGradeById(params.id);
  const students = await getStudents();
  const courses = await getCourses();

  if (!grade) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight text-center">
        Edit Nilai
      </h1>
      <GradeForm grade={grade} students={students} courses={courses} />
    </div>
  );
}
