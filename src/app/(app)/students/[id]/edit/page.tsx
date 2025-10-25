import StudentForm from '../../../components/student-form';
import { getStudentById } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const student = await getStudentById(params.id);

  if (!student) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Edit Siswa
      </h1>
      <StudentForm student={student} />
    </div>
  );
}
