import { getStudents } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from './components/data-table';
import { columns } from './components/columns';

export default async function StudentsPage() {
  const data = await getStudents();

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Direktori Siswa
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Semua Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
