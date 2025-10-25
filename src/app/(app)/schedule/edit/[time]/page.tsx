import ScheduleForm from '../../components/schedule-form';
import { getScheduleByTime } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EditSchedulePage({ params }: { params: { time: string } }) {
  const time = decodeURIComponent(params.time);
  const event = await getScheduleByTime(time);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Edit Jadwal
      </h1>
      <ScheduleForm event={event} />
    </div>
  );
}
