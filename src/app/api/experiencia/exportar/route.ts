import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const { serviceIds, rubroBuscado } = await request.json();

    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Debe seleccionar al menos un servicio' },
        { status: 400 }
      );
    }

    const servicios = await prisma.serviceContract.findMany({
      where: {
        id: { in: serviceIds },
      },
      include: {
        empresa: true,
      },
      orderBy: {
        fechaOrden: 'desc',
      },
    });

    let montoTotalAcreditado = 0;

    const dataExcel = servicios.map((s, index) => {
      const monto = s.montoFacturado || s.montoTotal || 0;
      montoTotalAcreditado += monto;

      return {
        'N°': String(index + 1).padStart(2, '0'),
        'ENTIDAD / CLIENTE': s.entidad,
        'RUC ENTIDAD': s.empresa?.ruc || '',
        'CONTRATO / REFERENCIA': s.codigoInterno,
        'DESCRIPCIÓN DEL SERVICIO': s.descripcionDetallada,
        'ORDEN DE SERVICIO / REFERENCIA': `ORDEN DE SERVICIO N° ${s.nroOrdenServicio || 'S/N'}\nEXP. SIAF: ${s.nroSiaf || 'S/N'}`,
        'UNIDAD EJECUTORA': s.unidadEjecutora || '',
        'FECHA': s.fechaOrden ? new Date(s.fechaOrden).toLocaleDateString('es-PE') : '',
        'MONTO (S/)': monto,
      };
    });

    // Fila de Total
    dataExcel.push({
      'N°': '',
      'ENTIDAD / CLIENTE': '',
      'RUC ENTIDAD': '',
      'CONTRATO / REFERENCIA': '',
      'DESCRIPCIÓN DEL SERVICIO': 'TOTAL MONTO ACREDITADO',
      'ORDEN DE SERVICIO / REFERENCIA': '',
      'UNIDAD EJECUTORA': '',
      'FECHA': '',
      'MONTO (S/)': montoTotalAcreditado,
    });

    // Crear workbook
    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen de Experiencia');

    // Generar buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new Response(Buffer.from(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Resumen_Experiencia_${rubroBuscado || 'Acreditacion'}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting experience excel:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al exportar experiencia' },
      { status: 500 }
    );
  }
}
