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

export interface InsumoPrecio {
  codigo: string;
  tipo: 'MATERIAL' | 'MANO_DE_OBRA' | 'EQUIPO';
  descripcion: string;
  unidad: string;
  precioSinIgv: number;
  precioConIgv: number;
  proveedor?: string;
  marca?: string;
  grupo: string;
}

export interface APUItem {
  codigo: string;
  descripcion: string;
  unidad: string;
  rendimiento: string;
  especialidad: 'ARQUITECTURA' | 'ESTRUCTURAS' | 'SANITARIAS' | 'ELECTRICAS';
  costoUnitarioTotal: number;
  manoDeObra: { recurso: string; cuadrilla: number; unidad: string; cantidad: number; precio: number; parcial: number }[];
  materiales: { recurso: string; unidad: string; cantidad: number; precio: number; parcial: number }[];
  equipos: { recurso: string; cuadrilla: number; unidad: string; cantidad: number; precio: number; parcial: number }[];
}

export const VALOR_M2_GRUPOS: ValorM2Grupo[] = [
  { item: '01', grupo: 'Obras Provisionales', parcialSoles: 13822.76, valorM2Soles: 69.11, valorM2Dolares: 18.77 },
  { item: '02', grupo: 'Trabajos Preliminares', parcialSoles: 2484.00, valorM2Soles: 12.42, valorM2Dolares: 3.37 },
  { item: '03', grupo: 'Movimiento de Tierras', parcialSoles: 7556.02, valorM2Soles: 37.78, valorM2Dolares: 10.26 },
  { item: '04', grupo: 'Obras de Concreto Simple', parcialSoles: 11738.79, valorM2Soles: 58.69, valorM2Dolares: 15.94 },
  { item: '05', grupo: 'Concreto Armado', parcialSoles: 73881.54, valorM2Soles: 369.41, valorM2Dolares: 100.30 },
  { item: '06', grupo: 'Muros y Tabiques de Albañilería', parcialSoles: 25490.26, valorM2Soles: 127.45, valorM2Dolares: 34.61 },
  { item: '07', grupo: 'Revoques y Enlucidos', parcialSoles: 17109.26, valorM2Soles: 85.55, valorM2Dolares: 23.23 },
  { item: '08', grupo: 'Cielo Raso', parcialSoles: 8922.90, valorM2Soles: 44.61, valorM2Dolares: 12.11 },
  { item: '09', grupo: 'Pisos y Pavimentos', parcialSoles: 24308.59, valorM2Soles: 121.54, valorM2Dolares: 33.00 },
  { item: '10', grupo: 'Contrazócalos', parcialSoles: 2222.48, valorM2Soles: 11.11, valorM2Dolares: 3.02 },
  { item: '11', grupo: 'Zócalos', parcialSoles: 3069.69, valorM2Soles: 15.35, valorM2Dolares: 4.17 },
  { item: '12', grupo: 'Revestimientos de Gradas y Escaleras', parcialSoles: 1682.19, valorM2Soles: 8.41, valorM2Dolares: 2.28 },
  { item: '13', grupo: 'Cubiertas', parcialSoles: 2130.24, valorM2Soles: 10.65, valorM2Dolares: 2.89 },
  { item: '14', grupo: 'Carpintería de Madera', parcialSoles: 30903.86, valorM2Soles: 154.52, valorM2Dolares: 41.95 },
  { item: '15', grupo: 'Carpintería Metálica', parcialSoles: 2500.00, valorM2Soles: 12.50, valorM2Dolares: 3.39 },
  { item: '16', grupo: 'Cerrajería', parcialSoles: 5246.83, valorM2Soles: 26.23, valorM2Dolares: 7.12 },
  { item: '17', grupo: 'Vidrios, Cristales y Similares', parcialSoles: 7765.76, valorM2Soles: 38.83, valorM2Dolares: 10.54 },
  { item: '18', grupo: 'Pintura', parcialSoles: 27758.05, valorM2Soles: 138.79, valorM2Dolares: 37.68 },
  { item: '19', grupo: 'Varios, Limpieza y Jardinería', parcialSoles: 4589.79, valorM2Soles: 22.95, valorM2Dolares: 6.23 },
  { item: '20', grupo: 'Aparatos y Accesorios Sanitarios', parcialSoles: 7344.64, valorM2Soles: 36.72, valorM2Dolares: 9.97 },
  { item: '21', grupo: 'Sistema de Desagüe', parcialSoles: 5258.77, valorM2Soles: 26.29, valorM2Dolares: 7.14 },
  { item: '22', grupo: 'Accesorios de Redes Desagüe', parcialSoles: 271.00, valorM2Soles: 1.36, valorM2Dolares: 0.37 },
  { item: '23', grupo: 'Aditamentos Varios', parcialSoles: 674.95, valorM2Soles: 3.37, valorM2Dolares: 0.92 },
  { item: '24', grupo: 'Sistema de Agua Potable', parcialSoles: 5626.59, valorM2Soles: 28.13, valorM2Dolares: 7.64 },
  { item: '25', grupo: 'Sistema de Agua Caliente', parcialSoles: 2183.71, valorM2Soles: 10.92, valorM2Dolares: 2.96 },
  { item: '26', grupo: 'Almacenamiento de Agua', parcialSoles: 1888.77, valorM2Soles: 9.44, valorM2Dolares: 2.56 },
  { item: '27', grupo: 'Instalaciones Eléctricas - Movimiento de Tierras', parcialSoles: 391.87, valorM2Soles: 1.96, valorM2Dolares: 0.53 },
  { item: '28', grupo: 'Tuberías y Accesorios Electr. PVC-SAP', parcialSoles: 3630.26, valorM2Soles: 18.15, valorM2Dolares: 4.93 },
  { item: '29', grupo: 'Tuberías y Accesorios Electr. PVC - SEL', parcialSoles: 8281.54, valorM2Soles: 41.41, valorM2Dolares: 11.24 },
];

