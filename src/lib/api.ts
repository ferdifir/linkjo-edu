import { students, announcements, schedule, courses, attendanceSessions } from './mock-data';
import type { Student, Announcement, ScheduleEvent, Grade, Course, AttendanceSession, StudentAttendance } from './types';
import { revalidatePath } from 'next/cache';

// --- Students ---
export async function getStudents(): Promise<Student[]> {
  return Promise.resolve(students);
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return Promise.resolve(students.find((s) => s.id === id));
}

export async function addStudent(studentData: Omit<Student, 'id' | 'grades' | 'courses' | 'avatar' | 'nfcCardId'>): Promise<Student> {
  const newId = `S${String(students.length + 1).padStart(3, '0')}`;
  const newStudent: Student = {
    ...studentData,
    id: newId,
    avatar: `student-${(students.length % 5) + 1}`,
    nfcCardId: `CARD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    grades: [],
    courses: [],
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


// --- Announcements ---
export async function getAnnouncements(): Promise<Announcement[]> {
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
    date: new Date().toISOString().split('T')[0],
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

// --- Schedule ---
export async function getSchedule(): Promise<ScheduleEvent[]> {
  return Promise.resolve(schedule.sort((a, b) => a.time.localeCompare(b.time)));
}

export async function getScheduleByTime(time: string): Promise<ScheduleEvent | undefined> {
  return Promise.resolve(schedule.find((s) => s.time === time));
}

export async function addSchedule(event: ScheduleEvent): Promise<ScheduleEvent> {
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

// --- Stats & Courses ---
export async function getStats() {
    return Promise.resolve({
        totalStudents: students.length,
        averageAttendance: Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length) || 0,
        averageGrade: Math.round(students.reduce((acc, s) => acc + s.grades.reduce((gAcc, g) => gAcc + g.grade, 0) / (s.grades.length || 1), 0) / (students.length || 1)) || 0,
    });
}

export async function getCourses(): Promise<Course[]> {
    return Promise.resolve(courses);
}

// --- Grades ---
export type GradeWithId = Grade & { id: string, studentId: string, studentName: string, studentAvatar: string };

export async function getGrades(): Promise<GradeWithId[]> {
  const allGrades = students.flatMap((student, studentIndex) =>
    student.grades.map((grade, gradeIndex) => ({
      ...grade,
      id: `${student.id}-g${gradeIndex}`,
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
    }))
  ).sort((a, b) => a.studentName.localeCompare(b.studentName) || a.subject.localeCompare(b.subject));
  return Promise.resolve(allGrades);
}

export async function getGradeById(gradeId: string): Promise<GradeWithId | undefined> {
    const allGrades = await getGrades();
    return Promise.resolve(allGrades.find(g => g.id === gradeId));
}

type GradeInput = { studentId: string, subject: string, assignment: string, grade: number };

export async function addGrade(gradeData: GradeInput): Promise<Grade> {
    const student = students.find(s => s.id === gradeData.studentId);
    if (!student) {
        throw new Error("Siswa tidak ditemukan.");
    }
    const newGrade = { subject: gradeData.subject, assignment: gradeData.assignment, grade: gradeData.grade };
    student.grades.push(newGrade);
    revalidatePath('/grades');
    revalidatePath(`/students/${gradeData.studentId}`);
    return Promise.resolve(newGrade);
}

export async function updateGrade(gradeId: string, gradeData: GradeInput): Promise<Grade> {
    const student = students.find(s => s.id === gradeData.studentId);
    if (!student) {
        throw new Error("Siswa tidak ditemukan.");
    }
    
    const [studentId, gradeIndexStr] = gradeId.split('-g');
    const gradeIndex = parseInt(gradeIndexStr, 10);
    
    const originalStudent = students.find(s => s.id === studentId);
    if (!originalStudent || !originalStudent.grades[gradeIndex]) {
        throw new Error("Nilai asli tidak ditemukan.");
    }

    // If student changed, remove from old and add to new
    if (originalStudent.id !== student.id) {
        originalStudent.grades.splice(gradeIndex, 1);
        const newGrade = { subject: gradeData.subject, assignment: gradeData.assignment, grade: gradeData.grade };
        student.grades.push(newGrade);
        revalidatePath(`/students/${originalStudent.id}`);
    } else {
        const updatedGrade = {
            ...student.grades[gradeIndex],
            subject: gradeData.subject,
            assignment: gradeData.assignment,
            grade: gradeData.grade
        };
        student.grades[gradeIndex] = updatedGrade;
    }

    revalidatePath('/grades');
    revalidatePath(`/students/${gradeData.studentId}`);
    return Promise.resolve(gradeData);
}

export async function deleteGrade(gradeId: string): Promise<void> {
    const [studentId, gradeIndexStr] = gradeId.split('-g');
    const gradeIndex = parseInt(gradeIndexStr, 10);
    const student = students.find(s => s.id === studentId);

    if (student && student.grades[gradeIndex]) {
        student.grades.splice(gradeIndex, 1);
        revalidatePath('/grades');
        revalidatePath(`/students/${studentId}`);
    } else {
        throw new Error("Nilai tidak ditemukan.");
    }
    return Promise.resolve();
}

// --- Attendance Sessions ---

export async function startAttendanceSession(courseName: string, teacherName: string): Promise<AttendanceSession> {
    const sessionStudents = students.filter(s => s.courses.some(c => c.name === courseName));
    if (sessionStudents.length === 0) {
        throw new Error(`Tidak ada siswa yang terdaftar di mata pelajaran ${courseName}`);
    }

    const newSession: AttendanceSession = {
        id: `SESS-${Date.now()}`,
        courseName,
        teacherName,
        class: sessionStudents[0]?.class || 'N/A',
        students: sessionStudents.map(s => ({
            studentId: s.id,
            name: s.name,
            status: 'absent',
            avatar: s.avatar
        })),
        isActive: true,
        startTime: new Date().toISOString(),
    };
    attendanceSessions.push(newSession);
    revalidatePath(`/take-attendance/${newSession.id}`);
    return Promise.resolve(newSession);
}

export async function getAttendanceSession(sessionId: string): Promise<AttendanceSession | undefined> {
    return Promise.resolve(attendanceSessions.find(s => s.id === sessionId));
}

export async function markStudentPresent(sessionId: string, nfcCardId: string): Promise<StudentAttendance | undefined> {
    const session = attendanceSessions.find(s => s.id === sessionId);
    if (!session || !session.isActive) {
        throw new Error('Sesi kehadiran tidak aktif atau tidak ditemukan.');
    }

    const studentToMark = students.find(s => s.nfcCardId === nfcCardId);
    if (!studentToMark) {
        throw new Error('Siswa dengan kartu ini tidak ditemukan.');
    }

    const studentInSession = session.students.find(s => s.studentId === studentToMark.id);
    if (!studentInSession) {
        throw new Error('Siswa ini tidak terdaftar dalam sesi ini.');
    }

    if (studentInSession.status === 'present') {
        // Already marked, just return the status
        return Promise.resolve(studentInSession);
    }
    
    studentInSession.status = 'present';
    revalidatePath(`/take-attendance/${sessionId}`);
    return Promise.resolve(studentInSession);
}


export async function endAttendanceSession(sessionId: string): Promise<AttendanceSession | undefined> {
    const session = attendanceSessions.find(s => s.id === sessionId);
    if (session) {
        session.isActive = false;
        session.endTime = new Date().toISOString();
        // Here you would typically save the final attendance to the database
        // For now, we just update the in-memory session.
        revalidatePath(`/take-attendance/${sessionId}`);
        revalidatePath(`/dashboard`);
    }
    return Promise.resolve(session);
}