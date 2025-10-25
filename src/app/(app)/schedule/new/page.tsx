import ScheduleForm from '../components/schedule-form';

export default function NewSchedulePage() {
  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Tambah Slot Waktu Jadwal Baru
      </h1>
      <ScheduleForm />
    </div>
  );
}