export const PARTIDAS_PRESUPUESTO: PartidaPresupuesto[] = [
  // 01 Obras Provisionales
  { item: '01.01.01', grupoItem: '01', partida: 'Construcción de almacén, oficinas y caseta de guardianía', unidad: 'm2', metrado: 15.00, precioUnitario: 101.48, parcial: 1522.20, especialidad: 'OE' },
  { item: '01.01.02', grupoItem: '01', partida: 'Cisterna provisional para agua construcción de albañilería (4 m3)', unidad: 'pza', metrado: 1.00, precioUnitario: 938.28, parcial: 938.28, especialidad: 'OE' },
  { item: '01.02.01', grupoItem: '01', partida: 'Agua para la construcción', unidad: 'mes', metrado: 4.00, precioUnitario: 2840.57, parcial: 11362.28, especialidad: 'OE' },

  // 02 Trabajos Preliminares
  { item: '02.01.01', grupoItem: '02', partida: 'Limpieza manual de terreno', unidad: 'm2', metrado: 200.00, precioUnitario: 4.84, parcial: 968.00, especialidad: 'OE' },
  { item: '02.02.01', grupoItem: '02', partida: 'Trazo, niveles y replanteo preliminar', unidad: 'm2', metrado: 200.00, precioUnitario: 3.79, parcial: 758.00, especialidad: 'OE' },
  { item: '02.03.01', grupoItem: '02', partida: 'Trazo, niveles y replanteo durante el proceso constructivo', unidad: 'm2', metrado: 200.00, precioUnitario: 3.79, parcial: 758.00, especialidad: 'OE' },

  // 03 Movimiento de Tierras
  { item: '03.01.01', grupoItem: '03', partida: 'Excavación manual de zanjas para cimientos corridos hasta h=1.00m', unidad: 'm3', metrado: 45.00, precioUnitario: 48.50, parcial: 2182.50, especialidad: 'ESTRUCTURAS' },
  { item: '03.02.01', grupoItem: '03', partida: 'Relleno y compactado con material propio seleccionado', unidad: 'm3', metrado: 28.00, precioUnitario: 34.20, parcial: 957.60, especialidad: 'ESTRUCTURAS' },
  { item: '03.03.01', grupoItem: '03', partida: 'Eliminación manual de material excedente con volquete 15m3 (distancia 10km)', unidad: 'm3', metrado: 52.00, precioUnitario: 84.92, parcial: 4415.92, especialidad: 'ESTRUCTURAS' },

  // 04 Concreto Simple
  { item: '04.01.01', grupoItem: '04', partida: 'Cimientos corridos mezcla C:H 1:10 + 30% piedra grande', unidad: 'm3', metrado: 32.00, precioUnitario: 245.00, parcial: 7840.00, especialidad: 'ESTRUCTURAS' },
  { item: '04.02.01', grupoItem: '04', partida: 'Sobrecimientos mezcla 1:8 + 25% piedra mediana', unidad: 'm3', metrado: 8.50, precioUnitario: 310.00, parcial: 2635.00, especialidad: 'ESTRUCTURAS' },
  { item: '04.03.01', grupoItem: '04', partida: 'Falso piso de concreto e=4" mezcla 1:8 acabado frotachado', unidad: 'm2', metrado: 95.00, precioUnitario: 41.50, parcial: 3942.50, especialidad: 'ESTRUCTURAS' },

  // 05 Concreto Armado
  { item: '05.01.01', grupoItem: '05', partida: 'Zapatas: Concreto f\'c=210 kg/cm2', unidad: 'm3', metrado: 14.00, precioUnitario: 395.00, parcial: 5530.00, especialidad: 'ESTRUCTURAS' },
  { item: '05.02.01', grupoItem: '05', partida: 'Columnas: Concreto f\'c=210 kg/cm2', unidad: 'm3', metrado: 16.00, precioUnitario: 445.00, parcial: 7120.00, especialidad: 'ESTRUCTURAS' },
  { item: '05.02.02', grupoItem: '05', partida: 'Columnas: Encofrado y desencofrado cara vista', unidad: 'm2', metrado: 88.00, precioUnitario: 62.00, parcial: 5456.00, especialidad: 'ESTRUCTURAS' },
  { item: '05.02.03', grupoItem: '05', partida: 'Columnas: Acero corrugado fy=4200 kg/cm2 Grado 60', unidad: 'kg', metrado: 1450.00, precioUnitario: 6.85, parcial: 9932.50, especialidad: 'ESTRUCTURAS' },
  { item: '05.03.01', grupoItem: '05', partida: 'Vigas: Concreto f\'c=210 kg/cm2', unidad: 'm3', metrado: 18.50, precioUnitario: 440.00, parcial: 8140.00, especialidad: 'ESTRUCTURAS' },
  { item: '05.04.01', grupoItem: '05', partida: 'Losa Aligerada: Concreto f\'c=210 kg/cm2 e=20cm', unidad: 'm3', metrado: 24.00, precioUnitario: 435.00, parcial: 10440.00, especialidad: 'ESTRUCTURAS' },

  // 06 Muros y Tabiques
  { item: '06.01.01', grupoItem: '06', partida: 'Muro de ladrillo King Kong 18 huecos de soga mortero 1:4 e=1.5cm', unidad: 'm2', metrado: 165.00, precioUnitario: 78.50, parcial: 12952.50, especialidad: 'ARQUITECTURA' },
  { item: '06.02.01', grupoItem: '06', partida: 'Muro de ladrillo pandereta de soga mortero 1:5', unidad: 'm2', metrado: 95.00, precioUnitario: 62.00, parcial: 5890.00, especialidad: 'ARQUITECTURA' },

  // 07 Revoques y Enlucidos
  { item: '07.01.01', grupoItem: '07', partida: 'Tarrajeo primario o rayado con mortero 1:5', unidad: 'm2', metrado: 85.00, precioUnitario: 26.50, parcial: 2252.50, especialidad: 'ARQUITECTURA' },
  { item: '07.02.01', grupoItem: '07', partida: 'Tarrajeo en muros interiores frotachado mezcla 1:5 e=1.5cm', unidad: 'm2', metrado: 280.00, precioUnitario: 37.80, parcial: 10584.00, especialidad: 'ARQUITECTURA' },
  { item: '07.03.01', grupoItem: '07', partida: 'Tarrajeo en columnas y vigas con mezcla 1:4', unidad: 'm2', metrado: 75.00, precioUnitario: 48.00, parcial: 3600.00, especialidad: 'ARQUITECTURA' },

  // 08 Cielo Raso
  { item: '08.01.01', grupoItem: '08', partida: 'Cielo raso con mezcla C:A 1:5 con cinta de empalme', unidad: 'm2', metrado: 145.00, precioUnitario: 42.50, parcial: 6162.50, especialidad: 'ARQUITECTURA' },
  { item: '08.02.01', grupoItem: '08', partida: 'Falso cielo raso drywall con plancha de yeso 1/2" suspendido', unidad: 'm2', metrado: 45.00, precioUnitario: 61.34, parcial: 2760.40, especialidad: 'ARQUITECTURA' },

  // 09 Pisos y Pavimentos
  { item: '09.01.01', grupoItem: '09', partida: 'Contrapiso de 48mm mezcla 1:5 acabado frotachado', unidad: 'm2', metrado: 160.00, precioUnitario: 36.50, parcial: 5840.00, especialidad: 'ARQUITECTURA' },
  { item: '09.02.01', grupoItem: '09', partida: 'Piso de porcelanato 60x60cm antideslizante pegamento blanco flexible', unidad: 'm2', metrado: 125.00, precioUnitario: 88.50, parcial: 11062.50, especialidad: 'ARQUITECTURA' },
  { item: '09.03.01', grupoItem: '09', partida: 'Piso cerámico 45x45cm nacional para baños y cocina', unidad: 'm2', metrado: 65.00, precioUnitario: 58.00, parcial: 3770.00, especialidad: 'ARQUITECTURA' },

  // 18 Pintura
  { item: '18.01.01', grupoItem: '18', partida: 'Pintura látex satinado 2 manos en muros interiores (incluye imprimante y lijado)', unidad: 'm2', metrado: 416.00, precioUnitario: 23.00, parcial: 9568.00, especialidad: 'ARQUITECTURA' },
  { item: '18.02.01', grupoItem: '18', partida: 'Pintura látex lavable en fachada exterior a 2 manos con andamios certificados', unidad: 'm2', metrado: 180.00, precioUnitario: 28.50, parcial: 5130.00, especialidad: 'ARQUITECTURA' },
  { item: '18.03.01', grupoItem: '18', partida: 'Pintura esmalte sintético anticorrosivo en carpintería metálica y rejas', unidad: 'm2', metrado: 65.00, precioUnitario: 34.00, parcial: 2210.00, especialidad: 'ARQUITECTURA' },
  { item: '18.04.01', grupoItem: '18', partida: 'Barniz poliuretano transparente en carpintería de madera (puertas y marcos)', unidad: 'm2', metrado: 55.00, precioUnitario: 42.00, parcial: 2310.00, especialidad: 'ARQUITECTURA' },

  // 20 Aparatos Sanitarios
  { item: '20.01.01', grupoItem: '20', partida: 'Inodoro One Piece blanco losa vitrificada con grifería ahorradora', unidad: 'und', metrado: 4.00, precioUnitario: 450.00, parcial: 1800.00, especialidad: 'SANITARIAS' },
  { item: '20.02.01', grupoItem: '20', partida: 'Lavatorio de sobreponer ovalín con grifería monocomando cromada', unidad: 'und', metrado: 4.00, precioUnitario: 320.00, parcial: 1280.00, especialidad: 'SANITARIAS' },
  { item: '20.03.01', grupoItem: '20', partida: 'Ducha cromada teléfono con mezcladora agua fría y caliente', unidad: 'und', metrado: 3.00, precioUnitario: 285.00, parcial: 855.00, especialidad: 'SANITARIAS' },

  // 24 Agua Potable
  { item: '24.01.01', grupoItem: '24', partida: 'Salida de agua fría con tubería PVC-SAP 1/2" empotrada', unidad: 'pto', metrado: 18.00, precioUnitario: 85.00, parcial: 1530.00, especialidad: 'SANITARIAS' },
  { item: '24.02.01', grupoItem: '24', partida: 'Red de distribución tubería PVC-SAP 3/4" clase 10', unidad: 'ml', metrado: 45.00, precioUnitario: 32.50, parcial: 1462.50, especialidad: 'SANITARIAS' },
  { item: '24.03.01', grupoItem: '24', partida: 'Válvula de compuerta de bronce 3/4" con unión universal en nicho', unidad: 'und', metrado: 4.00, precioUnitario: 145.00, parcial: 580.00, especialidad: 'SANITARIAS' },

  // 27 & 28 Eléctricas
  { item: '28.01.01', grupoItem: '28', partida: 'Salida para centro de luz en techo con tubería PVC-SAP y cable TW 2.5mm2', unidad: 'pto', metrado: 26.00, precioUnitario: 78.00, parcial: 2028.00, especialidad: 'ELECTRICAS' },
  { item: '28.02.01', grupoItem: '28', partida: 'Salida para tomacorriente doble con toma a tierra (empotradas en muro)', unidad: 'pto', metrado: 34.00, precioUnitario: 85.00, parcial: 2890.00, especialidad: 'ELECTRICAS' },
  { item: '28.03.01', grupoItem: '28', partida: 'Tablero de distribución metálico 12 polos con llaves termomagnéticas e interruptor diferencial', unidad: 'und', metrado: 2.00, precioUnitario: 650.00, parcial: 1300.00, especialidad: 'ELECTRICAS' },
  { item: '28.04.01', grupoItem: '28', partida: 'Pozo de puesta a tierra con electrodo de cobre y sales electrolíticas gel', unidad: 'und', metrado: 1.00, precioUnitario: 1450.00, parcial: 1450.00, especialidad: 'ELECTRICAS' },
];

