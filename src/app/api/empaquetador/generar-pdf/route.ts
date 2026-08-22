import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSamplePdf, compileExpedientePdf } from '@/lib/pdf-generator';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const {
      companyId,
      includeRuc,
      includeRnp,
      includeCci,
      includeAnexos,
      selectedProfessionalIds,
      includeCotizacion,
      cotizacionDetails,
    } = await request.json();

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return NextResponse.json({ success: false, error: 'Empresa no encontrada' }, { status: 404 });
    }

    const pdfBuffers: Uint8Array[] = [];
    const docTitles: string[] = [];

    // 1. Cotización Económica (si está seleccionada)
    if (includeCotizacion) {
      docTitles.push('Cotización Económica');
      const cotPdf = await createSamplePdf(
        `${company.razonSocial}`,
        `FORMATO DE COTIZACIÓN N° ${cotizacionDetails?.nroCotizacion || '00175-26'}`,
        [
          `RUC: ${company.ruc}`,
          `Entidad: ${cotizacionDetails?.entidad || 'SUPERINTENDENCIA NACIONAL DE SALUD'}`,
          `Fecha: ${new Date().toLocaleDateString('es-PE')}`,
          `Objeto: ${cotizacionDetails?.objeto || 'SERVICIO DE PINTADO Y ACONDICIONAMIENTO'}`,
          `Plazo de Ejecución: ${cotizacionDetails?.plazo || '10'} días calendario`,
          `Monto Total Ofertado: S/ ${cotizacionDetails?.monto || '17,000.00'}`,
          '',
          'El postor declara bajo juramento cumplir con el perfil y especificaciones técnicas requeridas.',
          `Representante Legal: ${company.representanteLegal} (DNI: ${company.dniRepresentante})`,
        ]
      );
      pdfBuffers.push(cotPdf);
    }

    // 2. Ficha RUC
    if (includeRuc) {
      docTitles.push('Ficha RUC SUNAT');
      const rucPdf = await createSamplePdf(
        'SUNAT - SUPERINTENDENCIA NACIONAL DE ADUANAS Y ADMINISTRACIÓN TRIBUTARIA',
        `REPORTE DE FICHA RUC - ${company.ruc}`,
        [
          `Razón Social: ${company.razonSocial}`,
          `Nombre Comercial: ${company.nombreComercial || company.razonSocial}`,
          `Estado del Contribuyente: ACTIVO - Condición: HABIDO`,
          `Dirección Fiscal: ${company.direccion}`,
          `Representante Legal: ${company.representanteLegal} (DNI: ${company.dniRepresentante})`,
          `Actividad Económica: 4330 - TERMINACIÓN Y ACABADO DE EDIFICIOS`,
          `Fecha de Emisión: ${new Date().toLocaleDateString('es-PE')}`,
        ]
      );
      pdfBuffers.push(rucPdf);
    }

    // 3. Constancia RNP (OSCE)
    if (includeRnp) {
      docTitles.push('Constancia de Inscripción RNP - OSCE');
      const rnpPdf = await createSamplePdf(
        'OSCE - ORGANISMO SUPERVISOR DE LAS CONTRATACIONES DEL ESTADO',
        `REGISTRO NACIONAL DE PROVEEDORES (RNP) - RUC: ${company.ruc}`,
        [
          `Proveedor: ${company.razonSocial}`,
          `Domicilio: ${company.direccion}`,
          `Registro de Servicios: VIGENTE (Desde 06/05/2016)`,
          `Registro de Bienes: VIGENTE (Desde 06/05/2016)`,
          `Estado: HABILITADO PARA CONTRATAR CON EL ESTADO`,
          `Fecha de Consulta / Verificación: ${new Date().toLocaleDateString('es-PE')}`,
        ]
      );
      pdfBuffers.push(rnpPdf);
    }

    // 4. Carta de Autorización CCI
    if (includeCci) {
      docTitles.push('Carta de Autorización CCI');
      const cciPdf = await createSamplePdf(
        `${company.razonSocial}`,
        'ANEXO N° 05: CARTA DE AUTORIZACIÓN DE CÓDIGO DE CUENTA INTERBANCARIO (CCI)',
        [
          `RUC: ${company.ruc}`,
          `Banco: ${company.banco || 'BANCO BBVA PERÚ'}`,
          `Código de Cuenta Interbancario (CCI): ${company.cci || '01117500020030045178'}`,
          `Titular: ${company.razonSocial}`,
          'Por medio de la presente autorizo el abono correspondiente a los servicios prestados.',
          `Representante Legal: ${company.representanteLegal}`,
        ]
      );
      pdfBuffers.push(cciPdf);
    }

    // 5. Declaraciones Juradas (Anexos 1, 2, 3)
    if (includeAnexos) {
      docTitles.push('Declaraciones Juradas (Anexos 1, 2, 3)');
      const anexosPdf = await createSamplePdf(
        `${company.razonSocial}`,
        'DECLARACIONES JURADAS: DATOS, IMPEDIMENTOS Y ANTISOBORNO',
        [
          `ANEXO N° 01: DECLARACIÓN JURADA DE DATOS DEL PROVEEDOR`,
          `Proveedor: ${company.razonSocial} | RUC: ${company.ruc}`,
          `Representante: ${company.representanteLegal} | DNI: ${company.dniRepresentante}`,
          '',
          `ANEXO N° 02: DECLARACIÓN JURADA - IMPEDIMENTOS Y SANCIONES`,
          `Declaro bajo juramento no tener impedimento para contratar con el Estado (Ley N° 32069).`,
          '',
          `ANEXO N° 03: DECLARACIÓN JURADA ANTISOBORNO`,
          `Declaro no haber ofrecido ni negociado ningún beneficio indebido a servidores públicos.`,
        ]
      );
      pdfBuffers.push(anexosPdf);
    }

    // 6. Profesionales y Técnicos seleccionados
    if (selectedProfessionalIds && selectedProfessionalIds.length > 0) {
      const profesionales = await prisma.professional.findMany({
        where: { id: { in: selectedProfessionalIds } },
        include: { documentos: true },
      });

      for (const p of profesionales) {
        docTitles.push(`Personal Clave: ${p.nombres} ${p.apellidos}`);
        const profPdf = await createSamplePdf(
          'DOCUMENTACIÓN DE PERSONAL CLAVE Y TÉCNICO',
          `${p.tipo}: ${p.nombres} ${p.apellidos} - DNI: ${p.dni}`,
          [
            `Profesión / Especialidad: ${p.profesion}`,
            `Institución: ${p.institucion || 'CAPECO / MINEDU'}`,
            `N° de Registro / Colegiatura: ${p.nroRegistro || '235541-A-DDOO'}`,
            `Vigencia de Colegiatura: ${p.colegiaturaCaducidad ? new Date(p.colegiaturaCaducidad).toLocaleDateString('es-PE') : 'VIGENTE'}`,
            '',
            'DOCUMENTOS ACREDITADOS ADJUNTOS:',
            ...p.documentos.map((d) => `• ${d.tipo}: ${d.nombre}`),
            '',
            `Acreditación de experiencia: Conforme a TDR del requerimiento.`,
          ]
        );
        pdfBuffers.push(profPdf);
      }
    }

    // Compilar y Foliar todo en 1 solo PDF con pdf-lib
    const mergedPdfBuffer = await compileExpedientePdf(pdfBuffers, {
      documentTitles: docTitles,
      companyName: company.razonSocial,
      addFoliation: true,
      startFolio: 1,
    });

    return new Response(Buffer.from(mergedPdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Expediente_Postulacion_${company.ruc}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error in empaquetador PDF compilation:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error al generar expediente PDF' },
      { status: 500 }
    );
  }
}
