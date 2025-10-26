import { students, announcements, schedule, courses } from './mock-data';
import type { Student, Announcement, ScheduleEvent } from './types';
import { revalidatePath } from 'next/cache';

export async function getStudents(): Promise<Student[]> {
  return Promise.resolve(students);
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return Promise.resolve(students.find((s) => s.id === id));
}

export async function addStudent(studentData: Omit<Student, 'id' | 'grades' | 'courses' | 'avatar'>): Promise<Student> {
  const newId = `S${String(students.length + 1).padStart(3, '0')}`;
  const newStudent: Student = {
    ...studentData,
    id: newId,
    avatar: `student-${(students.length % 5) + 1}`,
    grades: [], // Start with empty grades
    courses: [], // Start with empty courses
  };
  students.push(newStudent);
  revalidatePath('/students');
  return Promise.resolve(newStudent);
}

export async function updateStudent(id: string, studentData: Partial<Omit<Student, 'id'>>): Promise<Student | undefined> {
  const studentIndex = students.findIndex((s) => s.id === id);
  if (studentIndex === -1) {
    return Promise.resolve(undefined);
  }
  const updatedStudent = { ...students[studentIndex], ...studentData };
  students[studentIndex] = updatedStudent;
  revalidatePath(`/students`);
  revalidatePath(`/students/${id}`);
  return Promise.resolve(updatedStudent);
}

export async function deleteStudent(id: string): Promise<void> {
  const studentIndex = students.findIndex((s) => s.id === id);
  if (studentIndex > -1) {
    students.splice(studentIndex, 1);
  }
  revalidatePath('/students');
  return Promise.resolve();
}


export async function getAnnouncements(): Promise<Announcement[]> {
  // Sort by date descending
  return Promise.resolve(
    announcements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
}

export async function getAnnouncementById(id: string): Promise<Announcement | undefined> {
  return Promise.resolve(announcements.find((a) => a.id === id));
}

export async function addAnnouncement(announcementData: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> {
  const newId = `A${String(announcements.length + 1).padStart(3, '0')}`;
  const newAnnouncement: Announcement = {
    ...announcementData,
    id: newId,
    date: new Date().toISOString().split('T')[0], // Set current date
  };
  announcements.push(newAnnouncement);
  revalidatePath('/announcements');
  return Promise.resolve(newAnnouncement);
}

export async function updateAnnouncement(id: string, announcementData: Partial<Omit<Announcement, 'id'>>): Promise<Announcement | undefined> {
    const announcementIndex = announcements.findIndex((a) => a.id === id);
    if (announcementIndex === -1) {
        return Promise.resolve(undefined);
    }
    const updatedAnnouncement = { ...announcements[announcementIndex], ...announcementData };
    announcements[announcementIndex] = updatedAnnouncement;
    revalidatePath(`/announcements`);
    revalidatePath(`/announcements/${id}`);
    return Promise.resolve(updatedAnnouncement);
}

export async function deleteAnnouncement(id: string): Promise<void> {
    const announcementIndex = announcements.findIndex((a) => a.id === id);
    if (announcementIndex > -1) {
        announcements.splice(announcementIndex, 1);
    }
    revalidatePath('/announcements');
    return Promise.resolve();
}


export async function getSchedule(): Promise<ScheduleEvent[]> {
  return Promise.resolve(schedule.sort((a, b) => a.time.localeCompare(b.time)));
}

export async function getScheduleByTime(time: string): Promise<ScheduleEvent | undefined> {
  return Promise.resolve(schedule.find((s) => s.time === time));
}

export async function addSchedule(event: ScheduleEvent): Promise<ScheduleEvent> {
  // check if time already exists
  const existingEvent = schedule.find(e => e.time === event.time);
  if (existingEvent) {
    throw new Error("Waktu yang sama sudah ada di jadwal.");
  }
  schedule.push(event);
  revalidatePath('/schedule');
  return Promise.resolve(event);
}

export async function updateSchedule(time: string, event: ScheduleEvent): Promise<ScheduleEvent> {
  const eventIndex = schedule.findIndex((e) => e.time === time);
  if (eventIndex === -1) {
    throw new Error("Jadwal tidak ditemukan.");
  }
  schedule[eventIndex] = event;
  revalidatePath('/schedule');
  return Promise.resolve(event);
}

export async function deleteSchedule(time: string): Promise<void> {
    const eventIndex = schedule.findIndex((e) => e.time === time);
    if (eventIndex > -1) {
        schedule.splice(eventIndex, 1);
    }
    revalidatePath('/schedule');
    return Promise.resolve();
}

export async function getStats() {
    return Promise.resolve({
        totalStudents: students.length,
        averageAttendance: Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length) || 0,
        averageGrade: Math.round(students.reduce((acc, s) => acc + s.grades.reduce((gAcc, g) => gAcc + g.grade, 0) / (s.grades.length || 1), 0) / (students.length || 1)) || 0,
    });
}

export async function getCourses() {
    return Promise.resolve(courses);
}
