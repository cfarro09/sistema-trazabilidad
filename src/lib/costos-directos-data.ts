import costosDb from '@/data/costos-completos.json';

export interface ValorM2Grupo {
  item: string;
  grupo: string;
  parcialSoles: number;
  valorM2Soles: number;
  valorM2Dolares: number;
}

export interface PartidaPresupuesto {
  item: string;
  grupoItem: string;
  partida: string;
  unidad: string;
  metrado: number;
  precioUnitario: number;
  parcial: number;
  especialidad: 'OE' | 'HU' | 'ARQUITECTURA' | 'ESTRUCTURAS' | 'SANITARIAS' | 'ELECTRICAS';
}

export interface PartidaUnitarioOEHU {
  codigo: string;
  partida: string;
  unidad: string;
  precioUnitario: number;
  manoDeObra: number;
  materiales: number;
  equipos: number;
  especialidad: 'OE' | 'HU';
  subcategoria: string;
}

export interface InsumoPrecio {
  codigo: string;
  tipo: 'MATERIAL' | 'MANO_DE_OBRA' | 'EQUIPO';
  descripcion: string;
  unidad: string;
  precioSinIgv: number;
  precioConIgv: number;
  moneda?: string;
  proveedor?: string;
  marca?: string;
  grupo: string;
  pagina?: string;
}

export interface GrupoIndiceInsumo {
  letra: string;
  grupo: string;
  pagina: string;
  tipo: 'MATERIAL' | 'MANO_DE_OBRA' | 'EQUIPO';
  descripcion?: string;
}

export interface ProveedorInfo {
  nombre: string;
  pagina: string;
  direccion?: string;
  telefono?: string;
  celular?: string;
  email?: string;
  web?: string;
}

export interface APUItem {
  codigo: string;
  descripcion: string;
  unidad: string;
  rendimiento: string;
  especialidad: 'ARQUITECTURA' | 'ESTRUCTURAS' | 'SANITARIAS' | 'ELECTRICAS' | 'HU';
  costoUnitarioTotal: number;
  manoDeObra: { recurso: string; cuadrilla: number; unidad: string; cantidad: number; precio: number; parcial: number }[];
  materiales: { recurso: string; unidad: string; cantidad: number; precio: number; parcial: number }[];
  equipos: { recurso: string; cuadrilla: number; unidad: string; cantidad: number; precio: number; parcial: number }[];
}

// 1. VALOR M2 DE CONSTRUCCIÓN - LOS 35 GRUPOS OFICIALES (PÁGINA 1.1)
export const VALOR_M2_GRUPOS: ValorM2Grupo[] = costosDb.valorM2Grupos as ValorM2Grupo[];

// 2. PRESUPUESTO DESGLOSADO COMPLETO (PÁGINAS 1.2 Y 1.3)
export const PARTIDAS_PRESUPUESTO: PartidaPresupuesto[] = costosDb.partidasPresupuesto as PartidaPresupuesto[];

// 3. PRECIOS UNITARIOS DE PARTIDAS OE & HU (732 PARTIDAS - PÁGINAS 1.5 A 1.13)
export const PARTIDAS_OE_HU: PartidaUnitarioOEHU[] = costosDb.partidasOEHU as PartidaUnitarioOEHU[];

// 4. ÍNDICE COMPLETO DE GRUPOS DE LA A A LA Z (303 GRUPOS - PÁGINAS 3.1 Y 3.2 DEL PDF)
export const INDICE_GRUPOS_INSUMOS: GrupoIndiceInsumo[] = costosDb.indiceGrupos as GrupoIndiceInsumo[];

// 5. CATÁLOGO COMPLETO DE INSUMOS, MATERIALES, MANO DE OBRA Y EQUIPOS (2,333 RECURSOS)
export const INSUMOS_PRECIOS: InsumoPrecio[] = costosDb.insumos as InsumoPrecio[];

// 6. DIRECTORIO DE PROVEEDORES DEL SECTOR CONSTRUCCIÓN (44 EMPRESAS - PÁGINAS 3.3 Y 3.4)
export const PROVEEDORES_DIRECTORIO: ProveedorInfo[] = costosDb.proveedores as ProveedorInfo[];

