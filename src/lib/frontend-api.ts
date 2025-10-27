// Frontend API functions that can be used in client components
'use client';

import { toast } from '@/hooks/use-toast';

// --- Course Management ---

export async function deleteCourse(courseId: string) {
  try {
    const response = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus mata pelajaran');
    }

    toast({
      title: 'Berhasil',
      description: 'Mata pelajaran berhasil dihapus.',
    });

    // Client-side revalidation can be done by router refresh
    if (typeof window !== 'undefined') {
      window.location.reload(); // Simple way to refresh the page after deletion
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting course:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Gagal menghapus mata pelajaran',
      variant: 'destructive',
    });
    
    return { success: false, error };
  }
}

// --- Location Management ---

export async function deleteLocation(locationId: string) {
  try {
    const response = await fetch(`/api/locations/${locationId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus lokasi');
    }

    toast({
      title: 'Berhasil',
      description: 'Lokasi berhasil dihapus.',
    });

    // Client-side revalidation can be done by router refresh
    if (typeof window !== 'undefined') {
      window.location.reload(); // Simple way to refresh the page after deletion
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting location:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Gagal menghapus lokasi',
      variant: 'destructive',
    });
    
    return { success: false, error };
  }
}
