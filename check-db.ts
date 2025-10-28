import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    // Cek jumlah user
    const userCount = await prisma.user.count();
    console.log('Jumlah user:', userCount);
    
    if (userCount > 0) {
      const users = await prisma.user.findMany();
      console.log('Daftar user:');
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    } else {
      console.log('Tidak ada user dalam database');
    }
    
    // Cek jumlah student
    const studentCount = await prisma.student.count();
    console.log('\nJumlah student:', studentCount);
    
    if (studentCount > 0) {
      const students = await prisma.student.findMany();
      console.log('Daftar student:');
      students.forEach(student => {
        console.log(`- ${student.name} (${student.email}) - Class: ${student.class}`);
      });
    } else {
      console.log('Tidak ada student dalam database');
    }
    
    // Cek jumlah course
    const courseCount = await prisma.course.count();
    console.log('\nJumlah course:', courseCount);
    
    if (courseCount > 0) {
      const courses = await prisma.course.findMany();
      console.log('Daftar course:');
      courses.forEach(course => {
        console.log(`- ${course.name} - Teacher: ${course.teacher}`);
      });
    } else {
      console.log('Tidak ada course dalam database');
    }
    
  } catch (error) {
    console.error('Error saat mengecek database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