// 7. ANÁLISIS DE PRECIOS UNITARIOS (APU) - PÁGINAS 2.1 A 2.4
export const APU_CATALOGO: APUItem[] = [
  {
    codigo: 'APU-OE-4.2.6.26',
    descripcion: 'OE.4.2.6.26 TANQUES-ACCESORIOS 1 1/2"',
    unidad: 'PZA',
    rendimiento: '1.00 pza/día',
    especialidad: 'SANITARIAS',
    costoUnitarioTotal: 1011.67,
    manoDeObra: [
      { recurso: 'CAPATAZ', cuadrilla: 0.8, unidad: 'hh', cantidad: 0.80, precio: 34.07, parcial: 27.26 },
      { recurso: 'OPERARIO', cuadrilla: 8.0, unidad: 'hh', cantidad: 8.00, precio: 28.39, parcial: 227.12 },
      { recurso: 'PEON', cuadrilla: 4.0, unidad: 'hh', cantidad: 4.00, precio: 20.22, parcial: 80.88 },
    ],
    materiales: [
      { recurso: 'PEGAMENTO P/TUBO PVC L', unidad: 'gal', cantidad: 0.01, precio: 277.63, parcial: 2.78 },
      { recurso: 'VALVULA CHECK HORIZONTAL BRONCE 1 1/2"', unidad: 'pza', cantidad: 1.00, precio: 93.14, parcial: 93.14 },
      { recurso: 'VALVULA FLOTADORA C/BOLLA COBRE 150 LB 1 1/2"', unidad: 'pza', cantidad: 1.00, precio: 194.92, parcial: 194.92 },
      { recurso: 'VALVULA COMPUERTA PESADA BRONCE 250 LB 1 1/2"', unidad: 'pza', cantidad: 2.00, precio: 126.86, parcial: 253.72 },
      { recurso: 'TUBO PVC AGUA S.P. CLASE 10 1 1/2" X 5m', unidad: 'pza', cantidad: 2.00, precio: 53.31, parcial: 106.62 },
      { recurso: 'UNION UNIVERSAL PVC AGUA ROSCADO 1 1/2"', unidad: 'pza', cantidad: 1.00, precio: 15.17, parcial: 15.17 },
    ],
    equipos: [
      { recurso: 'HERRAMIENTA MANUAL (3% MO)', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.03, precio: 335.26, parcial: 10.06 },
    ],
  },
  {
    codigo: 'APU-OE-4.2.7.21',
    descripcion: 'OE.4.2.7.21 GABINETE C.INC.80x60x18cm C/MANGUERA POLYESTER 1 1/2"x30m',
    unidad: 'PZA',
    rendimiento: '1.00 pza/día',
    especialidad: 'SANITARIAS',
    costoUnitarioTotal: 1628.17,
    manoDeObra: [
      { recurso: 'CAPATAZ', cuadrilla: 0.4, unidad: 'hh', cantidad: 0.40, precio: 34.07, parcial: 13.63 },
      { recurso: 'OPERARIO', cuadrilla: 4.0, unidad: 'hh', cantidad: 4.00, precio: 28.39, parcial: 113.56 },
      { recurso: 'OFICIAL', cuadrilla: 4.0, unidad: 'hh', cantidad: 4.00, precio: 22.33, parcial: 89.32 },
    ],
    materiales: [
      { recurso: 'VALVULA ANGULAR BRONCE UL/FM 1 1/2" 300 PSI', unidad: 'pza', cantidad: 1.00, precio: 214.44, parcial: 214.44 },
      { recurso: 'GABINETE METALICO AGUA C/INCENDIO 80x60x18cm', unidad: 'pza', cantidad: 1.00, precio: 168.64, parcial: 168.64 },
      { recurso: 'MANGUERA 1 1/2"x30 m. POLYESTER CON ACOPLE', unidad: 'und', cantidad: 1.00, precio: 694.92, parcial: 694.92 },
      { recurso: 'PITON DE POLICARBONATO 1 1/2"', unidad: 'und', cantidad: 1.00, precio: 42.37, parcial: 42.37 },
      { recurso: 'PORTA MANGUERA METÁLICA P/ MANGUERA CONTRA INCENDIO', unidad: 'pza', cantidad: 1.00, precio: 276.22, parcial: 276.22 },
    ],
    equipos: [
      { recurso: 'HERRAMIENTA MANUAL (5% MO)', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.05, precio: 216.51, parcial: 10.83 },
    ],
  },
  {
    codigo: 'APU-OE-4.6.1.11',
    descripcion: 'OE.4.6.1.11 SALIDA DE DESAGUE PVC-SAL 2"',
    unidad: 'PTO',
    rendimiento: '4.00 pto/día',
    especialidad: 'SANITARIAS',
    costoUnitarioTotal: 136.13,
    manoDeObra: [
      { recurso: 'CAPATAZ', cuadrilla: 0.2, unidad: 'hh', cantidad: 0.20, precio: 34.07, parcial: 6.81 },
      { recurso: 'OPERARIO', cuadrilla: 2.0, unidad: 'hh', cantidad: 2.00, precio: 28.39, parcial: 56.78 },
      { recurso: 'PEON', cuadrilla: 2.0, unidad: 'hh', cantidad: 2.00, precio: 20.22, parcial: 40.44 },
    ],
    materiales: [
      { recurso: 'PEGAMENTO P/TUBO PVC L', unidad: 'gal', cantidad: 0.03, precio: 277.63, parcial: 8.33 },
      { recurso: 'TUBO PVC DESAGUE SAL 2" X 3 m', unidad: 'pza', cantidad: 0.35, precio: 10.89, parcial: 3.81 },
      { recurso: 'CODO PVC DESAGUE SAL 2" X 90°', unidad: 'pza', cantidad: 1.03, precio: 1.95, parcial: 2.01 },
      { recurso: 'YEE PVC DESAGUE SAL 2"', unidad: 'pza', cantidad: 1.03, precio: 4.32, parcial: 4.45 },
      { recurso: 'TRAMPA P PVC DESAGUE SAL 2"', unidad: 'pza', cantidad: 1.03, precio: 10.08, parcial: 10.38 },
    ],
    equipos: [
      { recurso: 'HERRAMIENTA MANUAL (3% MO)', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.03, precio: 104.03, parcial: 3.12 },
    ],
  },
  {
    codigo: 'APU-OE-4.6.5.31',
    descripcion: 'OE.4.6.5.31 BUZONES DE DESAGUE STD.',
    unidad: 'PZA',
    rendimiento: '0.50 pza/día',
    especialidad: 'SANITARIAS',
    costoUnitarioTotal: 2294.00,
    manoDeObra: [
      { recurso: 'CAPATAZ', cuadrilla: 1.6, unidad: 'hh', cantidad: 1.60, precio: 34.07, parcial: 54.51 },
      { recurso: 'OPERARIO', cuadrilla: 16.0, unidad: 'hh', cantidad: 16.00, precio: 28.39, parcial: 454.24 },
      { recurso: 'OFICIAL', cuadrilla: 5.28, unidad: 'hh', cantidad: 5.28, precio: 22.33, parcial: 117.90 },
      { recurso: 'PEON', cuadrilla: 32.0, unidad: 'hh', cantidad: 32.00, precio: 20.22, parcial: 647.04 },
      { recurso: 'OPERADOR EQUIPO', cuadrilla: 1.6, unidad: 'hh', cantidad: 1.60, precio: 29.61, parcial: 47.38 },
    ],
    materiales: [
      { recurso: 'ARENA GRUESA', unidad: 'm3', cantidad: 1.05, precio: 49.15, parcial: 51.61 },
      { recurso: 'PIEDRA CHANCADA DE 1/2" - 3/4"', unidad: 'm3', cantidad: 1.568, precio: 55.08, parcial: 86.37 },
      { recurso: 'CEMENTO PORTLAND TIPO I (BLS 42.5 kg)', unidad: 'bls', cantidad: 18.25, precio: 24.52, parcial: 447.49 },
      { recurso: 'TAPA DE C.R. P/BUZON 650mm', unidad: 'pza', cantidad: 1.00, precio: 83.90, parcial: 83.90 },
      { recurso: 'MADERA ENCOFRADO TORNILLO', unidad: 'p2', cantidad: 14.70, precio: 8.47, parcial: 124.51 },
      { recurso: 'ACERO CORRUGADO F\'Y=4200 (G-60)', unidad: 't', cantidad: 0.019, precio: 3823.47, parcial: 72.65 },
    ],
    equipos: [
      { recurso: 'MEZCLADORA DE CONCRETO T.TAMBOR 23HP 11-12P3', cuadrilla: 1.0, unidad: 'hm', cantidad: 1.60, precio: 26.16, parcial: 41.86 },
      { recurso: 'HERRAMIENTA MANUAL (3% MO)', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.03, precio: 1321.07, parcial: 39.63 },
    ],
  },
  {
    codigo: 'APU-OE-5.2.1.11',
    descripcion: 'OE.5.2.1.11 SALIDA DE TECHO C/TUB.SEL(3/4) CABLE TW12, CAJAS LIVIANAS',
    unidad: 'PTO',
    rendimiento: '5.00 pto/día',
    especialidad: 'ELECTRICAS',
    costoUnitarioTotal: 115.49,
    manoDeObra: [
      { recurso: 'CAPATAZ', cuadrilla: 0.16, unidad: 'hh', cantidad: 0.16, precio: 34.07, parcial: 5.45 },
      { recurso: 'OPERARIO ELECTRICISTA', cuadrilla: 1.6, unidad: 'hh', cantidad: 1.60, precio: 28.39, parcial: 45.42 },
      { recurso: 'PEON', cuadrilla: 1.6, unidad: 'hh', cantidad: 1.60, precio: 20.22, parcial: 32.35 },
    ],
    materiales: [
      { recurso: 'TUBO PVC ELECTRICO SEL 3/4" X 3 m', unidad: 'pza', cantidad: 1.50, precio: 4.07, parcial: 6.11 },
      { recurso: 'CURVA PVC ELECTRICA SEL 3/4" X 45°', unidad: 'pza', cantidad: 3.00, precio: 0.59, parcial: 1.77 },
      { recurso: 'UNION PVC ELECTRICA SEL 3/4"', unidad: 'pza', cantidad: 1.00, precio: 0.51, parcial: 0.51 },
      { recurso: 'CAJA DE PASE OCTOGONAL F.G. LIVIANA 4"', unidad: 'pza', cantidad: 1.00, precio: 1.61, parcial: 1.61 },
      { recurso: 'CABLE TW 12 AWG', unidad: 'm', cantidad: 9.00, precio: 1.92, parcial: 17.28 },
    ],
    equipos: [
      { recurso: 'HERRAMIENTA MANUAL (5% MO)', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.05, precio: 83.22, parcial: 4.16 },
    ],
  },
];
