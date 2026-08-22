import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const empresas = await prisma.company.findMany({
      include: {
        _count: {
          select: { servicios: true },
        },
      },
      orderBy: { razonSocial: 'asc' },
    });

    return NextResponse.json({ success: true, data: empresas });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener empresas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const empresa = await prisma.company.create({
      data: {
        ruc: body.ruc,
        razonSocial: body.razonSocial,
        nombreComercial: body.nombreComercial,
        representanteLegal: body.representanteLegal,
        dniRepresentante: body.dniRepresentante,
        direccion: body.direccion,
        telefono: body.telefono,
        email: body.email,
        banco: body.banco,
        cci: body.cci,
        rnpVigenciaDesde: body.rnpVigenciaDesde ? new Date(body.rnpVigenciaDesde) : null,
        rnpEstado: body.rnpEstado || 'VIGENTE',
      },
    });

    return NextResponse.json({ success: true, data: empresa });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear empresa' },
      { status: 500 }
    );
  }
}
