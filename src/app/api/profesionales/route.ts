import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profesionales = await prisma.professional.findMany({
      include: {
        documentos: true,
      },
      orderBy: { apellidos: 'asc' },
    });

    const now = new Date();

    // Calcular estado y semáforo de colegiatura
    const formatted = profesionales.map((p) => {
      let diasParaVencer: number | null = null;
      let estadoVigencia: 'VIGENTE' | 'POR_VENCER' | 'VENCIDO' | 'SIN_COLEGIATURA' = 'SIN_COLEGIATURA';

      if (p.colegiaturaCaducidad) {
        const diffMs = new Date(p.colegiaturaCaducidad).getTime() - now.getTime();
        diasParaVencer = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diasParaVencer < 0) {
          estadoVigencia = 'VENCIDO';
        } else if (diasParaVencer <= 30) {
          estadoVigencia = 'POR_VENCER';
        } else {
          estadoVigencia = 'VIGENTE';
        }
      }

      return {
        ...p,
        diasParaVencer,
        estadoVigencia,
      };
    });

    return NextResponse.json({ success: true, data: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al obtener profesionales' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tipo, dni, nombres, apellidos, profesion, institucion, nroRegistro, colegiaturaCaducidad, telefono, email, documentos } = body;

    const nuevo = await prisma.professional.create({
      data: {
        tipo: tipo || 'TECNICO',
        dni,
        nombres,
        apellidos,
        profesion,
        institucion,
        nroRegistro,
        colegiaturaCaducidad: colegiaturaCaducidad ? new Date(colegiaturaCaducidad) : null,
        telefono,
        email,
        documentos: documentos?.length
          ? {
              create: documentos.map((d: any) => ({
                tipo: d.tipo,
                nombre: d.nombre,
                entidadEmisora: d.entidadEmisora,
                fechaEmision: d.fechaEmision ? new Date(d.fechaEmision) : null,
                fechaCaducidad: d.fechaCaducidad ? new Date(d.fechaCaducidad) : null,
                archivoUrl: d.archivoUrl || '/uploads/sample.pdf',
              })),
            }
          : undefined,
      },
      include: {
        documentos: true,
      },
    });

    return NextResponse.json({ success: true, data: nuevo });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error al crear profesional' },
      { status: 500 }
    );
  }
}
