const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const servicios = await prisma.serviceContract.findMany();
  console.log('Servicios actuales:', servicios.map(s => ({
    id: s.id,
    codigo: s.codigoInterno,
    objeto: s.objetoContratacion.substring(0, 50),
    estado: s.estado,
    orden: s.nroOrdenServicio,
    siaf: s.nroSiaf,
    factura: s.nroFactura
  })));

  // Buscar el servicio de "PINTADO DE LAS OFICINAS DE ALTA DIRECCION" (ej. SUSALUD COT-2026-00004 o COT-2026-00175)
  const target = servicios.find(s => 
    s.objetoContratacion.includes('PINTADO DE LAS OFICINAS DE ALTA DIRECCIÓN') ||
    s.codigoInterno.includes('00004') ||
    s.codigoInterno.includes('00175')
  );

  if (target) {
    console.log('Actualizando servicio:', target.id, target.codigoInterno);
    const updated = await prisma.serviceContract.update({
      where: { id: target.id },
      data: {
        nroCotizacion: '00175-26',
        fechaCotizacion: new Date('2026-08-13'),
        tdrPdf: '/uploads/TDR_SUSALUD_Pintado.pdf',
        cotizacionPdf: '/uploads/Cotizacion_00175_26.pdf',
        expedientePostulacionPdf: '/uploads/Expediente_Postulacion_20509152129.pdf',
        nroOrdenServicio: '0000701',
        nroSiaf: '0000001761',
        fechaOrden: new Date('2026-08-17'),
        plazoEjecucionDias: 10,
        ordenServicioPdf: '/uploads/Orden_Servicio_0000701_SUSALUD.pdf',
        fechaInforme: new Date('2026-08-25'),
        informePdf: '/uploads/Informe_Final_Pintado_Alta_Direccion.pdf',
        nroConformidad: 'ACTA-CONF-2026-701-SUSALUD',
        fechaConformidad: new Date('2026-08-26'),
        conformidadPdf: '/uploads/Acta_Conformidad_SUSALUD.pdf',
        nroFactura: 'E001-000155',
        fechaFactura: new Date('2026-08-26'),
        montoFacturado: target.montoTotal || 17000.00,
        facturaPdf: '/uploads/Factura_E001_000155_SUNAT.pdf',
        estado: 'FACTURADO',
      }
    });
    console.log('Servicio actualizado con éxito a FACTURADO:', updated);
  } else {
    console.log('No se encontró el servicio específico, actualizando los existentes si aplica.');
  }

  // Actualizar también todos los servicios que tengan código COT-2026-00004 si existe
  await prisma.serviceContract.updateMany({
    where: {
      OR: [
        { codigoInterno: 'COT-2026-00004' },
        { objetoContratacion: { contains: 'ALTA DIRECCIÓN' } }
      ]
    },
    data: {
      nroCotizacion: '00175-26',
      fechaCotizacion: new Date('2026-08-13'),
      tdrPdf: '/uploads/TDR_SUSALUD_Pintado.pdf',
      cotizacionPdf: '/uploads/Cotizacion_00175_26.pdf',
      expedientePostulacionPdf: '/uploads/Expediente_Postulacion_20509152129.pdf',
      nroOrdenServicio: '0000701',
      nroSiaf: '0000001761',
      fechaOrden: new Date('2026-08-17'),
      plazoEjecucionDias: 10,
      ordenServicioPdf: '/uploads/Orden_Servicio_0000701_SUSALUD.pdf',
      fechaInforme: new Date('2026-08-25'),
      informePdf: '/uploads/Informe_Final_Pintado_Alta_Direccion.pdf',
      nroConformidad: 'ACTA-CONF-2026-701-SUSALUD',
      fechaConformidad: new Date('2026-08-26'),
      conformidadPdf: '/uploads/Acta_Conformidad_SUSALUD.pdf',
      nroFactura: 'E001-000155',
      fechaFactura: new Date('2026-08-26'),
      montoFacturado: 17000.00,
      facturaPdf: '/uploads/Factura_E001_000155_SUNAT.pdf',
      estado: 'FACTURADO',
    }
  });

  console.log('Actualización completada.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
