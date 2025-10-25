import type { Student, Course, Announcement, ScheduleEvent } from './types';

export const courses: Course[] = [
  { id: 'C101', name: 'Aljabar II', teacher: 'Bpk. Davis', schedule: 'Sen-Rab-Jum 9-10' },
  { id: 'C102', name: 'Sejarah Dunia', teacher: 'Ibu Smith', schedule: 'Sel-Kam 10-11:30' },
  { id: 'C103', name: 'Sastra Inggris', teacher: 'Bpk. Allen', schedule: 'Sen-Rab-Jum 11-12' },
  { id: 'C104', name: 'Biologi', teacher: 'Dr. Green', schedule: 'Sel-Kam 13-14:30' },
  { id: 'C105', name: 'Kimia', teacher: 'Ibu White', schedule: 'Sen-Rab-Jum 14-15' },
];

export let students: Student[] = [
  {
    id: 'S001',
    name: 'Liam Johnson',
    email: 'liam.johnson@example.com',
    class: 'Kelas 10',
    avatar: 'student-1',
    attendance: 95,
    grades: [
      { subject: 'Aljabar II', assignment: 'Ujian Tengah Semester', grade: 88 },
      { subject: 'Sejarah Dunia', assignment: 'Makalah Penelitian', grade: 92 },
      { subject: 'Sastra Inggris', assignment: 'Esai', grade: 85 },
      { subject: 'Biologi', assignment: 'Laporan Lab', grade: 95 },
    ],
    courses: [courses[0], courses[1], courses[2], courses[3]],
  },
  {
    id: 'S002',
    name: 'Olivia Smith',
    email: 'olivia.smith@example.com',
    class: 'Kelas 10',
    avatar: 'student-2',
    attendance: 98,
    grades: [
      { subject: 'Aljabar II', assignment: 'Ujian Tengah Semester', grade: 94 },
      { subject: 'Sejarah Dunia', assignment: 'Makalah Penelitian', grade: 89 },
      { subject: 'Sastra Inggris', assignment: 'Esai', grade: 91 },
      { subject: 'Biologi', assignment: 'Laporan Lab', grade: 97 },
    ],
    courses: [courses[0], courses[1], courses[2], courses[3]],
  },
  {
    id: 'S003',
    name: 'Noah Williams',
    email: 'noah.williams@example.com',
    class: 'Kelas 11',
    avatar: 'student-3',
    attendance: 82,
    grades: [
      { subject: 'Kimia', assignment: 'Proyek Akhir', grade: 76 },
      { subject: 'Sejarah Dunia', assignment: 'Presentasi', grade: 81 },
      { subject: 'Sastra Inggris', assignment: 'Analisis Puisi', grade: 79 },
      { subject: 'Biologi', assignment: 'Ujian Tengah Semester', grade: 85 },
    ],
    courses: [courses[4], courses[1], courses[2], courses[3]],
  },
  {
    id: 'S004',
    name: 'Emma Brown',
    email: 'emma.brown@example.com',
    class: 'Kelas 11',
    avatar: 'student-4',
    attendance: 99,
    grades: [
      { subject: 'Kimia', assignment: 'Proyek Akhir', grade: 95 },
      { subject: 'Sejarah Dunia', assignment: 'Presentasi', grade: 98 },
      { subject: 'Sastra Inggris', assignment: 'Analisis Puisi', grade: 92 },
      { subject: 'Biologi', assignment: 'Ujian Tengah Semester', grade: 89 },
    ],
    courses: [courses[4], courses[1], courses[2], courses[3]],
  },
    {
    id: 'S005',
    name: 'James Jones',
    email: 'james.jones@example.com',
    class: 'Kelas 10',
    avatar: 'student-5',
    attendance: 91,
    grades: [
      { subject: 'Aljabar II', assignment: 'Ujian Tengah Semester', grade: 82 },
      { subject: 'Sejarah Dunia', assignment: 'Makalah Penelitian', grade: 88 },
      { subject: 'Sastra Inggris', assignment: 'Esai', grade: 85 },
      { subject: 'Biologi', assignment: 'Laporan Lab', grade: 90 },
    ],
    courses: [courses[0], courses[1], courses[2], courses[3]],
  },
];

export const announcements: Announcement[] = [
  {
    id: 'A001',
    title: 'Konferensi Orang Tua-Guru',
    content: 'Konferensi orang tua-guru akan diadakan minggu depan pada tanggal 15 dan 16 November. Silakan mendaftar untuk slot waktu dengan guru siswa Anda.',
    date: '2023-11-05',
    author: 'Kepala Sekolah Miller',
  },
  {
    id: 'A002',
    title: 'Pekan Semangat Sekolah',
    content: 'Bersiaplah untuk Pekan Semangat mulai Senin depan! Setiap hari memiliki tema yang berbeda: Senin - Hari Piyama, Selasa - Hari Kembar, Rabu - Hari Topi Aneh, Kamis - Kamis Jadul, Jumat - Hari Warna Sekolah.',
    date: '2023-11-04',
    author: 'OSIS',
  },
  {
    id: 'A003',
    title: 'Jadwal Ujian Tengah Semester',
    content: 'Ujian tengah semester akan segera tiba. Jadwal telah diposting di situs web sekolah. Harap tinjau dan persiapkan diri dengan baik. Semoga berhasil untuk semua siswa!',
    date: '2023-11-02',
    author: 'Administrasi',
  },
];

export const schedule: ScheduleEvent[] = [
  { time: '9:00 - 10:00', monday: { course: 'Aljabar II', teacher: 'Bpk. Davis' }, wednesday: { course: 'Aljabar II', teacher: 'Bpk. Davis' }, friday: { course: 'Aljabar II', teacher: 'Bpk. Davis' } },
  { time: '10:00 - 11:30', tuesday: { course: 'Sejarah Dunia', teacher: 'Ibu Smith' }, thursday: { course: 'Sejarah Dunia', teacher: 'Ibu Smith' } },
  { time: '11:00 - 12:00', monday: { course: 'Sastra Inggris', teacher: 'Bpk. Allen' }, wednesday: { course: 'Sastra Inggris', teacher: 'Bpk. Allen' }, friday: { course: 'Sastra Inggris', teacher: 'Bpk. Allen' } },
  { time: '12:00 - 1:00', monday: { course: 'Makan Siang', teacher: ''}, tuesday: { course: 'Makan Siang', teacher: ''}, wednesday: { course: 'Makan Siang', teacher: ''}, thursday: { course: 'Makan Siang', teacher: ''}, friday: { course: 'Makan Siang', teacher: ''} },
  { time: '1:00 - 2:30', tuesday: { course: 'Biologi', teacher: 'Dr. Green' }, thursday: { course: 'Biologi', teacher: 'Dr. Green' } },
  { time: '2:00 - 3:00', monday: { course: 'Kimia', teacher: 'Ibu White' }, wednesday: { course: 'Kimia', teacher: 'Ibu White' }, friday: { course: 'Kimia', teacher: 'Ibu White' } },
];
