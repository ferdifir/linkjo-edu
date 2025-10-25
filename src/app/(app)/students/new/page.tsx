import StudentForm from '../components/student-form';

export default function NewStudentPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Tambah Siswa Baru
      </h1>
      <StudentForm />
    </div>
  );
}
