import { PrismaClient } from '@prisma/client';
import type { Student, Announcement, ScheduleEvent, Grade, Course, AttendanceSession, StudentAttendance } from './types';
import { compare } from 'bcrypt';

const prisma = new PrismaClient();

// --- Authentication ---
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function authenticateUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email }
  });

  if (!user) {
    return null; // User not found
  }

  const isPasswordValid = await compare(credentials.password, user.password);

  if (!isPasswordValid) {
    return null; // Invalid password
  }

 return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toString() // Konversi enum ke string untuk memastikan kompatibilitas
  };
}

// --- Students ---
export async function getStudents(): Promise<Student[]> {
  const dbStudents = await prisma.student.findMany();
  const students: Student[] = [];

  for (const dbStudent of dbStudents) {
    const grades = await prisma.grade.findMany({
      where: { studentId: dbStudent.id },
      include: { course: true }
    });

    const courses = await prisma.studentEnrollment.findMany({
      where: { studentId: dbStudent.id },
      include: { course: true }
    });

    students.push({
      id: dbStudent.id,
      name: dbStudent.name,
      email: dbStudent.email,
      class: dbStudent.class,
      avatar: dbStudent.avatar || '',
      nfcCardId: dbStudent.nfcCardId || '',
      attendance: 0, // Kehadiran akan dihitung secara dinamis jika diperlukan
      grades: grades.map(g => ({
        subject: g.course.name,
        assignment: g.assignment,
        grade: Number(g.grade)
      })),
      courses: courses.map(c => ({
        id: c.course.id,
        name: c.course.name,
        teacher: c.course.teacher,
        schedule: c.course.schedule || ''
      }))
    });
  }

  return students;
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const dbStudent = await prisma.student.findUnique({
    where: { id }
  });

  if (!dbStudent) {
    return undefined;
  }

  const grades = await prisma.grade.findMany({
    where: { studentId: dbStudent.id },
    include: { course: true }
 });

  const courses = await prisma.studentEnrollment.findMany({
    where: { studentId: dbStudent.id },
    include: { course: true }
  });

  return {
    id: dbStudent.id,
    name: dbStudent.name,
    email: dbStudent.email,
    class: dbStudent.class,
    avatar: dbStudent.avatar || '',
    nfcCardId: dbStudent.nfcCardId || '',
    attendance: 0, // Kehadiran akan dihitung secara dinamis jika diperlukan
    grades: grades.map(g => ({
      subject: g.course.name,
      assignment: g.assignment,
      grade: Number(g.grade)
    })),
    courses: courses.map(c => ({
      id: c.course.id,
      name: c.course.name,
      teacher: c.course.teacher,
      schedule: c.course.schedule || ''
    }))
  };
}

