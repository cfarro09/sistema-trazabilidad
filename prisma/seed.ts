import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with real procurement data...');

  // 1. Limpiar base de datos
  await prisma.serviceDocument.deleteMany();
  await prisma.serviceContract.deleteMany();
  await prisma.professionalDocument.deleteMany();
  await prisma.professional.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // 2. Crear Usuarios
  await prisma.user.createMany({
    data: [
      { name: 'Carlos Administrador', email: 'admin@licitacionesperu.com', role: 'ADMIN' },
      { name: 'Asistente de Licitaciones', email: 'asistente@licitacionesperu.com', role: 'ASISTENTE' },
    ],
  });

  // 3. Crear 3 Empresas del Grupo
  const andean = await prisma.company.create({
    data: {
      ruc: '20509152129',
      razonSocial: 'ANDEAN TRADING COMPANY S.A.C.',
      nombreComercial: 'ANDEAN TRADING',
      representanteLegal: 'JESUS DINA REYES GONZALES',
      dniRepresentante: '10040323',
      direccion: 'Pj. Velarde Nro. 165 Dpto. 104 (Espalda Cdra. 12 Av. Wilson) - Lima',
      telefono: '332-3455 / 983446851',
      email: 'andeantradingcompanysac@gmail.com',
      banco: 'BANCO BBVA PERÚ',
      cci: '01117500020030045178',
      rnpVigenciaDesde: new Date('2016-05-06'),
      rnpEstado: 'VIGENTE',
    },
  });

  const constructores = await prisma.company.create({
    data: {
      ruc: '20600775848',
      razonSocial: 'GRUPO EMPRESARIAL DE CONSTRUCTORES CONSULTORES Y ASESORES S.A.C.',
      nombreComercial: 'GRUPO CONSTRUCTORES',
      representanteLegal: 'JESUS DINA REYES GONZALES',
      dniRepresentante: '10040323',
      direccion: 'Av. Los Diseñadores Mza. M1 Lote. 16B Urb. Parque Industrial - Villa El Salvador, Lima',
      telefono: '983446851',
      email: 'grupo.constructores.sac@gmail.com',
      banco: 'BANCO DE CRÉDITO DEL PERÚ (BCP)',
      cci: '00219100012345678901',
      rnpVigenciaDesde: new Date('2018-03-15'),
      rnpEstado: 'VIGENTE',
    },
  });

  const inversiones = await prisma.company.create({
    data: {
      ruc: '20608912345',
      razonSocial: 'INVERSIONES & SERVICIOS INTEGRALES DEL PERÚ S.A.C.',
      nombreComercial: 'INVERSIONES DEL PERÚ',
      representanteLegal: 'JOAQUIN ANTONY LAURENTE PEREZ',
      dniRepresentante: '47432521',
      direccion: 'Av. Nicolás de Piérola Nro. 589 Edif. Crillón - Cercado de Lima',
      telefono: '990130347',
      email: 'joaquinlaurente@gmail.com',
      banco: 'INTERBANK',
      cci: '00319100098765432109',
      rnpVigenciaDesde: new Date('2021-01-10'),
      rnpEstado: 'VIGENTE',
    },
  });

  // 4. Crear Profesionales y Técnicos con Colegiatura
  const carlosSandoval = await prisma.professional.create({
    data: {
      tipo: 'TECNICO',
      dni: '46374328',
      nombres: 'CARLOS DENY',
      apellidos: 'SANDOVAL FARROÑAN',
      profesion: 'Técnico en Construcción Civil',
      institucion: 'IESTP CAPECO',
      nroRegistro: '235541-A-DDOO',
      colegiaturaCaducidad: new Date('2027-02-09'), // Vigente
      telefono: '987654321',
      email: 'carlos.sandoval@gmail.com',
      documentos: {
        create: [
          {
            tipo: 'TITULO',
            nombre: 'Título Profesional Técnico en Construcción Civil - CAPECO / MINEDU',
            entidadEmisora: 'Ministerio de Educación - DRELM',
            fechaEmision: new Date('2016-02-09'),
            archivoUrl: '/uploads/docs/titulo_carlos_sandoval.pdf',
          },
          {
            tipo: 'CERTIFICADO',
            nombre: 'Constancia de Prestación de Servicios - Andean Trading Company (15 Meses - Acabados y Pintura)',
            entidadEmisora: 'ANDEAN TRADING COMPANY S.A.C.',
            fechaEmision: new Date('2023-11-30'),
            archivoUrl: '/uploads/docs/constancia_carlos_sandoval.pdf',
          },
        ],
      },
    },
  });

  const gustavoVega = await prisma.professional.create({
    data: {
      tipo: 'INGENIERO',
      dni: '09485721',
      nombres: 'GUSTAVO FELIPE',
      apellidos: 'VEGA MEZA',
      profesion: 'Ingeniero Civil',
      institucion: 'Colegio de Ingenieros del Perú (CIP)',
      nroRegistro: 'CIP 72068',
      colegiaturaCaducidad: new Date('2026-12-31'), // Vigente
      telefono: '991234567',
      email: 'gvega.cip@gmail.com',
      documentos: {
        create: [
          {
            tipo: 'TITULO',
            nombre: 'Título Profesional de Ingeniero Civil',
            entidadEmisora: 'Universidad Nacional de Ingeniería',
            fechaEmision: new Date('2010-06-15'),
            archivoUrl: '/uploads/docs/titulo_ing_vega.pdf',
          },
          {
            tipo: 'COLEGIATURA',
            nombre: 'Certificado de Habilidad Profesional CIP N° 72068',
            entidadEmisora: 'Colegio de Ingenieros del Perú',
            fechaEmision: new Date('2026-01-01'),
            fechaCaducidad: new Date('2026-12-31'),
            archivoUrl: '/uploads/docs/habilidad_cip_vega.pdf',
          },
        ],
      },
    },
  });

  // 5. Crear Servicios Reales
  // Servicio 1: SUSALUD Alfombra
  await prisma.serviceContract.create({
    data: {
      codigoInterno: 'COT-2026-000701',
      empresaId: andean.id,
      entidad: 'SUPERINTENDENCIA NACIONAL DE SALUD (SUSALUD)',
      unidadEjecutora: '001 SUPERINTENDENCIA NACIONAL DE SALUD (000515)',
      objetoContratacion: 'CONTRATACIÓN DEL SERVICIO DE ACONDICIONAMIENTO DE ALFOMBRA PARA LAS OFICINAS DE LA GERENCIA GENERAL Y LA SUPERINTENDENCIA',
      descripcionDetallada: 'Ejecutar el acondicionamiento de alfombra para las oficinas de la Gerencia General y la Superintendencia, ubicadas en el primer piso del Pabellón B de SUSALUD, Av. Velasco Astete 1398 Surco.',
      rubro: 'ALFOMBRAS Y ACONDICIONAMIENTO',
      montoSinIgv: 19150.34,
      montoIgv: 3447.06,
      montoTotal: 22597.40,
      moneda: 'S/',
      nroCotizacion: 'COT-2026-SUSALUD-01',
      fechaCotizacion: new Date('2026-08-10'),
      nroOrdenServicio: '0000701',
      nroSiaf: '0000001761',
      fechaOrden: new Date('2026-08-17'),
      plazoEjecucionDias: 10,
      fechaInforme: new Date('2026-08-27'),
      nroConformidad: 'CONF-SUSALUD-2026-701',
      fechaConformidad: new Date('2026-08-28'),
      estado: 'CONFORME',
      esHistorico: false,
    },
  });

  // Servicio 2: SUSALUD Escaleras Metálicas
  await prisma.serviceContract.create({
    data: {
      codigoInterno: 'COT-2026-000616',
      empresaId: constructores.id,
      entidad: 'SUPERINTENDENCIA NACIONAL DE SALUD (SUSALUD)',
      unidadEjecutora: '001 SUPERINTENDENCIA NACIONAL DE SALUD (000515)',
      objetoContratacion: 'CONTRATACIÓN DEL SERVICIO DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE DOS (02) ESCALERAS METÁLICAS DE LA SEDE SURCO',
      descripcionDetallada: 'Mantenimiento preventivo y correctivo de dos (02) escaleras metálicas exteriores de la Sede Surco de SUSALUD: inspección técnica, limpieza, eliminación de corrosión, soldadura, sistema anticorrosivo industrial, pintura epóxica y cintas antideslizantes.',
      rubro: 'ESTRUCTURAS METÁLICAS Y PINTURA',
      montoSinIgv: 10850.00,
      montoIgv: 1953.00,
      montoTotal: 12803.00,
      moneda: 'S/',
      nroCotizacion: 'COT-2026-SUSALUD-02',
      fechaCotizacion: new Date('2026-07-20'),
      nroOrdenServicio: '0000616',
      nroSiaf: '0000001568',
      fechaOrden: new Date('2026-07-31'),
      plazoEjecucionDias: 20,
      fechaInforme: new Date('2026-08-15'),
      nroConformidad: 'CONF-SUSALUD-2026-616',
      fechaConformidad: new Date('2026-08-16'),
      estado: 'CONFORME',
      esHistorico: false,
    },
  });

  // Servicio 3: PNP Ciudadela Chalaca (Pintura y Mantenimiento)
  await prisma.serviceContract.create({
    data: {
      codigoInterno: 'COT-2025-001197',
      empresaId: andean.id,
      entidad: 'VII DIRECCIÓN TERRITORIAL DE POLICÍA - LIMA (DIRTEPOL)',
      unidadEjecutora: '009 VII DIRECCION TERRITORIAL DE POLICIA- LIMA (000033)',
      objetoContratacion: 'SERVICIO DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE LOS SERVICIOS HIGIÉNICOS, OFICINAS, DORMITORIOS, INSTALACIONES ELÉCTRICAS, FACHADA, PINTURA Y OTRAS NECESIDADES ADVERTIDAS DE LA COMISARÍA PNP CIUDADELA CHALACA REGPOL CALLAO',
      descripcionDetallada: 'Servicio integral de mantenimiento preventivo y correctivo: carpintería metálica, pintado con pintura látex satinado y esmalte sintético en muros y fachada, instalaciones eléctricas, tableros termo magnéticos, aparatos sanitarios y luminarias en comisaría PNP.',
      rubro: 'PINTURA Y MANTENIMIENTO INTEGRAL',
      montoSinIgv: 92750.85,
      montoIgv: 16695.15,
      montoTotal: 109446.00,
      moneda: 'S/',
      nroCotizacion: 'COT-PNP-2025-09',
      fechaCotizacion: new Date('2025-05-10'),
      nroOrdenServicio: '0001197',
      nroSiaf: '3055',
      fechaOrden: new Date('2025-05-15'),
      plazoEjecucionDias: 45,
      fechaInforme: new Date('2025-07-21'),
      nroConformidad: '012-2026 / ACTA 01-AGOSTO-2025',
      fechaConformidad: new Date('2025-08-01'),
      nroFactura: 'E001-150',
      fechaFactura: new Date('2025-09-09'),
      montoFacturado: 109446.00,
      nroOperacion: '284329542',
      fechaPago: new Date('2025-09-30'),
      montoPagado: 109446.00,
      estado: 'PAGADO',
      esHistorico: false,
    },
  });

  // Servicio 4: UGEL 06 Pintura Administrativa (Histórico de 2016)
  await prisma.serviceContract.create({
    data: {
      codigoInterno: 'COT-2016-000827',
      empresaId: andean.id,
      entidad: 'UNIDAD DE GESTIÓN EDUCATIVA LOCAL 06 - ATE VITARTE (UGEL 06)',
      unidadEjecutora: '006 UNIDAD DE GESTION EDUCATIVA LOCAL 06 (000061)',
      objetoContratacion: 'ACONDICIONAMIENTO DEL SERVICIO DE PINTADO DE LAS ÁREAS ADMINISTRATIVAS EN GENERAL UGEL 06',
      descripcionDetallada: 'Acondicionamiento y servicio de pintado de las áreas administrativas en general de la UGEL 06: masillado, lijado, curación de sectores que lo requieran y pintura látex a dos manos de las oficinas administrativas y fachada.',
      rubro: 'PINTURA Y ACABADOS',
      montoSinIgv: 26271.19,
      montoIgv: 4728.81,
      montoTotal: 31000.00,
      moneda: 'S/',
      nroCotizacion: 'COT-UGEL06-2016-827',
      fechaCotizacion: new Date('2016-11-10'),
      nroOrdenServicio: '0000827',
      nroSiaf: '1333',
      fechaOrden: new Date('2016-11-21'),
      nroFactura: '001-002114',
      fechaFactura: new Date('2016-12-15'),
      montoFacturado: 31000.00,
      fechaPago: new Date('2016-12-22'),
      montoPagado: 31000.00,
      estado: 'PAGADO',
      esHistorico: true,
    },
  });

  // Servicio 5: Cotización en trámite SUSALUD Pintado Alta Dirección
  await prisma.serviceContract.create({
    data: {
      codigoInterno: 'COT-2026-00175',
      empresaId: andean.id,
      entidad: 'SUPERINTENDENCIA NACIONAL DE SALUD (SUSALUD)',
      unidadEjecutora: '001 SUPERINTENDENCIA NACIONAL DE SALUD',
      objetoContratacion: 'SERVICIO DE PINTADO DE LAS OFICINAS DE ALTA DIRECCIÓN CORRESPONDIENTES A LA GERENCIA GENERAL Y A LA SUPERINTENDENCIA',
      descripcionDetallada: 'Actividades preliminares, protección de áreas de trabajo con EPP, resane, masillado y lijado de paredes dañadas, pintura látex satinado en paredes (416 m2) y pintura látex (37 m2), retiro y reposición de pavonado en lunas.',
      rubro: 'PINTURA Y ACABADOS',
      montoSinIgv: 14406.78,
      montoIgv: 2593.22,
      montoTotal: 17000.00,
      moneda: 'S/',
      nroCotizacion: '00175-26',
      fechaCotizacion: new Date('2026-08-13'),
      plazoEjecucionDias: 10,
      estado: 'COTIZACION',
      esHistorico: false,
    },
  });

  console.log('✅ Base de datos poblada con éxito con datos de compras estatales reales!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
