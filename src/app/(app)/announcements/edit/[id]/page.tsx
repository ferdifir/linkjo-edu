import AnnouncementForm from '../../components/announcement-form';
import { getAnnouncementById } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const announcement = await getAnnouncementById(params.id);

  if (!announcement) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Edit Pengumuman
      </h1>
      <AnnouncementForm announcement={announcement} />
    </div>
  );
}
