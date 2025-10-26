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
import { deleteAnnouncementAction } from '../actions';
import { useRouter } from 'next/navigation';

export function AnnouncementActions({ announcementId }: { announcementId: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      try {
        await deleteAnnouncementAction(announcementId);
        toast({
          title: 'Pengumuman Dihapus',
          description: `Pengumuman telah dihapus.`,
        });
        router.refresh();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Gagal menghapus pengumuman',
          description:
            error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus pengumuman.',
        });
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
          <Link href={`/announcements/edit/${announcementId}`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
