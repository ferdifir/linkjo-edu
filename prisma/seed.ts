import { PrismaClient } from '@prisma/client';
import type { Student, Course, Announcement, ScheduleEvent } from '../src/lib/types';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
 // Hapus data lama jika ada
 await prisma.attendanceRecord.deleteMany({});
  await prisma.grade.deleteMany({});
  await prisma.studentEnrollment.deleteMany({});
  await prisma.attendanceSession.deleteMany({});
  await prisma.schedule.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});

 // Tambahkan pengguna admin dan guru
  await prisma.user.create({
    data: {
      id: 'USR001',
      name: 'Admin Sekolah',
      email: 'admin@sekolah.edu',
      password: await hash('admin123', 10), // dalam produksi, pastikan untuk meng-hash password
      role: 'ADMIN',
    },
  });

  await prisma.user.create({
    data: {
      id: 'USR002',
      name: 'Bpk. Davis',
      email: 'davis@sekolah.edu',
      password: await hash('teacher123', 10), // dalam produksi, pastikan untuk meng-hash password
      role: 'TEACHER',
    },
  });

  await prisma.user.create({
    data: {
      id: 'USR003',
      name: 'Ibu Smith',
      email: 'smith@sekolah.edu',
      password: await hash('teacher123', 10), // dalam produksi, pastikan untuk meng-hash password
      role: 'TEACHER',
    },
  });

 // Data dummy untuk courses
  const coursesData = [
    { id: 'C101', name: 'Aljabar II', teacher: 'Bpk. Davis', schedule: 'Sen-Rab-Jum 9-10' },
    { id: 'C102', name: 'Sejarah Dunia', teacher: 'Ibu Smith', schedule: 'Sel-Kam 10-11:30' },
    { id: 'C103', name: 'Sastra Inggris', teacher: 'Bpk. Allen', schedule: 'Sen-Rab-Jum 11-12' },
    { id: 'C104', name: 'Biologi', teacher: 'Dr. Green', schedule: 'Sel-Kam 13-14:30' },
    { id: 'C105', name: 'Kimia', teacher: 'Ibu White', schedule: 'Sen-Rab-Jum 14-15' },
  ];

  // Tambahkan courses ke database
  for (const course of coursesData) {
    await prisma.course.create({
      data: {
        id: course.id,
        name: course.name,
        teacher: course.teacher,
        schedule: course.schedule,
      },
    });
  }

 // Data dummy untuk students
  const studentsData = [
    {
      id: 'S001',
      name: 'Liam Johnson',
      email: 'liam.johnson@example.com',
      class: 'Kelas 10',
      avatar: 'student-1',
      nfcCardId: '04-6A-A9-C5-25-3C-80',
      grades: [
        { subject: 'Aljabar II', assignment: 'Ujian Tengah Semester', grade: 88 },
        { subject: 'Sejarah Dunia', assignment: 'Makalah Penelitian', grade: 92 },
        { subject: 'Sastra Inggris', assignment: 'Esai', grade: 85 },
        { subject: 'Biologi', assignment: 'Laporan Lab', grade: 95 },
      ],
      courses: [coursesData[0], coursesData[1], coursesData[2], coursesData[3]],
    },
    {
      id: 'S002',
      name: 'Olivia Smith',
      email: 'olivia.smith@example.com',
      class: 'Kelas 10',
      avatar: 'student-2',
      nfcCardId: '04-F9-C3-B4-2E-5A-80',
      grades: [
        { subject: 'Aljabar II', assignment: 'Ujian Tengah Semester', grade: 94 },
        { subject: 'Sejarah Dunia', assignment: 'Makalah Penelitian', grade: 89 },
        { subject: 'Sastra Inggris', assignment: 'Esai', grade: 91 },
        { subject: 'Biologi', assignment: 'Laporan Lab', grade: 97 },
      ],
      courses: [coursesData[0], coursesData[1], coursesData[2], coursesData[3]],
    },
    {
      id: 'S003',
      name: 'Noah Williams',
      email: 'noah.williams@example.com',
      class: 'Kelas 11',
      avatar: 'student-3',
      nfcCardId: '04-12-34-56-78-9A-BC',
      grades: [
        { subject: 'Kimia', assignment: 'Proyek Akhir', grade: 76 },
        { subject: 'Sejarah Dunia', assignment: 'Presentasi', grade: 81 },
        { subject: 'Sastra Inggris', assignment: 'Analisis Puisi', grade: 79 },
        { subject: 'Biologi', assignment: 'Ujian Tengah Semester', grade: 85 },
      ],
      courses: [coursesData[4], coursesData[1], coursesData[2], coursesData[3]],
    },
    {
      id: 'S004',
      name: 'Emma Brown',
      email: 'emma.brown@example.com',
      class: 'Kelas 11',
      avatar: 'student-4',
      nfcCardId: '04-DE-F0-12-34-56-78',
      grades: [
        { subject: 'Kimia', assignment: 'Proyek Akhir', grade: 95 },
        { subject: 'Sejarah Dunia', assignment: 'Presentasi', grade: 98 },
        { subject: 'Sastra Inggris', assignment: 'Analisis Puisi', grade: 92 },
        { subject: 'Biologi', assignment: 'Ujian Tengah Semester', grade: 89 },
      ],
      courses: [coursesData[4], coursesData[1], coursesData[2], coursesData[3]],
    },
    {
      id: 'S005',
      name: 'James Jones',
      email: 'james.jones@example.com',
      class: 'Kelas 10',
      avatar: 'student-5',
      nfcCardId: '04-98-76-54-32-10-FE',
      grades: [
        { subject: 'Aljabar II', assignment: 'Ujian Tengah Semester', grade: 82 },
        { subject: 'Sejarah Dunia', assignment: 'Makalah Penelitian', grade: 88 },
        { subject: 'Sastra Inggris', assignment: 'Esai', grade: 85 },
        { subject: 'Biologi', assignment: 'Laporan Lab', grade: 90 },
      ],
      courses: [coursesData[0], coursesData[1], coursesData[2], coursesData[3]],
    },
  ];

  // Tambahkan students dan grades ke database
  for (const student of studentsData) {
    await prisma.student.create({
      data: {
        id: student.id,
        name: student.name,
        email: student.email,
        class: student.class,
        avatar: student.avatar,
        nfcCardId: student.nfcCardId,
      },
    });

    // Tambahkan grades
    for (const grade of student.grades) {
      const course = coursesData.find(c => c.name === grade.subject);
      if (course) {
        await prisma.grade.create({
          data: {
            id: `${student.id}-${course.id}-${Date.now()}`,
            assignment: grade.assignment,
            grade: grade.grade,
            studentId: student.id,
            courseId: course.id,
          },
        });
      }
    }

    // Tambahkan enrollments
    for (const course of student.courses) {
      await prisma.studentEnrollment.create({
        data: {
          id: `${student.id}-${course.id}-${Date.now()}`,
          studentId: student.id,
          courseId: course.id,
        },
      });
    }
  }

 // Data dummy untuk announcements
  const announcementsData = [
    {
      id: 'A001',
      title: 'Konferensi Orang Tua-Guru',
      content: 'Konferensi orang tua-guru akan diadakan minggu depan pada tanggal 15 dan 16 November. Silakan mendaftar untuk slot waktu dengan guru siswa Anda.',
      date: new Date('2023-11-05'),
      author: 'Kepala Sekolah Miller',
    },
    {
      id: 'A002',
      title: 'Pekan Semangat Sekolah',
      content: 'Bersiaplah untuk Pekan Semangat mulai Senin depan! Setiap hari memiliki tema yang berbeda: Senin - Hari Piyama, Selasa - Hari Kembar, Rabu - Hari Topi Aneh, Kamis - Kamis Jadul, Jumat - Hari Warna Sekolah.',
      date: new Date('2023-11-04'),
      author: 'OSIS',
    },
    {
      id: 'A003',
      title: 'Jadwal Ujian Tengah Semester',
      content: 'Ujian tengah semester akan segera tiba. Jadwal telah diposting di situs web sekolah. Harap tinjau dan persiapkan diri dengan baik. Semoga berhasil untuk semua siswa!',
      date: new Date('2023-11-02'),
      author: 'Administrasi',
    },
  ];

  // Tambahkan announcements ke database
  for (const announcement of announcementsData) {
    await prisma.announcement.create({
      data: {
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        author: announcement.author,
        date: announcement.date,
      },
    });
  }

  // Data dummy untuk Academic Year dan Semester - cek dulu apakah sudah ada
  let academicYear = await prisma.academicYear.findUnique({
    where: { id: 'ACY001' }
  });

  if (!academicYear) {
    academicYear = await prisma.academicYear.create({
      data: {
        id: 'ACY001',
        year: '2023/2024',
        description: 'Tahun Ajaran 2023/2024',
        isActive: true,
      },
    });
  }

  let semester = await prisma.semester.findUnique({
    where: { id: 'SEM001' }
  });

  if (!semester) {
    semester = await prisma.semester.create({
      data: {
        id: 'SEM001',
        name: 'Ganjil',
        startDate: new Date('2023-08-01'),
        endDate: new Date('2024-01-31'),
        academicYearId: academicYear.id,
      },
    });
  }

  // Data dummy untuk schedule - ubah struktur untuk menyesuaikan schema baru
  const scheduleData = [
    { time: '9:00 - 10:00', dayOfWeek: 'MONDAY' as const, course: 'Aljabar II', teacher: 'Bpk. Davis' },
    { time: '9:00 - 10:00', dayOfWeek: 'WEDNESDAY' as const, course: 'Aljabar II', teacher: 'Bpk. Davis' },
    { time: '9:00 - 10:00', dayOfWeek: 'FRIDAY' as const, course: 'Aljabar II', teacher: 'Bpk. Davis' },
    { time: '10:00 - 11:30', dayOfWeek: 'TUESDAY' as const, course: 'Sejarah Dunia', teacher: 'Ibu Smith' },
    { time: '10:00 - 11:30', dayOfWeek: 'THURSDAY' as const, course: 'Sejarah Dunia', teacher: 'Ibu Smith' },
    { time: '1:00 - 12:00', dayOfWeek: 'MONDAY' as const, course: 'Sastra Inggris', teacher: 'Bpk. Allen' },
    { time: '11:00 - 12:00', dayOfWeek: 'WEDNESDAY' as const, course: 'Sastra Inggris', teacher: 'Bpk. Allen' },
    { time: '11:00 - 12:00', dayOfWeek: 'FRIDAY' as const, course: 'Sastra Inggris', teacher: 'Bpk. Allen' },
    { time: '12:00 - 13:00', dayOfWeek: 'MONDAY' as const, course: 'Makan Siang', teacher: '' },
    { time: '12:00 - 13:00', dayOfWeek: 'TUESDAY' as const, course: 'Makan Siang', teacher: '' },
    { time: '12:00 - 13:00', dayOfWeek: 'WEDNESDAY' as const, course: 'Makan Siang', teacher: '' },
    { time: '12:00 - 13:00', dayOfWeek: 'THURSDAY' as const, course: 'Makan Siang', teacher: '' },
    { time: '12:00 - 13:00', dayOfWeek: 'FRIDAY' as const, course: 'Makan Siang', teacher: '' },
    { time: '13:00 - 14:30', dayOfWeek: 'TUESDAY' as const, course: 'Biologi', teacher: 'Dr. Green' },
    { time: '13:00 - 14:30', dayOfWeek: 'THURSDAY' as const, course: 'Biologi', teacher: 'Dr. Green' },
    { time: '14:00 - 15:00', dayOfWeek: 'MONDAY' as const, course: 'Kimia', teacher: 'Ibu White' },
    { time: '14:00 - 15:00', dayOfWeek: 'WEDNESDAY' as const, course: 'Kimia', teacher: 'Ibu White' },
    { time: '14:00 - 15:00', dayOfWeek: 'FRIDAY' as const, course: 'Kimia', teacher: 'Ibu White' },
 ];

  // Tambahkan schedule ke database
  for (const schedule of scheduleData) {
    const courseId = coursesData.find(c => c.name === schedule.course)?.id;
    
    if (courseId) {
      await prisma.schedule.create({
        data: {
          id: `SCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          time: schedule.time,
          dayOfWeek: schedule.dayOfWeek,
          courseId: courseId,
          teacherName: schedule.teacher,
          class: 'Kelas Umum', // Default class
          academicYearId: academicYear.id,
          semesterId: semester.id,
        },
      });
    } else {
      // Jika tidak ada course (misalnya 'Makan Siang'), buat schedule tanpa course
      await prisma.schedule.create({
        data: {
          id: `SCH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          time: schedule.time,
          dayOfWeek: schedule.dayOfWeek,
          courseId: coursesData[0].id, // Gunakan course pertama sebagai default
          teacherName: schedule.teacher,
          class: 'Kelas Umum',
          academicYearId: academicYear.id,
          semesterId: semester.id,
        },
      });
    }
 }

  // Data dummy untuk Locations dan Classrooms
  const locationsData = [
    { id: 'LOC001', name: 'Gedung Utama', description: 'Gedung utama sekolah dengan fasilitas lengkap' },
    { id: 'LOC002', name: 'Gedung Barat', description: 'Gedung barat yang digunakan untuk kelas-kelas tambahan' },
    { id: 'LOC003', name: 'Laboratorium', description: 'Gedung yang berisi laboratorium sains dan komputer' },
  ];

  // Tambahkan locations ke database
  for (const location of locationsData) {
    await prisma.location.create({
      data: {
        id: location.id,
        name: location.name,
        description: location.description,
      },
    });
  }

  // Data dummy untuk Classrooms
  const classroomsData = [
    { id: 'CLS001', name: 'Kelas 101', code: 'KLS-101', locationId: 'LOC001', capacity: 30, description: 'Kelas reguler untuk siswa kelas 10' },
    { id: 'CLS002', name: 'Kelas 102', code: 'KLS-102', locationId: 'LOC001', capacity: 30, description: 'Kelas reguler untuk siswa kelas 10' },
    { id: 'CLS003', name: 'Kelas 103', code: 'KLS-103', locationId: 'LOC001', capacity: 30, description: 'Kelas reguler untuk siswa kelas 11' },
    { id: 'CLS004', name: 'Kelas 104', code: 'KLS-104', locationId: 'LOC001', capacity: 30, description: 'Kelas reguler untuk siswa kelas 11' },
    { id: 'CLS005', name: 'Kelas 105', code: 'KLS-105', locationId: 'LOC001', capacity: 30, description: 'Kelas reguler untuk siswa kelas 12' },
    { id: 'CLS006', name: 'Laboratorium Komputer', code: 'LAB-COMP', locationId: 'LOC003', capacity: 20, description: 'Laboratorium komputer dengan 20 unit PC' },
    { id: 'CLS007', name: 'Laboratorium Biologi', code: 'LAB-BIO', locationId: 'LOC003', capacity: 15, description: 'Laboratorium biologi dengan fasilitas lengkap' },
    { id: 'CLS008', name: 'Laboratorium Kimia', code: 'LAB-CHEM', locationId: 'LOC003', capacity: 15, description: 'Laboratorium kimia dengan fasilitas lengkap' },
  ];

  // Tambahkan classrooms ke database
  for (const classroom of classroomsData) {
    await prisma.classroom.create({
      data: {
        id: classroom.id,
        name: classroom.name,
        code: classroom.code,
        locationId: classroom.locationId,
        capacity: classroom.capacity,
        description: classroom.description,
        isActive: true,
      },
    });
  }

  console.log('Data dummy berhasil dimasukkan ke database');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
