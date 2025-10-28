import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Create new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.teacher) {
      return NextResponse.json(
        { error: 'Nama mata pelajaran dan nama guru harus diisi' },
        { status: 400 }
      );
    }

    // Generate a new ID for the course
    const newId = `C${Date.now()}`;
    
    const newCourse = await prisma.course.create({
      data: {
        id: newId,
        name: body.name,
        teacher: body.teacher,
        schedule: body.schedule || null,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan mata pelajaran' },
      { status: 500 }
    );
  }
}

// GET - Get all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data mata pelajaran' },
      { status: 500 }
    );
  }
}
