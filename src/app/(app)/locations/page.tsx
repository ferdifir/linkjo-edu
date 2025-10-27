import { getLocations } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { LocationActions } from './components/location-actions';
import { locationsAdminMiddleware } from './middleware';

export default async function LocationsPage() {
  await locationsAdminMiddleware();
  
  const locations = await getLocations();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Lokasi & Ruang</h1>
        <Button asChild>
          <Link href="/locations/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Lokasi
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Lokasi</CardTitle>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Belum ada lokasi yang ditambahkan.</p>
              <Button asChild className="mt-4">
                <Link href="/locations/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Lokasi Pertama
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location) => (
                <Card key={location.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {location.description || 'Tidak ada deskripsi'}
                      </p>
                      <LocationActions locationId={location.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
