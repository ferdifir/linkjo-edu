import { getAnnouncements } from '@/lib/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { AnnouncementActions } from './components/announcement-actions';

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Pengumuman
        </h1>
        <Button asChild>
          <Link href="/announcements/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pengumuman
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Semua Pengumuman Sekolah</CardTitle>
          <CardDescription>
            Daftar lengkap semua pembaruan dan berita dari sekolah.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div key={announcement.id}>
                <div className="space-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold">{announcement.title}</h3>
                    <AnnouncementActions announcementId={announcement.id} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Diterbitkan oleh {announcement.author} pada{' '}
                    {new Date(announcement.date).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm">{announcement.content}</p>
                </div>
                {index < announcements.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
