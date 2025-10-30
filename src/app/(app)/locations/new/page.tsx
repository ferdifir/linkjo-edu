'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addLocation } from '@/lib/frontend-api';
import { toast } from '@/hooks/use-toast';

export default function NewLocationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addLocation(formData);
      
      toast({
        title: 'Success',
        description: 'Lokasi berhasil ditambahkan.',
      });

      // Success - redirect to locations page
      router.push('/locations');
      router.refresh();
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal menambahkan lokasi',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Tambah Lokasi Baru
        </h1>
        <p className="text-muted-foreground mt-2">
          Tambahkan lokasi baru ke dalam sistem.
        </p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Form Lokasi</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nama Lokasi
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lokasi"
              required
              className="w-full p-2 border rounded-md"
            />
            <p className="text-xs text-muted-foreground">
              Contoh: Gedung Utama, Gedung Barat, Laboratorium, dll.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Deskripsi (Opsional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tambahkan deskripsi lokasi"
              className="w-full p-2 border rounded-md min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Informasi tambahan tentang lokasi ini.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-4 py-2 border rounded-md hover:bg-muted disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Lokasi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
