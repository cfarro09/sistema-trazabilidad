import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const dataToUpdate: any = {};
    if (body.name) dataToUpdate.name = body.name.trim();
    if (body.email) dataToUpdate.email = body.email.trim().toLowerCase();
    if (body.role) dataToUpdate.role = body.role;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al actualizar usuario' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al eliminar usuario' },
      { status: 500 }
    );
  }
}
