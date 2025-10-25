export interface Grade {
  assignment: string;
  subject: string;
  grade: number;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  avatar: string; // id from placeholder-images.json
  attendance: number;
  grades: Grade[];
  courses: Course[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface ScheduleEvent {
  time: string;
  monday?: { course: string; teacher: string };
  tuesday?: { course: string; teacher: string };
  wednesday?: { course: string; teacher: string };
  thursday?: { course: string; teacher: string };
  friday?: { course: string; teacher: string };
}
