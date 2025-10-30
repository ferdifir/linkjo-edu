import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Create new location
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Nama lokasi harus diisi' },
        { status: 400 }
      );
    }

    // Generate a new ID for the location
    const newId = `LOC${Date.now()}`;
    
    const newLocation = await prisma.location.create({
      data: {
        id: newId,
        name: body.name,
        description: body.description || null,
      },
    });

    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan lokasi' },
      { status: 500 }
    );
  }
}

// GET - Get all locations
export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data lokasi' },
      { status: 500 }
    );
  }
}

// PUT - Update a location by ID
export async function PUT(request: Request) {
  try {
    // Extract ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID lokasi harus disediakan' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields if they are being updated
    if (body.name === undefined && body.description === undefined) {
      return NextResponse.json(
        { error: 'Setidaknya satu field harus diperbarui' },
        { status: 400 }
      );
    }

    const updatedLocation = await prisma.location.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    return NextResponse.json(updatedLocation);
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui lokasi' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a location by ID
export async function DELETE(request: Request) {
  try {
    // Extract ID from URL path
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const id = pathParts[pathParts.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID lokasi harus disediakan' },
        { status: 400 }
      );
    }

    // First, delete all classrooms in this location
    const classrooms = await prisma.classroom.findMany({
      where: { locationId: id }
    });

    for (const classroom of classrooms) {
      // Delete schedules that use this classroom
      await prisma.schedule.deleteMany({
        where: { classroomId: classroom.id }
      });
    }

    // Delete all classrooms in this location
    await prisma.classroom.deleteMany({
      where: { locationId: id }
    });

    // Then delete the location
    await prisma.location.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Lokasi berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus lokasi' },
      { status: 500 }
    );
  }
}
