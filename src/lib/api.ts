import { PrismaClient } from '@prisma/client';
import type { Student, Announcement, ScheduleEvent, Grade, Course, AttendanceSession, StudentAttendance, SchoolLocation } from './types';
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
    include: {
      course: true
    },
    orderBy: { time: 'asc' }
  });

  // Group schedules by time
 const groupedSchedules: { [time: string]: ScheduleEvent } = {};

  for (const dbSchedule of dbSchedules) {
    if (!groupedSchedules[dbSchedule.time]) {
      groupedSchedules[dbSchedule.time] = {
        time: dbSchedule.time
      };
    }

    // Map day of week to the appropriate schedule property
    switch (dbSchedule.dayOfWeek) {
      case 'MONDAY':
        groupedSchedules[dbSchedule.time].monday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'TUESDAY':
        groupedSchedules[dbSchedule.time].tuesday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'WEDNESDAY':
        groupedSchedules[dbSchedule.time].wednesday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'THURSDAY':
        groupedSchedules[dbSchedule.time].thursday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'FRIDAY':
        groupedSchedules[dbSchedule.time].friday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'SATURDAY':
        groupedSchedules[dbSchedule.time].saturday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
    }
 }

  return Object.values(groupedSchedules);
}

export async function getScheduleByTime(time: string): Promise<ScheduleEvent | undefined> {
  const dbSchedules = await prisma.schedule.findMany({
    where: { time },
    include: {
      course: true
    }
  });

  if (dbSchedules.length === 0) {
    return undefined;
  }

  const scheduleEvent: ScheduleEvent = {
    time: dbSchedules[0].time
  };

 // Map each day of week from the database schedules
  for (const dbSchedule of dbSchedules) {
    switch (dbSchedule.dayOfWeek) {
      case 'MONDAY':
        scheduleEvent.monday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'TUESDAY':
        scheduleEvent.tuesday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'WEDNESDAY':
        scheduleEvent.wednesday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'THURSDAY':
        scheduleEvent.thursday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'FRIDAY':
        scheduleEvent.friday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
      case 'SATURDAY':
        scheduleEvent.saturday = {
          course: dbSchedule.course.name,
          teacher: dbSchedule.teacherName
        };
        break;
    }
  }

 return scheduleEvent;
}

export async function addSchedule(event: ScheduleEvent): Promise<ScheduleEvent> {
  // The ScheduleEvent interface still represents the old structure
  // We need to create multiple schedule entries for each day that has a class
  const createdSchedules = [];

  if (event.monday) {
    const course = await prisma.course.findFirst({ where: { name: event.monday.course } });
    if (course) {
      const schedule = await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'MONDAY',
          courseId: course.id,
          teacherName: event.monday.teacher,
          class: 'Kelas Umum', // Default class, could be customized
          academicYearId: 'ACY001', // Default academic year, could be passed as parameter
          semesterId: 'SEM001', // Default semester, could be passed as parameter
        }
      });
      createdSchedules.push(schedule);
    }
  }

  if (event.tuesday) {
    const course = await prisma.course.findFirst({ where: { name: event.tuesday.course } });
    if (course) {
      const schedule = await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'TUESDAY',
          courseId: course.id,
          teacherName: event.tuesday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
      createdSchedules.push(schedule);
    }
 }

  if (event.wednesday) {
    const course = await prisma.course.findFirst({ where: { name: event.wednesday.course } });
    if (course) {
      const schedule = await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'WEDNESDAY',
          courseId: course.id,
          teacherName: event.wednesday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
      createdSchedules.push(schedule);
    }
 }

  if (event.thursday) {
    const course = await prisma.course.findFirst({ where: { name: event.thursday.course } });
    if (course) {
      const schedule = await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'THURSDAY',
          courseId: course.id,
          teacherName: event.thursday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
      createdSchedules.push(schedule);
    }
  }

  if (event.friday) {
    const course = await prisma.course.findFirst({ where: { name: event.friday.course } });
    if (course) {
      const schedule = await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'FRIDAY',
          courseId: course.id,
          teacherName: event.friday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
      createdSchedules.push(schedule);
    }
 }

  if (event.saturday) {
    const course = await prisma.course.findFirst({ where: { name: event.saturday.course } });
    if (course) {
      const schedule = await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'SATURDAY',
          courseId: course.id,
          teacherName: event.saturday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
      createdSchedules.push(schedule);
    }
 }

  return event;
}

