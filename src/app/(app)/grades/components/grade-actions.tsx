'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { deleteGradeAction } from '../actions';
import { useRouter } from 'next/navigation';

export function GradeActions({ gradeId }: { gradeId: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus nilai ini?')) {
      const result = await deleteGradeAction(gradeId);
      if (result?.error) {
         toast({
          variant: 'destructive',
          title: 'Gagal menghapus nilai',
          description: result.error,
        });
      } else {
        toast({
          title: 'Nilai Dihapus',
          description: 'Nilai telah berhasil dihapus.',
        });
        router.refresh();
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href={`/grades/edit/${gradeId}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
