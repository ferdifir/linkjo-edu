'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash } from 'lucide-react';
import Link from 'next/link';
import { deleteLocation } from '@/lib/frontend-api';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface LocationActionsProps {
  locationId: string;
}

export function LocationActions({ locationId }: LocationActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus lokasi ini? Semua ruang di lokasi ini juga akan dihapus.')) {
      return;
    }

    try {
      await deleteLocation(locationId);
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus lokasi.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/locations/edit/${locationId}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Hapus
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