export async function updateSchedule(time: string, event: ScheduleEvent): Promise<ScheduleEvent> {
  // First, delete all existing schedules for this time
  await prisma.schedule.deleteMany({
    where: { time }
  });

  // Then add the new schedule using the same logic as addSchedule
 if (event.monday) {
    const course = await prisma.course.findFirst({ where: { name: event.monday.course } });
    if (course) {
      await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'MONDAY',
          courseId: course.id,
          teacherName: event.monday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
    }
  }

  if (event.tuesday) {
    const course = await prisma.course.findFirst({ where: { name: event.tuesday.course } });
    if (course) {
      await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'TUESDAY',
          courseId: course.id,
          teacherName: event.tuesday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
    }
  }

 if (event.wednesday) {
    const course = await prisma.course.findFirst({ where: { name: event.wednesday.course } });
    if (course) {
      await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'WEDNESDAY',
          courseId: course.id,
          teacherName: event.wednesday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
    }
  }

 if (event.thursday) {
    const course = await prisma.course.findFirst({ where: { name: event.thursday.course } });
    if (course) {
      await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'THURSDAY',
          courseId: course.id,
          teacherName: event.thursday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
    }
  }

  if (event.friday) {
    const course = await prisma.course.findFirst({ where: { name: event.friday.course } });
    if (course) {
      await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'FRIDAY',
          courseId: course.id,
          teacherName: event.friday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
    }
  }

  if (event.saturday) {
    const course = await prisma.course.findFirst({ where: { name: event.saturday.course } });
    if (course) {
      await prisma.schedule.create({
        data: {
          time: event.time,
          dayOfWeek: 'SATURDAY',
          courseId: course.id,
          teacherName: event.saturday.teacher,
          class: 'Kelas Umum',
          academicYearId: 'ACY001',
          semesterId: 'SEM001',
        }
      });
    }
  }

  return event;
}

export async function deleteSchedule(time: string): Promise<void> {
  await prisma.schedule.deleteMany({
    where: { time }
  });
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

// --- Courses Management (Admin Only) ---

export async function getCoursesForAdmin(): Promise<Course[]> {
  const dbCourses = await prisma.course.findMany({
    orderBy: { name: 'asc' }
  });

  return dbCourses.map(c => ({
    id: c.id,
    name: c.name,
    teacher: c.teacher,
    schedule: c.schedule || ''
  }));
}

export async function getCourseByIdForAdmin(courseId: string): Promise<Course | undefined> {
  const dbCourse = await prisma.course.findUnique({
    where: { id: courseId }
  });

  if (!dbCourse) {
    return undefined;
  }

  return {
    id: dbCourse.id,
    name: dbCourse.name,
    teacher: dbCourse.teacher,
    schedule: dbCourse.schedule || ''
  };
}

export async function addCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
  // Generate a new ID for the course
  const newId = `C${Date.now()}`;
  
  const newCourse = await prisma.course.create({
    data: {
      id: newId,
      name: courseData.name,
      teacher: courseData.teacher,
      schedule: courseData.schedule
    }
  });

  return {
    id: newCourse.id,
    name: newCourse.name,
    teacher: newCourse.teacher,
    schedule: newCourse.schedule || ''
  };
}

export async function updateCourse(courseId: string, courseData: Partial<Omit<Course, 'id'>>): Promise<Course | undefined> {
  const updatedCourse = await prisma.course.update({
    where: { id: courseId },
    data: {
      name: courseData.name,
      teacher: courseData.teacher,
      schedule: courseData.schedule
    }
  });

  if (!updatedCourse) {
    return undefined;
  }

  return {
    id: updatedCourse.id,
    name: updatedCourse.name,
    teacher: updatedCourse.teacher,
    schedule: updatedCourse.schedule || ''
  };
}

export async function deleteCourse(courseId: string): Promise<void> {
  // First, delete related records to avoid foreign key constraints
  await prisma.studentEnrollment.deleteMany({
    where: { courseId }
  });
  
  await prisma.grade.deleteMany({
    where: { courseId }
  });
  
  await prisma.schedule.deleteMany({
    where: { courseId }
  });
  
  await prisma.attendanceSession.deleteMany({
    where: { courseId }
  });

  // Then delete the course
  await prisma.course.delete({
    where: { id: courseId }
  });
}

// --- Location Management (Admin Only) ---

export async function getLocations(): Promise<SchoolLocation[]> {
  const dbLocations = await prisma.location.findMany({
    orderBy: { name: 'asc' }
  });

  return dbLocations.map(l => ({
    id: l.id,
    name: l.name,
    description: l.description || undefined
  }));
}

export async function getLocationById(locationId: string): Promise<SchoolLocation | undefined> {
  const dbLocation = await prisma.location.findUnique({
    where: { id: locationId }
  });

  if (!dbLocation) {
    return undefined;
  }

  return {
    id: dbLocation.id,
    name: dbLocation.name,
    description: dbLocation.description || undefined
  };
}

