'use server';

import { addAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/lib/api';
import type { Announcement } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveAnnouncementAction(
  announcementId: string | null,
  data: Omit<Announcement, 'id' | 'date'>
) {
  try {
    if (announcementId) {
      await updateAnnouncement(announcementId, data);
    } else {
      await addAnnouncement(data);
    }
  } catch (error) {
    console.error('Failed to save announcement:', error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: 'Gagal menyimpan pengumuman.' };
  }

  revalidatePath('/announcements');
  redirect('/announcements');
}

export async function deleteAnnouncementAction(announcementId: string) {
    try {
        await deleteAnnouncement(announcementId);
    } catch (error) {
        console.error('Failed to delete announcement:', error);
        return { error: 'Gagal menghapus pengumuman.' };
    }
    revalidatePath('/announcements');
}
