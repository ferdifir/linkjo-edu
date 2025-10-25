'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteStudentAction } from '../[id]/actions';
import { useToast } from '@/hooks/use-toast';

async function onDelete(id: string) {
    if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
        await deleteStudentAction(id);
    }
}


export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const student = row.original;
      const avatarData = PlaceHolderImages.find(
        (img) => img.id === student.avatar
      );
      const name = student.name;
      const email = student.email;
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('');

      return (
        <Link href={`/students/${student.id}`}>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={avatarData?.imageUrl} alt={name} data-ai-hint={avatarData?.imageHint} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid">
              <span className="font-medium hover:underline">{name}</span>
              <span className="text-xs text-muted-foreground">{email}</span>
            </div>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: 'id',
    header: 'ID Siswa',
  },
  {
    accessorKey: 'class',
    header: 'Kelas',
  },
  {
    accessorKey: 'attendance',
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Kehadiran
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('attendance'));
       const color = amount > 90 ? 'bg-green-100 text-green-800' : amount > 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
      return (
        <div className="text-right font-medium">
          <Badge variant="outline" className={`border-none ${color}`}>{amount}%</Badge>
        </div>
      );
    },
  },
    {
    id: 'actions',
    cell: ({ row }) => {
      const student = row.original;
      const { toast } = useToast();

      const handleDelete = async () => {
        if (confirm('Apakah Anda yakin ingin menghapus siswa ini?')) {
          try {
            await deleteStudentAction(student.id);
            toast({
              title: 'Siswa Dihapus',
              description: `${student.name} telah dihapus.`,
            });
          } catch (error) {
             toast({
              variant: 'destructive',
              title: 'Gagal menghapus siswa',
              description: 'Terjadi kesalahan saat menghapus siswa.',
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
              <Link href={`/students/${student.id}`}>Lihat Profil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/students/${student.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600"
            >
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