export const INSUMOS_PRECIOS: InsumoPrecio[] = [
  // Materiales Básicos
  { codigo: 'MAT-001', tipo: 'MATERIAL', descripcion: 'Cemento Portland Tipo I (bolsa 42.5 kg)', unidad: 'bolsa', precioSinIgv: 24.58, precioConIgv: 29.00, proveedor: 'UNACEM / Sol', marca: 'Cemento Sol', grupo: 'Cementos y Conglomerantes' },
  { codigo: 'MAT-002', tipo: 'MATERIAL', descripcion: 'Arena gruesa para concreto', unidad: 'm3', precioSinIgv: 55.08, precioConIgv: 65.00, proveedor: 'Cantera Jicamarca', grupo: 'Agregados' },
  { codigo: 'MAT-003', tipo: 'MATERIAL', descripcion: 'Piedra chancada 1/2"', unidad: 'm3', precioSinIgv: 63.56, precioConIgv: 75.00, proveedor: 'Cantera Huachipa', grupo: 'Agregados' },
  { codigo: 'MAT-004', tipo: 'MATERIAL', descripcion: 'Arena fina para tarrajeo', unidad: 'm3', precioSinIgv: 59.32, precioConIgv: 70.00, proveedor: 'Cantera Jicamarca', grupo: 'Agregados' },
  { codigo: 'MAT-005', tipo: 'MATERIAL', descripcion: 'Fierro corrugado 1/2" Grado 60 ASTM A615 (varilla 9m)', unidad: 'varilla', precioSinIgv: 38.98, precioConIgv: 46.00, proveedor: 'Aceros Arequipa', marca: 'Aceros Arequipa', grupo: 'Aceros y Fierros' },
  { codigo: 'MAT-006', tipo: 'MATERIAL', descripcion: 'Fierro corrugado 3/8" Grado 60 (varilla 9m)', unidad: 'varilla', precioSinIgv: 22.03, precioConIgv: 26.00, proveedor: 'Aceros Arequipa', marca: 'Aceros Arequipa', grupo: 'Aceros y Fierros' },
  { codigo: 'MAT-007', tipo: 'MATERIAL', descripcion: 'Alambre negro recocido N° 16 para amarre', unidad: 'kg', precioSinIgv: 5.93, precioConIgv: 7.00, proveedor: 'Prodac', grupo: 'Aceros y Alambres' },
  { codigo: 'MAT-008', tipo: 'MATERIAL', descripcion: 'Ladrillo King Kong 18 Huecos (24x13x9 cm)', unidad: 'millar', precioSinIgv: 805.08, precioConIgv: 950.00, proveedor: 'Ladrillera Lark', marca: 'Lark', grupo: 'Ladrillos y Bloques' },
  { codigo: 'MAT-009', tipo: 'MATERIAL', descripcion: 'Ladrillo de Techo Hueco 15 (30x30x15 cm)', unidad: 'millar', precioSinIgv: 2118.64, precioConIgv: 2500.00, proveedor: 'Ladrillera Rex', marca: 'Rex', grupo: 'Ladrillos y Bloques' },

  // Pinturas y Acabados
  { codigo: 'MAT-010', tipo: 'MATERIAL', descripcion: 'Pintura Látex Satinado Vencedor Supermate (Balde 5 gal)', unidad: 'balde', precioSinIgv: 186.44, precioConIgv: 220.00, proveedor: 'Qroma / Maestro', marca: 'Vencedor', grupo: 'Pinturas y Selladores' },
  { codigo: 'MAT-011', tipo: 'MATERIAL', descripcion: 'Pintura Látex Lavable CPP Pato (Balde 5 gal)', unidad: 'balde', precioSinIgv: 152.54, precioConIgv: 180.00, proveedor: 'CPP Qroma', marca: 'CPP', grupo: 'Pinturas y Selladores' },
  { codigo: 'MAT-012', tipo: 'MATERIAL', descripcion: 'Imprimante blanco para muros (bolsa 25 kg)', unidad: 'bolsa', precioSinIgv: 29.66, precioConIgv: 35.00, proveedor: 'Tekno', marca: 'Tekno', grupo: 'Pinturas y Selladores' },
  { codigo: 'MAT-013', tipo: 'MATERIAL', descripcion: 'Esmalte Sintético Anticorrosivo Tekno Gloss (Galón)', unidad: 'galon', precioSinIgv: 55.08, precioConIgv: 65.00, proveedor: 'Tekno', marca: 'Tekno', grupo: 'Pinturas y Selladores' },
  { codigo: 'MAT-014', tipo: 'MATERIAL', descripcion: 'Thinner acrílico estándar', unidad: 'galon', precioSinIgv: 21.19, precioConIgv: 25.00, proveedor: 'Solventes Perú', grupo: 'Pinturas y Selladores' },
  { codigo: 'MAT-015', tipo: 'MATERIAL', descripcion: 'Lija de agua / fierro #80, #120, #180', unidad: 'pliego', precioSinIgv: 2.12, precioConIgv: 2.50, proveedor: 'Norton', grupo: 'Abrasivos' },
  { codigo: 'MAT-016', tipo: 'MATERIAL', descripcion: 'Pegamento Blanco Flexible para Porcelanato (Bolsa 25 kg)', unidad: 'bolsa', precioSinIgv: 38.14, precioConIgv: 45.00, proveedor: 'Chema / Weber', marca: 'Chema Pegamix', grupo: 'Adhesivos y Fragüas' },
  { codigo: 'MAT-017', tipo: 'MATERIAL', descripcion: 'Fragüa antibacterial con polímeros (bolsa 1 kg)', unidad: 'kg', precioSinIgv: 5.93, precioConIgv: 7.00, proveedor: 'Celima', marca: 'Celima', grupo: 'Adhesivos y Fragüas' },

  // Sanitarias & Eléctricas
  { codigo: 'MAT-018', tipo: 'MATERIAL', descripcion: 'Tubo PVC-SAP 1/2" Clase 10 para agua fría (tubo 5m)', unidad: 'tubo', precioSinIgv: 14.41, precioConIgv: 17.00, proveedor: 'Pavco Wavin', marca: 'Pavco', grupo: 'Tuberías y Conexiones' },
  { codigo: 'MAT-019', tipo: 'MATERIAL', descripcion: 'Tubo PVC-CPVC 1/2" para agua caliente (tubo 5m)', unidad: 'tubo', precioSinIgv: 27.12, precioConIgv: 32.00, proveedor: 'Pavco Wavin', marca: 'Pavco', grupo: 'Tuberías y Conexiones' },
  { codigo: 'MAT-020', tipo: 'MATERIAL', descripcion: 'Tubo PVC-SAL 2" para desagüe (tubo 3m)', unidad: 'tubo', precioSinIgv: 18.64, precioConIgv: 22.00, proveedor: 'Tuboplast', marca: 'Tuboplast', grupo: 'Tuberías y Conexiones' },
  { codigo: 'MAT-021', tipo: 'MATERIAL', descripcion: 'Cable eléctrico libre de halógeno NH-80 2.5 mm2 (rollo 100m)', unidad: 'rollo', precioSinIgv: 194.92, precioConIgv: 230.00, proveedor: 'Indeco / Centelsa', marca: 'Indeco', grupo: 'Conductores Eléctricos' },
  { codigo: 'MAT-022', tipo: 'MATERIAL', descripcion: 'Interruptor termomagnético 2x20A Bticino riel DIN', unidad: 'und', precioSinIgv: 35.59, precioConIgv: 42.00, proveedor: 'Bticino', marca: 'Bticino', grupo: 'Aparatos Eléctricos' },

  // Mano de Obra (CAPECO / Régimen Construcción Civil Perú)
  { codigo: 'MO-001', tipo: 'MANO_DE_OBRA', descripcion: 'Operario de Construcción Civil / Acabados', unidad: 'hh', precioSinIgv: 26.45, precioConIgv: 26.45, grupo: 'Mano de Obra Calificada' },
  { codigo: 'MO-002', tipo: 'MANO_DE_OBRA', descripcion: 'Oficial de Construcción Civil', unidad: 'hh', precioSinIgv: 20.80, precioConIgv: 20.80, grupo: 'Mano de Obra Semicalificada' },
  { codigo: 'MO-003', tipo: 'MANO_DE_OBRA', descripcion: 'Peón de Construcción Civil', unidad: 'hh', precioSinIgv: 18.70, precioConIgv: 18.70, grupo: 'Mano de Obra No Calificada' },
  { codigo: 'MO-004', tipo: 'MANO_DE_OBRA', descripcion: 'Capataz de Cuadrilla', unidad: 'hh', precioSinIgv: 31.50, precioConIgv: 31.50, grupo: 'Supervisión de Cuadrilla' },
  { codigo: 'MO-005', tipo: 'MANO_DE_OBRA', descripcion: 'Pintor Especialista en Acabados y Fachadas', unidad: 'hh', precioSinIgv: 27.50, precioConIgv: 27.50, grupo: 'Mano de Obra Calificada' },
  { codigo: 'MO-006', tipo: 'MANO_DE_OBRA', descripcion: 'Electricista Calificado', unidad: 'hh', precioSinIgv: 28.00, precioConIgv: 28.00, grupo: 'Mano de Obra Calificada' },

  // Equipos y Maquinarias
  { codigo: 'EQ-001', tipo: 'EQUIPO', descripcion: 'Mezcladora de concreto tipo trompo 9-11 p3 con motor a gasolina 8HP', unidad: 'hm', precioSinIgv: 22.00, precioConIgv: 25.96, grupo: 'Equipos Menores' },
  { codigo: 'EQ-002', tipo: 'EQUIPO', descripcion: 'Vibrador de concreto 4HP cabezal 1.5"', unidad: 'hm', precioSinIgv: 14.50, precioConIgv: 17.11, grupo: 'Equipos Menores' },
  { codigo: 'EQ-003', tipo: 'EQUIPO', descripcion: 'Andamio metálico tubular normado (cuerpo con plataforma y baranda)', unidad: 'dia', precioSinIgv: 18.00, precioConIgv: 21.24, grupo: 'Andamiaje y Seguridad' },
  { codigo: 'EQ-004', tipo: 'EQUIPO', descripcion: 'Rotomartillo demoledor 11 kg SDS-Max', unidad: 'dia', precioSinIgv: 45.00, precioConIgv: 53.10, grupo: 'Herramientas Eléctricas' },
  { codigo: 'EQ-005', tipo: 'EQUIPO', descripcion: 'Compresora de pintura neumática airless 2.5 HP', unidad: 'dia', precioSinIgv: 65.00, precioConIgv: 76.70, grupo: 'Equipos de Pintura' },
  { codigo: 'EQ-006', tipo: 'EQUIPO', descripcion: 'Herramientas manuales (3% de Mano de Obra)', unidad: '%MO', precioSinIgv: 3.00, precioConIgv: 3.00, grupo: 'Herramientas Manuales' },
];

