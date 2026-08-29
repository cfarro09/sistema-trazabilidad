import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y correo electrónico son obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existing = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un usuario con este correo electrónico' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        role: body.role || 'ADMIN',
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear usuario' },
      { status: 500 }
    );
  }
}