export async function addLocation(locationData: Omit<SchoolLocation, 'id'>): Promise<SchoolLocation> {
  // Generate a new ID for the location
  const newId = `LOC${Date.now()}`;
  
  const newLocation = await prisma.location.create({
    data: {
      id: newId,
      name: locationData.name,
      description: locationData.description
    }
  });

  return {
    id: newLocation.id,
    name: newLocation.name,
    description: newLocation.description || undefined
  };
}

export async function updateLocation(locationId: string, locationData: Partial<Omit<SchoolLocation, 'id'>>): Promise<SchoolLocation | undefined> {
  const updatedLocation = await prisma.location.update({
    where: { id: locationId },
    data: {
      name: locationData.name,
      description: locationData.description
    }
  });

  if (!updatedLocation) {
    return undefined;
  }

  return {
    id: updatedLocation.id,
    name: updatedLocation.name,
    description: updatedLocation.description || undefined
  };
}

export async function deleteLocation(locationId: string): Promise<void> {
  // First, delete all classrooms in this location
  const classrooms = await prisma.classroom.findMany({
    where: { locationId }
  });
  
  for (const classroom of classrooms) {
    // Delete schedules that use this classroom
    await prisma.schedule.deleteMany({
      where: { classroomId: classroom.id }
    });
  }
  
  // Delete all classrooms in this location
  await prisma.classroom.deleteMany({
    where: { locationId }
  });

  // Then delete the location
  await prisma.location.delete({
    where: { id: locationId }
  });
}

// --- Classroom Management (Admin Only) ---

export async function getClassrooms(): Promise<Classroom[]> {
  const dbClassrooms = await prisma.classroom.findMany({
    include: {
      location: true
    },
    orderBy: { name: 'asc' }
  });

  return dbClassrooms.map(c => ({
    id: c.id,
    name: c.name,
    code: c.code,
    locationId: c.locationId,
    locationName: c.location.name,
    capacity: c.capacity,
    description: c.description || undefined,
    isActive: c.isActive
  }));
}

export async function getClassroomById(classroomId: string): Promise<Classroom | undefined> {
  const dbClassroom = await prisma.classroom.findUnique({
    where: { id: classroomId },
    include: {
      location: true
    }
  });

  if (!dbClassroom) {
    return undefined;
  }

  return {
    id: dbClassroom.id,
    name: dbClassroom.name,
    code: dbClassroom.code,
    locationId: dbClassroom.locationId,
    locationName: dbClassroom.location.name,
    capacity: dbClassroom.capacity,
    description: dbClassroom.description || undefined,
    isActive: dbClassroom.isActive
  };
}

export async function addClassroom(classroomData: Omit<Classroom, 'id' | 'locationName'>): Promise<Classroom> {
  // Generate a new ID for the classroom
  const newId = `CLS${Date.now()}`;
  
  const newClassroom = await prisma.classroom.create({
    data: {
      id: newId,
      name: classroomData.name,
      code: classroomData.code,
      locationId: classroomData.locationId,
      capacity: classroomData.capacity,
      description: classroomData.description,
      isActive: classroomData.isActive
    },
    include: {
      location: true
    }
  });

  return {
    id: newClassroom.id,
    name: newClassroom.name,
    code: newClassroom.code,
    locationId: newClassroom.locationId,
    locationName: newClassroom.location.name,
    capacity: newClassroom.capacity,
    description: newClassroom.description || undefined,
    isActive: newClassroom.isActive
  };
}

export async function updateClassroom(classroomId: string, classroomData: Partial<Omit<Classroom, 'id' | 'locationName'>>): Promise<Classroom | undefined> {
  const updatedClassroom = await prisma.classroom.update({
    where: { id: classroomId },
    data: {
      name: classroomData.name,
      code: classroomData.code,
      locationId: classroomData.locationId,
      capacity: classroomData.capacity,
      description: classroomData.description,
      isActive: classroomData.isActive
    },
    include: {
      location: true
    }
  });

  if (!updatedClassroom) {
    return undefined;
  }

  return {
    id: updatedClassroom.id,
    name: updatedClassroom.name,
    code: updatedClassroom.code,
    locationId: updatedClassroom.locationId,
    locationName: updatedClassroom.location.name,
    capacity: updatedClassroom.capacity,
    description: updatedClassroom.description || undefined,
    isActive: updatedClassroom.isActive
  };
}

export async function deleteClassroom(classroomId: string): Promise<void> {
  // First, remove this classroom from any schedules that use it
  await prisma.schedule.updateMany({
    where: { classroomId },
    data: { classroomId: null }
  });

  // Then delete the classroom
  await prisma.classroom.delete({
    where: { id: classroomId }
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
