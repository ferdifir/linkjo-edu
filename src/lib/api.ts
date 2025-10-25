import { students, announcements, schedule } from './mock-data';
import type { Student, Announcement, ScheduleEvent } from './types';

export async function getStudents(): Promise<Student[]> {
  return Promise.resolve(students);
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return Promise.resolve(students.find((s) => s.id === id));
}

export async function getAnnouncements(): Promise<Announcement[]> {
  // Sort by date descending
  return Promise.resolve(
    announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
}

export async function getSchedule(): Promise<ScheduleEvent[]> {
  return Promise.resolve(schedule);
}

export async function getStats() {
    return Promise.resolve({
        totalStudents: students.length,
        averageAttendance: Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length),
        averageGrade: Math.round(students.reduce((acc, s) => acc + s.grades.reduce((gAcc, g) => gAcc + g.grade, 0) / s.grades.length, 0) / students.length),
    });
}