export const APU_CATALOGO: APUItem[] = [
  {
    codigo: 'APU-PIN-01',
    descripcion: 'PINTURA LÁTEX SATINADO EN MUROS INTERIORES (2 MANOS + IMPRIMANTE)',
    unidad: 'm2',
    rendimiento: '35 m2/día',
    especialidad: 'ARQUITECTURA',
    costoUnitarioTotal: 23.00,
    manoDeObra: [
      { recurso: 'Operario Pintor', cuadrilla: 1.0, unidad: 'hh', cantidad: 0.2286, precio: 27.50, parcial: 6.29 },
      { recurso: 'Peón de apoyo', cuadrilla: 0.5, unidad: 'hh', cantidad: 0.1143, precio: 18.70, parcial: 2.14 },
    ],
    materiales: [
      { recurso: 'Pintura Látex Satinado Vencedor', unidad: 'galon', cantidad: 0.08, precio: 44.00, parcial: 3.52 },
      { recurso: 'Imprimante sellador al agua', unidad: 'bolsa', cantidad: 0.04, precio: 35.00, parcial: 1.40 },
      { recurso: 'Lija de agua #150 y #180', unidad: 'pliego', cantidad: 0.20, precio: 2.50, parcial: 0.50 },
      { recurso: 'Cinta masking tape 1" x 40yd', unidad: 'rollo', cantidad: 0.05, precio: 6.50, parcial: 0.33 },
    ],
    equipos: [
      { recurso: 'Andamio metálico normado', cuadrilla: 1.0, unidad: 'hm', cantidad: 0.2286, precio: 2.25, parcial: 0.51 },
      { recurso: 'Herramientas manuales', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.03, precio: 8.43, parcial: 0.25 },
    ],
  },
  {
    codigo: 'APU-TAR-01',
    descripcion: 'TARRAJEO EN MUROS INTERIORES CON MORTERO 1:5 e=1.5 cm',
    unidad: 'm2',
    rendimiento: '20 m2/día',
    especialidad: 'ARQUITECTURA',
    costoUnitarioTotal: 37.80,
    manoDeObra: [
      { recurso: 'Operario Albañil', cuadrilla: 1.0, unidad: 'hh', cantidad: 0.40, precio: 26.45, parcial: 10.58 },
      { recurso: 'Peón de batido', cuadrilla: 0.5, unidad: 'hh', cantidad: 0.20, precio: 18.70, parcial: 3.74 },
    ],
    materiales: [
      { recurso: 'Cemento Portland Tipo I', unidad: 'bolsa', cantidad: 0.118, precio: 29.00, parcial: 3.42 },
      { recurso: 'Arena fina seleccionada', unidad: 'm3', cantidad: 0.022, precio: 70.00, parcial: 1.54 },
      { recurso: 'Reglas de aluminio 2"x1"x3m', unidad: 'und', cantidad: 0.02, precio: 35.00, parcial: 0.70 },
    ],
    equipos: [
      { recurso: 'Andamio metálico', cuadrilla: 1.0, unidad: 'hm', cantidad: 0.40, precio: 2.25, parcial: 0.90 },
      { recurso: 'Herramientas manuales (3% MO)', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.03, precio: 14.32, parcial: 0.43 },
    ],
  },
  {
    codigo: 'APU-PIS-01',
    descripcion: 'PISO DE PORCELANATO 60x60 cm ALTO TRÁNSITO CON PEGAMENTO BLANCO FLEXIBLE',
    unidad: 'm2',
    rendimiento: '14 m2/día',
    especialidad: 'ARQUITECTURA',
    costoUnitarioTotal: 88.50,
    manoDeObra: [
      { recurso: 'Operario Enchapador', cuadrilla: 1.0, unidad: 'hh', cantidad: 0.5714, precio: 28.00, parcial: 16.00 },
      { recurso: 'Peón ayudante', cuadrilla: 0.5, unidad: 'hh', cantidad: 0.2857, precio: 18.70, parcial: 5.34 },
    ],
    materiales: [
      { recurso: 'Porcelanato 60x60 cm rectificado', unidad: 'm2', cantidad: 1.05, precio: 48.00, parcial: 50.40 },
      { recurso: 'Pegamento Blanco Flexible Chema', unidad: 'bolsa', cantidad: 0.25, precio: 45.00, parcial: 11.25 },
      { recurso: 'Fragüa con polímeros impermeable', unidad: 'kg', cantidad: 0.35, precio: 7.00, parcial: 2.45 },
      { recurso: 'Crucetas niveladoras de 2mm', unidad: 'pza', cantidad: 6.00, precio: 0.20, parcial: 1.20 },
    ],
    equipos: [
      { recurso: 'Cortadora manual de porcelanato 90cm', cuadrilla: 1.0, unidad: 'hm', cantidad: 0.5714, precio: 1.50, parcial: 0.86 },
      { recurso: 'Herramientas manuales', cuadrilla: 1.0, unidad: '%MO', cantidad: 0.03, precio: 21.34, parcial: 0.64 },
    ],
  },
];
