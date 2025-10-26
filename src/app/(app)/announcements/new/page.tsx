import AnnouncementForm from '../components/announcement-form';

export default function NewAnnouncementPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Tambah Pengumuman Baru
      </h1>
      <AnnouncementForm />
    </div>
  );
}
