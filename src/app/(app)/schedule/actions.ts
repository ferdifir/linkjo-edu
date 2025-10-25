'use server';

import { addSchedule, updateSchedule, deleteSchedule } from '@/lib/api';
import type { ScheduleEvent } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveScheduleAction(
  time: string | null,
  data: ScheduleEvent
) {
  try {
    const payload = { ...data };
    // Clean up empty entries
    Object.keys(payload).forEach(key => {
        const typedKey = key as keyof ScheduleEvent;
        if (typedKey !== 'time' && payload[typedKey] && !payload[typedKey]?.course) {
            delete payload[typedKey];
        }
    });

    if (time) {
      await updateSchedule(time, payload);
    } else {
      await addSchedule(payload);
    }
  } catch (error) {
    console.error('Failed to save schedule:', error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'Gagal menyimpan jadwal.' };
  }

  revalidatePath('/schedule');
  redirect('/schedule');
}

export async function deleteScheduleAction(time: string) {
    try {
        await deleteSchedule(time);
    } catch (error) {
        console.error('Failed to delete schedule:', error);
        return { error: 'Gagal menghapus jadwal.' };
    }
    revalidatePath('/schedule');
}
