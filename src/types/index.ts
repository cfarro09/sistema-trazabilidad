export type StageKey =
  | 'CONVOCATORIA'
  | 'COTIZACION'
  | 'PREPARACION_DOCS'
  | 'ORDEN_SERVICIO'
  | 'INFORME'
  | 'CONFORMIDAD'
  | 'FACTURA'
  | 'PAGO';

export type ServiceStatus =
  | 'COTIZACION'
  | 'ACEPTADO_ORDEN'
  | 'EN_EJECUCION'
  | 'CONFORME'
  | 'FACTURADO'
  | 'PAGADO'
  | 'RECHAZADO';

export interface CompanyData {
  id: string;
  ruc: string;
  razonSocial: string;
  nombreComercial?: string | null;
  representanteLegal: string;
  dniRepresentante: string;
  direccion: string;
  telefono?: string | null;
  email?: string | null;
  banco?: string | null;
  cci?: string | null;
  rnpVigenciaDesde?: string | null;
  rnpEstado: string;
  rnpPdf?: string | null;
  rucPdf?: string | null;
  cciPdf?: string | null;
  anexo1Pdf?: string | null;
  anexo2Pdf?: string | null;
  anexo3Pdf?: string | null;
}

export interface ProfessionalDocData {
  id: string;
  profesionalId: string;
  tipo: 'TITULO' | 'CERTIFICADO' | 'CONSTANCIA' | 'COLEGIATURA';
  nombre: string;
  entidadEmisora?: string | null;
  fechaEmision?: string | null;
  fechaCaducidad?: string | null;
  archivoUrl: string;
}

export interface ProfessionalData {
  id: string;
  tipo: 'TECNICO' | 'INGENIERO';
  dni: string;
  nombres: string;
  apellidos: string;
  profesion: string;
  institucion?: string | null;
  nroRegistro?: string | null;
  colegiaturaCaducidad?: string | null;
  telefono?: string | null;
  email?: string | null;
  documentos: ProfessionalDocData[];
  diasParaVencer?: number | null;
  estadoVigencia?: 'VIGENTE' | 'POR_VENCER' | 'VENCIDO' | 'SIN_COLEGIATURA';
}

export interface ServiceContractData {
  id: string;
  codigoInterno: string;
  empresaId: string;
  empresa?: CompanyData;
  entidad: string;
  unidadEjecutora?: string | null;
  objetoContratacion: string;
  descripcionDetallada: string;
  rubro?: string | null;
  montoSinIgv: number;
  montoIgv: number;
  montoTotal: number;
  moneda: string;

  // Hitos
  nroCotizacion?: string | null;
  fechaCotizacion?: string | null;
  tdrPdf?: string | null;
  cotizacionPdf?: string | null;

  expedientePostulacionPdf?: string | null;

  nroOrdenServicio?: string | null;
  nroSiaf?: string | null;
  fechaOrden?: string | null;
  plazoEjecucionDias?: number | null;
  ordenServicioPdf?: string | null;

  fechaInforme?: string | null;
  informePdf?: string | null;

  nroConformidad?: string | null;
  fechaConformidad?: string | null;
  conformidadPdf?: string | null;

  nroFactura?: string | null;
  fechaFactura?: string | null;
  montoFacturado?: number | null;
  facturaPdf?: string | null;

  fechaPago?: string | null;
  nroOperacion?: string | null;
  montoPagado?: number | null;
  pagoPdf?: string | null;
  detraccionPdf?: string | null;

  estado: ServiceStatus;
  esHistorico: boolean;
  createdAt: string;
  updatedAt: string;
}
