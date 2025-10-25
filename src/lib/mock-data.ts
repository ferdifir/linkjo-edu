import type { Student, Course, Announcement, ScheduleEvent } from './types';

export const courses: Course[] = [
  { id: 'C101', name: 'Algebra II', teacher: 'Mr. Davis', schedule: 'MWF 9-10AM' },
  { id: 'C102', name: 'World History', teacher: 'Ms. Smith', schedule: 'TTh 10-11:30AM' },
  { id: 'C103', name: 'English Literature', teacher: 'Mr. Allen', schedule: 'MWF 11-12PM' },
  { id: 'C104', name: 'Biology', teacher: 'Dr. Green', schedule: 'TTh 1-2:30PM' },
  { id: 'C105', name: 'Chemistry', teacher: 'Ms. White', schedule: 'MWF 2-3PM' },
];

export const students: Student[] = [
  {
    id: 'S001',
    name: 'Liam Johnson',
    email: 'liam.johnson@example.com',
    class: 'Grade 10',
    avatar: 'student-1',
    attendance: 95,
    grades: [
      { subject: 'Algebra II', assignment: 'Midterm Exam', grade: 88 },
      { subject: 'World History', assignment: 'Research Paper', grade: 92 },
      { subject: 'English Literature', assignment: 'Essay', grade: 85 },
      { subject: 'Biology', assignment: 'Lab Report', grade: 95 },
    ],
    courses: [courses[0], courses[1], courses[2], courses[3]],
  },
  {
    id: 'S002',
    name: 'Olivia Smith',
    email: 'olivia.smith@example.com',
    class: 'Grade 10',
    avatar: 'student-2',
    attendance: 98,
    grades: [
      { subject: 'Algebra II', assignment: 'Midterm Exam', grade: 94 },
      { subject: 'World History', assignment: 'Research Paper', grade: 89 },
      { subject: 'English Literature', assignment: 'Essay', grade: 91 },
      { subject: 'Biology', assignment: 'Lab Report', grade: 97 },
    ],
    courses: [courses[0], courses[1], courses[2], courses[3]],
  },
  {
    id: 'S003',
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    class: 'Grade 11',
    avatar: 'student-3',
    attendance: 82,
    grades: [
      { subject: 'Chemistry', assignment: 'Final Project', grade: 76 },
      { subject: 'World History', assignment: 'Presentation', grade: 81 },
      { subject: 'English Literature', assignment: 'Poetry Analysis', grade: 79 },
      { subject: 'Biology', assignment: 'Midterm', grade: 85 },
    ],
    courses: [courses[4], courses[1], courses[2], courses[3]],
  },
  {
    id: 'S004',
    name: 'Emma Brown',
    email: 'emma.brown@example.com',
    class: 'Grade 11',
    avatar: 'student-4',
    attendance: 99,
    grades: [
      { subject: 'Chemistry', assignment: 'Final Project', grade: 95 },
      { subject: 'World History', assignment: 'Presentation', grade: 98 },
      { subject: 'English Literature', assignment: 'Poetry Analysis', grade: 92 },
      { subject: 'Biology', assignment: 'Midterm', grade: 89 },
    ],
    courses: [courses[4], courses[1], courses[2], courses[3]],
  },
    {
    id: 'S005',
    name: 'James Jones',
    email: 'james.jones@example.com',
    class: 'Grade 10',
    avatar: 'student-5',
    attendance: 91,
    grades: [
      { subject: 'Algebra II', assignment: 'Midterm Exam', grade: 82 },
      { subject: 'World History', assignment: 'Research Paper', grade: 88 },
      { subject: 'English Literature', assignment: 'Essay', grade: 85 },
      { subject: 'Biology', assignment: 'Lab Report', grade: 90 },
    ],
    courses: [courses[0], courses[1], courses[2], courses[3]],
  },
];

export const announcements: Announcement[] = [
  {
    id: 'A001',
    title: 'Parent-Teacher Conferences',
    content: 'Parent-Teacher conferences will be held next week on November 15th and 16th. Please sign up for a time slot with your student\'s teachers.',
    date: '2023-11-05',
    author: 'Principal Miller',
  },
  {
    id: 'A002',
    title: 'School Spirit Week',
    content: 'Get ready for Spirit Week starting next Monday! Each day has a different theme: Monday - Pajama Day, Tuesday - Twin Day, Wednesday - Wacky Hat Day, Thursday - Throwback Thursday, Friday - School Colors Day.',
    date: '2023-11-04',
    author: 'Student Council',
  },
  {
    id: 'A003',
    title: 'Midterm Exams Schedule',
    content: 'Midterm exams are approaching. The schedule has been posted on the school website. Please review it and prepare accordingly. Good luck to all students!',
    date: '2023-11-02',
    author: 'Administration',
  },
];

export const schedule: ScheduleEvent[] = [
  { time: '9:00 - 10:00', monday: { course: 'Algebra II', teacher: 'Mr. Davis' }, wednesday: { course: 'Algebra II', teacher: 'Mr. Davis' }, friday: { course: 'Algebra II', teacher: 'Mr. Davis' } },
  { time: '10:00 - 11:30', tuesday: { course: 'World History', teacher: 'Ms. Smith' }, thursday: { course: 'World History', teacher: 'Ms. Smith' } },
  { time: '11:00 - 12:00', monday: { course: 'English Literature', teacher: 'Mr. Allen' }, wednesday: { course: 'English Literature', teacher: 'Mr. Allen' }, friday: { course: 'English Literature', teacher: 'Mr. Allen' } },
  { time: '12:00 - 1:00', monday: { course: 'Lunch', teacher: ''}, tuesday: { course: 'Lunch', teacher: ''}, wednesday: { course: 'Lunch', teacher: ''}, thursday: { course: 'Lunch', teacher: ''}, friday: { course: 'Lunch', teacher: ''} },
  { time: '1:00 - 2:30', tuesday: { course: 'Biology', teacher: 'Dr. Green' }, thursday: { course: 'Biology', teacher: 'Dr. Green' } },
  { time: '2:00 - 3:00', monday: { course: 'Chemistry', teacher: 'Ms. White' }, wednesday: { course: 'Chemistry', teacher: 'Ms. White' }, friday: { course: 'Chemistry', teacher: 'Ms. White' } },
];
