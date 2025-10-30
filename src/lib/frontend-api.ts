// Frontend API functions that can be used in client components
'use client';

import { toast } from '@/hooks/use-toast';
import type { SchoolLocation } from './types';

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

export async function getLocations(): Promise<SchoolLocation[]> {
  try {
    const response = await fetch('/api/locations');
    if (!response.ok) {
      throw new Error('Gagal mengambil data lokasi');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching locations:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Gagal mengambil data lokasi',
      variant: 'destructive',
    });
    return [];
  }
}

export async function addLocation(locationData: Omit<SchoolLocation, 'id'>): Promise<SchoolLocation> {
  try {
    const response = await fetch('/api/locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error('Gagal menambahkan lokasi');
    }

    const newLocation = await response.json();
    
    toast({
      title: 'Berhasil',
      description: 'Lokasi berhasil ditambahkan.',
    });

    return newLocation;
  } catch (error) {
    console.error('Error adding location:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Gagal menambahkan lokasi',
      variant: 'destructive',
    });
    throw error;
  }
}

export async function updateLocation(locationId: string, locationData: Partial<Omit<SchoolLocation, 'id'>>): Promise<SchoolLocation> {
  try {
    const response = await fetch(`/api/locations/${locationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    });

    if (!response.ok) {
      throw new Error('Gagal memperbarui lokasi');
    }

    const updatedLocation = await response.json();
    
    toast({
      title: 'Berhasil',
      description: 'Lokasi berhasil diperbarui.',
    });

    return updatedLocation;
  } catch (error) {
    console.error('Error updating location:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Gagal memperbarui lokasi',
      variant: 'destructive',
    });
    throw error;
  }
}

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
