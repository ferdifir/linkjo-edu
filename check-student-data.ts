import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStudentData() {
  try {
    // Check if students with IDs like 'S001' exist
    const studentS001 = await prisma.student.findUnique({
      where: { id: 'S001' }
    });

    console.log('Student S001 found:', studentS001 ? true : false);
    
    if (studentS001) {
      console.log('Student S001 data:', studentS001);
    }

    // Check all student IDs
    const allStudents = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    console.log('All student IDs in database:', allStudents.map(s => s.id));
    
    // Check if any students have custom IDs like S001, S002, etc.
    const customIdStudents = allStudents.filter(s => 
      s.id.startsWith('S') && !s.id.includes('ck') && !s.id.includes('cm') && !s.id.includes('cl') && !s.id.includes('cu')
    );
    
    console.log('Students with custom IDs (Sxxx format):', customIdStudents);
    
    // Check if any students have cuid format
    const cuidStudents = allStudents.filter(s => 
      s.id.startsWith('c') && (s.id.includes('ck') || s.id.includes('cm') || s.id.includes('cl') || s.id.includes('cu'))
    );
    
    console.log('Students with cuid format:', cuidStudents.length, 'found');
    
  } catch (error) {
    console.error('Error checking student data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStudentData();
