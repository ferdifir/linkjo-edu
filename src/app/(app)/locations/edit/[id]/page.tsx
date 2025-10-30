'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getLocations, updateLocation } from '@/lib/frontend-api';
import { toast } from '@/hooks/use-toast';
import type { SchoolLocation } from '@/lib/types';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locations = await getLocations();
        const location = locations.find(loc => loc.id === locationId);
        
        if (location) {
          setFormData({
            name: location.name,
            description: location.description || '',
          });
        } else {
          router.push('/locations');
          toast({
            title: 'Error',
            description: 'Lokasi tidak ditemukan.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        router.push('/locations');
        toast({
          title: 'Error',
          description: 'Gagal mengambil data lokasi.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId, router]);

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
      await updateLocation(locationId, formData);
      
      toast({
        title: 'Success',
        description: 'Lokasi berhasil diperbarui.',
      });

      // Success - redirect to locations page
      router.push('/locations');
      router.refresh();
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal memperbarui lokasi',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-2xl">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Edit Lokasi
        </h1>
        <p className="text-muted-foreground mt-2">
          Perbarui informasi lokasi.
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
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