export async function addStudent(studentData: Omit<Student, 'id' | 'grades' | 'courses' | 'avatar' | 'nfcCardId'>): Promise<Student> {
  const newId = `S${String(Date.now())}`;
  const newStudent = await prisma.student.create({
    data: {
      id: newId,
      name: studentData.name,
      email: studentData.email,
      class: studentData.class,
      avatar: `student-${(Math.floor(Math.random() * 5) + 1)}`,
      nfcCardId: `CARD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    }
  });

  return {
    id: newStudent.id,
    name: newStudent.name,
    email: newStudent.email,
    class: newStudent.class,
    avatar: newStudent.avatar || '',
    nfcCardId: newStudent.nfcCardId || '',
    attendance: 0,
    grades: [],
    courses: []
  };
}

export async function updateStudent(id: string, studentData: Partial<Omit<Student, 'id'>>): Promise<Student | undefined> {
  const updatedStudent = await prisma.student.update({
    where: { id },
    data: {
      name: studentData.name,
      email: studentData.email,
      class: studentData.class,
    }
  });

  if (!updatedStudent) {
    return undefined;
 }

  const grades = await prisma.grade.findMany({
    where: { studentId: updatedStudent.id },
    include: { course: true }
 });

  const courses = await prisma.studentEnrollment.findMany({
    where: { studentId: updatedStudent.id },
    include: { course: true }
  });

  return {
    id: updatedStudent.id,
    name: updatedStudent.name,
    email: updatedStudent.email,
    class: updatedStudent.class,
    avatar: updatedStudent.avatar || '',
    nfcCardId: updatedStudent.nfcCardId || '',
    attendance: 0,
    grades: grades.map(g => ({
      subject: g.course.name,
      assignment: g.assignment,
      grade: Number(g.grade)
    })),
    courses: courses.map(c => ({
      id: c.course.id,
      name: c.course.name,
      teacher: c.course.teacher,
      schedule: c.course.schedule || ''
    }))
  };
}

export async function deleteStudent(id: string): Promise<void> {
  await prisma.student.delete({
    where: { id }
  });
}


// --- Announcements ---
export async function getAnnouncements(): Promise<Announcement[]> {
  const dbAnnouncements = await prisma.announcement.findMany({
    orderBy: { date: 'desc' }
  });

  return dbAnnouncements.map(a => ({
    id: a.id,
    title: a.title,
    content: a.content,
    date: a.date.toISOString().split('T')[0],
    author: a.author
  }));
}

export async function getAnnouncementById(id: string): Promise<Announcement | undefined> {
  const dbAnnouncement = await prisma.announcement.findUnique({
    where: { id }
  });

  if (!dbAnnouncement) {
    return undefined;
  }

  return {
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    date: dbAnnouncement.date.toISOString().split('T')[0],
    author: dbAnnouncement.author
  };
}

export async function addAnnouncement(announcementData: Omit<Announcement, 'id' | 'date'>): Promise<Announcement> {
  const newAnnouncement = await prisma.announcement.create({
    data: {
      title: announcementData.title,
      content: announcementData.content,
      author: announcementData.author,
      date: new Date()
    }
  });

  return {
    id: newAnnouncement.id,
    title: newAnnouncement.title,
    content: newAnnouncement.content,
    date: newAnnouncement.date.toISOString().split('T')[0],
    author: newAnnouncement.author
 };
}

export async function updateAnnouncement(id: string, announcementData: Partial<Omit<Announcement, 'id'>>): Promise<Announcement | undefined> {
  const updatedAnnouncement = await prisma.announcement.update({
    where: { id },
    data: {
      title: announcementData.title,
      content: announcementData.content,
      author: announcementData.author
    }
  });

  return {
    id: updatedAnnouncement.id,
    title: updatedAnnouncement.title,
    content: updatedAnnouncement.content,
    date: updatedAnnouncement.date.toISOString().split('T')[0],
    author: updatedAnnouncement.author
 };
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await prisma.announcement.delete({
    where: { id }
 });
}

// --- Schedule ---
export async function getSchedule(): Promise<ScheduleEvent[]> {
  const dbSchedules = await prisma.schedule.findMany({
    orderBy: { time: 'asc' }
  });

  const scheduleEvents: ScheduleEvent[] = [];

  for (const dbSchedule of dbSchedules) {
    const scheduleEvent: ScheduleEvent = {
      time: dbSchedule.time
    };

    if (dbSchedule.mondayCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: dbSchedule.mondayCourseId }
      });
      if (course) {
        scheduleEvent.monday = {
          course: course.name,
          teacher: course.teacher
        };
      }
    }

    if (dbSchedule.tuesdayCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: dbSchedule.tuesdayCourseId }
      });
      if (course) {
        scheduleEvent.tuesday = {
          course: course.name,
          teacher: course.teacher
        };
      }
    }

    if (dbSchedule.wednesdayCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: dbSchedule.wednesdayCourseId }
      });
      if (course) {
        scheduleEvent.wednesday = {
          course: course.name,
          teacher: course.teacher
        };
      }
    }

    if (dbSchedule.thursdayCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: dbSchedule.thursdayCourseId }
      });
      if (course) {
        scheduleEvent.thursday = {
          course: course.name,
          teacher: course.teacher
        };
      }
    }

    if (dbSchedule.fridayCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: dbSchedule.fridayCourseId }
      });
      if (course) {
        scheduleEvent.friday = {
          course: course.name,
          teacher: course.teacher
        };
      }
    }

    scheduleEvents.push(scheduleEvent);
  }

  return scheduleEvents;
}

export async function getScheduleByTime(time: string): Promise<ScheduleEvent | undefined> {
  const dbSchedule = await prisma.schedule.findFirst({
    where: { time }
  });

  if (!dbSchedule) {
    return undefined;
  }

  const scheduleEvent: ScheduleEvent = {
    time: dbSchedule.time
  };

  if (dbSchedule.mondayCourseId) {
    const course = await prisma.course.findUnique({
      where: { id: dbSchedule.mondayCourseId }
    });
    if (course) {
      scheduleEvent.monday = {
        course: course.name,
        teacher: course.teacher
      };
    }
 }

  if (dbSchedule.tuesdayCourseId) {
    const course = await prisma.course.findUnique({
      where: { id: dbSchedule.tuesdayCourseId }
    });
    if (course) {
      scheduleEvent.tuesday = {
        course: course.name,
        teacher: course.teacher
      };
    }
  }

  if (dbSchedule.wednesdayCourseId) {
    const course = await prisma.course.findUnique({
      where: { id: dbSchedule.wednesdayCourseId }
    });
    if (course) {
      scheduleEvent.wednesday = {
        course: course.name,
        teacher: course.teacher
      };
    }
  }

  if (dbSchedule.thursdayCourseId) {
    const course = await prisma.course.findUnique({
      where: { id: dbSchedule.thursdayCourseId }
    });
    if (course) {
      scheduleEvent.thursday = {
        course: course.name,
        teacher: course.teacher
      };
    }
  }

  if (dbSchedule.fridayCourseId) {
    const course = await prisma.course.findUnique({
      where: { id: dbSchedule.fridayCourseId }
    });
    if (course) {
      scheduleEvent.friday = {
        course: course.name,
        teacher: course.teacher
      };
    }
  }

  return scheduleEvent;
}

export async function addSchedule(event: ScheduleEvent): Promise<ScheduleEvent> {
  const existingEvent = await prisma.schedule.findFirst({
    where: { time: event.time }
  });
  if (existingEvent) {
    throw new Error("Waktu yang sama sudah ada di jadwal.");
  }

  await prisma.schedule.create({
    data: {
      time: event.time,
      mondayCourseId: event.monday ? (await prisma.course.findFirst({ where: { name: event.monday.course } }))?.id : null,
      mondayTeacher: event.monday?.teacher || null,
      tuesdayCourseId: event.tuesday ? (await prisma.course.findFirst({ where: { name: event.tuesday.course } }))?.id : null,
      tuesdayTeacher: event.tuesday?.teacher || null,
      wednesdayCourseId: event.wednesday ? (await prisma.course.findFirst({ where: { name: event.wednesday.course } }))?.id : null,
      wednesdayTeacher: event.wednesday?.teacher || null,
      thursdayCourseId: event.thursday ? (await prisma.course.findFirst({ where: { name: event.thursday.course } }))?.id : null,
      thursdayTeacher: event.thursday?.teacher || null,
      fridayCourseId: event.friday ? (await prisma.course.findFirst({ where: { name: event.friday.course } }))?.id : null,
      fridayTeacher: event.friday?.teacher || null,
    }
 });

  return event;
}

export async function updateSchedule(time: string, event: ScheduleEvent): Promise<ScheduleEvent> {
  const dbSchedule = await prisma.schedule.findFirst({
    where: { time }
  });

  if (!dbSchedule) {
    throw new Error("Jadwal tidak ditemukan.");
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id: dbSchedule.id },
    data: {
      mondayCourseId: event.monday ? (await prisma.course.findFirst({ where: { name: event.monday.course } }))?.id : null,
      mondayTeacher: event.monday?.teacher || null,
      tuesdayCourseId: event.tuesday ? (await prisma.course.findFirst({ where: { name: event.tuesday.course } }))?.id : null,
      tuesdayTeacher: event.tuesday?.teacher || null,
      wednesdayCourseId: event.wednesday ? (await prisma.course.findFirst({ where: { name: event.wednesday.course } }))?.id : null,
      wednesdayTeacher: event.wednesday?.teacher || null,
      thursdayCourseId: event.thursday ? (await prisma.course.findFirst({ where: { name: event.thursday.course } }))?.id : null,
      thursdayTeacher: event.thursday?.teacher || null,
      fridayCourseId: event.friday ? (await prisma.course.findFirst({ where: { name: event.friday.course } }))?.id : null,
      fridayTeacher: event.friday?.teacher || null,
    }
  });

  return event;
}

export async function deleteSchedule(time: string): Promise<void> {
  const dbSchedule = await prisma.schedule.findFirst({
    where: { time }
  });

 if (dbSchedule) {
    await prisma.schedule.delete({
      where: { id: dbSchedule.id }
    });
  }
}

// --- Stats & Courses ---
export async function getStats() {
  const totalStudents = await prisma.student.count();
  const allGrades = await prisma.grade.findMany();

  let averageGrade = 0;
  if (allGrades.length > 0) {
    const sumGrades = allGrades.reduce((sum, g) => sum + Number(g.grade), 0);
    averageGrade = Math.round(sumGrades / allGrades.length);
  }

  return {
    totalStudents,
    averageAttendance: 0, // Kehadiran akan dihitung secara dinamis jika diperlukan
    averageGrade
  };
}

export async function getCourses(): Promise<Course[]> {
 const dbCourses = await prisma.course.findMany();

  return dbCourses.map(c => ({
    id: c.id,
    name: c.name,
    teacher: c.teacher,
    schedule: c.schedule || ''
  }));
}

// --- Grades ---
export type GradeWithId = Grade & { id: string, studentId: string, studentName: string, studentAvatar: string };

export async function getGrades(): Promise<GradeWithId[]> {
 const dbGrades = await prisma.grade.findMany({
    include: {
      student: true,
      course: true
    }
 });

  return dbGrades.map(g => ({
    id: g.id,
    subject: g.course.name,
    assignment: g.assignment,
    grade: Number(g.grade),
    studentId: g.studentId,
    studentName: g.student.name,
    studentAvatar: g.student.avatar || ''
  }));
}

export async function getGradeById(gradeId: string): Promise<GradeWithId | undefined> {
  const dbGrade = await prisma.grade.findUnique({
    where: { id: gradeId },
    include: {
      student: true,
      course: true
    }
  });

  if (!dbGrade) {
    return undefined;
  }

  return {
    id: dbGrade.id,
    subject: dbGrade.course.name,
    assignment: dbGrade.assignment,
    grade: Number(dbGrade.grade),
    studentId: dbGrade.studentId,
    studentName: dbGrade.student.name,
    studentAvatar: dbGrade.student.avatar || ''
  };
}

type GradeInput = { studentId: string, subject: string, assignment: string, grade: number };

export async function addGrade(gradeData: GradeInput): Promise<Grade> {
  const course = await prisma.course.findFirst({
    where: { name: gradeData.subject }
  });

  if (!course) {
    throw new Error("Mata pelajaran tidak ditemukan.");
  }

  const newGrade = await prisma.grade.create({
    data: {
      assignment: gradeData.assignment,
      grade: gradeData.grade,
      studentId: gradeData.studentId,
      courseId: course.id
    }
  });

  return {
    subject: course.name,
    assignment: newGrade.assignment,
    grade: Number(newGrade.grade)
  };
}

export async function updateGrade(gradeId: string, gradeData: GradeInput): Promise<Grade> {
  const course = await prisma.course.findFirst({
    where: { name: gradeData.subject }
  });

  if (!course) {
    throw new Error("Mata pelajaran tidak ditemukan.");
  }

  const updatedGrade = await prisma.grade.update({
    where: { id: gradeId },
    data: {
      assignment: gradeData.assignment,
      grade: gradeData.grade,
      studentId: gradeData.studentId,
      courseId: course.id
    }
 });

  return {
    subject: course.name,
    assignment: updatedGrade.assignment,
    grade: Number(updatedGrade.grade)
  };
}

export async function deleteGrade(gradeId: string): Promise<void> {
  await prisma.grade.delete({
    where: { id: gradeId }
  });
}

// --- Attendance Sessions ---

export async function startAttendanceSession(courseName: string, teacherName: string): Promise<AttendanceSession> {
  const course = await prisma.course.findFirst({
    where: { name: courseName }
  });

  if (!course) {
    throw new Error(`Mata pelajaran ${courseName} tidak ditemukan`);
  }

  const enrolledStudents = await prisma.studentEnrollment.findMany({
    where: { courseId: course.id },
    include: { student: true }
 });

  if (enrolledStudents.length === 0) {
    throw new Error(`Tidak ada siswa yang terdaftar di mata pelajaran ${courseName}`);
  }

  const newSession = await prisma.attendanceSession.create({
    data: {
      courseId: course.id,
      teacherName,
      class: enrolledStudents[0]?.student.class || 'N/A',
      isActive: true,
      startTime: new Date(),
    }
  });

  // Buat record kehadiran untuk setiap siswa
  for (const enrollment of enrolledStudents) {
    await prisma.attendanceRecord.create({
      data: {
        sessionId: newSession.id,
        studentId: enrollment.studentId,
        status: 'ABSENT'
      }
    });
  }

  const sessionStudents: StudentAttendance[] = enrolledStudents.map(e => ({
    studentId: e.studentId,
    name: e.student.name,
    status: 'absent',
    avatar: e.student.avatar || ''
  }));

  return {
    id: newSession.id,
    courseName,
    teacherName,
    class: newSession.class,
    students: sessionStudents,
    isActive: newSession.isActive,
    startTime: newSession.startTime.toISOString()
  };
}

export async function getAttendanceSession(sessionId: string): Promise<AttendanceSession | undefined> {
  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    include: {
      course: true,
      records: {
        include: {
          student: true
        }
      }
    }
  });

  if (!session) {
    return undefined;
 }

  const sessionStudents: StudentAttendance[] = session.records.map(r => ({
    studentId: r.studentId,
    name: r.student.name,
    status: r.status.toLowerCase() as 'present' | 'absent',
    avatar: r.student.avatar || ''
  }));

  return {
    id: session.id,
    courseName: session.course.name,
    teacherName: session.teacherName,
    class: session.class,
    students: sessionStudents,
    isActive: session.isActive,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime ? session.endTime.toISOString() : undefined
  };
}

export async function markStudentPresent(sessionId: string, nfcCardId: string): Promise<StudentAttendance | undefined> {
  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId }
  });

  if (!session || !session.isActive) {
    throw new Error('Sesi kehadiran tidak aktif atau tidak ditemukan.');
  }

  const student = await prisma.student.findFirst({
    where: { nfcCardId }
  });

  if (!student) {
    throw new Error('Siswa dengan kartu ini tidak ditemukan.');
  }

  const attendanceRecord = await prisma.attendanceRecord.findFirst({
    where: {
      sessionId,
      studentId: student.id
    }
  });

  if (!attendanceRecord) {
    throw new Error('Siswa ini tidak terdaftar dalam sesi ini.');
  }

  if (attendanceRecord.status === 'PRESENT') {
    // Sudah hadir, kembalikan status
    return {
      studentId: student.id,
      name: student.name,
      status: 'present',
      avatar: student.avatar || ''
    };
  }

  // Update status kehadiran
  await prisma.attendanceRecord.update({
    where: { id: attendanceRecord.id },
    data: { status: 'PRESENT' }
  });

  return {
    studentId: student.id,
    name: student.name,
    status: 'present',
    avatar: student.avatar || ''
  };
}

export async function endAttendanceSession(sessionId: string): Promise<AttendanceSession | undefined> {
  const session = await prisma.attendanceSession.update({
    where: { id: sessionId },
    data: {
      isActive: false,
      endTime: new Date()
    },
    include: {
      course: true,
      records: {
        include: {
          student: true
        }
      }
    }
  });

  if (!session) {
    return undefined;
 }

  const sessionStudents: StudentAttendance[] = session.records.map(r => ({
    studentId: r.studentId,
    name: r.student.name,
    status: r.status.toLowerCase() as 'present' | 'absent',
    avatar: r.student.avatar || ''
  }));

  return {
    id: session.id,
    courseName: session.course.name,
    teacherName: session.teacherName,
    class: session.class,
    students: sessionStudents,
    isActive: session.isActive,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime ? session.endTime.toISOString() : undefined
  };
}
