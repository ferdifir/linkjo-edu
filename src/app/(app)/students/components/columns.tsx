'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
];
