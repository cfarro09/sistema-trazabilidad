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
  { item: '17', grupo: 'Vidrios, cristales y similares', parcialSoles: 7765.76, valorM2Soles: 38.83, valorM2Dolares: 10.54 },
  { item: '18', grupo: 'Pintura', parcialSoles: 27758.05, valorM2Soles: 138.79, valorM2Dolares: 37.68 },
  { item: '19', grupo: 'Varios, Limpieza, Jardinería', parcialSoles: 4589.79, valorM2Soles: 22.95, valorM2Dolares: 6.23 },
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
  { item: '30', grupo: 'Cajas de Acero Galvanizado', parcialSoles: 4300.82, valorM2Soles: 21.50, valorM2Dolares: 5.84 },
  { item: '31', grupo: 'Cables y Conductores', parcialSoles: 6429.61, valorM2Soles: 32.15, valorM2Dolares: 8.73 },
  { item: '32', grupo: 'Interruptores', parcialSoles: 1589.48, valorM2Soles: 7.95, valorM2Dolares: 2.16 },
  { item: '33', grupo: 'Tomacorrientes', parcialSoles: 5987.30, valorM2Soles: 29.94, valorM2Dolares: 8.13 },
  { item: '34', grupo: 'Equipamiento', parcialSoles: 2328.40, valorM2Soles: 11.64, valorM2Dolares: 3.16 },
  { item: '35', grupo: 'Otros', parcialSoles: 1502.31, valorM2Soles: 7.51, valorM2Dolares: 2.04 },
];

// 2. PRESUPUESTO DESGLOSADO COMPLETO (PÁGINAS 1.2 Y 1.3)
export const PARTIDAS_PRESUPUESTO: PartidaPresupuesto[] = [
  // 01 Obras Provisionales
  { item: '01.01.01', grupoItem: '01', partida: 'CONSTRUCCION DE ALMACEN, OFICINAS, CASETA DE GUARDIANIA', unidad: 'm2', metrado: 15.00, precioUnitario: 101.48, parcial: 1522.20, especialidad: 'OE' },
  { item: '01.01.02', grupoItem: '01', partida: 'CISTERNA PROVISIONAL P/AGUA CONSTRUC. DE ALBANILERIA (4 m3)', unidad: 'pza', metrado: 1.00, precioUnitario: 938.28, parcial: 938.28, especialidad: 'OE' },
  { item: '01.02.01', grupoItem: '01', partida: 'AGUA PARA LA CONSTRUCCION', unidad: 'mes', metrado: 4.00, precioUnitario: 2840.57, parcial: 11362.28, especialidad: 'OE' },

  // 02 Trabajos Preliminares
  { item: '02.01', grupoItem: '02', partida: 'LIMPIEZA MANUAL DE TERRENO', unidad: 'm2', metrado: 200.00, precioUnitario: 4.84, parcial: 968.00, especialidad: 'OE' },
  { item: '02.02', grupoItem: '02', partida: 'TRAZO, NIVELES Y REPLANTEO PRELIMINAR', unidad: 'm2', metrado: 200.00, precioUnitario: 3.79, parcial: 758.00, especialidad: 'OE' },
  { item: '02.03', grupoItem: '02', partida: 'TRAZO, NIVELES Y REPLANTEO DURANTE EL PROCESO', unidad: 'm2', metrado: 200.00, precioUnitario: 3.79, parcial: 758.00, especialidad: 'OE' },

  // 03 Movimiento de Tierras
  { item: '03.01', grupoItem: '03', partida: 'REFINE, NIVEL Y COMPACT./TERRENO NORMAL C/EQUIPO', unidad: 'm2', metrado: 200.00, precioUnitario: 6.22, parcial: 1244.00, especialidad: 'ESTRUCTURAS' },
  { item: '03.02', grupoItem: '03', partida: 'EXCAV.MEC.MAT.SUELTOC/RETROEXC.S/LLANTAS CAPAC.1 yd3 58hp', unidad: 'm3', metrado: 10.21, precioUnitario: 11.07, parcial: 113.02, especialidad: 'ESTRUCTURAS' },
  { item: '03.03', grupoItem: '03', partida: 'EXCAV.ZANJAS P/CIMIENTOS MAT.SUEL. H=1.00m', unidad: 'm3', metrado: 35.92, precioUnitario: 49.61, parcial: 1781.99, especialidad: 'ESTRUCTURAS' },
  { item: '03.04', grupoItem: '03', partida: 'RELLENO MAT.PROPIO C/COMPACTADORA 5.8hp C/AGUA', unidad: 'm3', metrado: 7.60, precioUnitario: 64.67, parcial: 491.49, especialidad: 'ESTRUCTURAS' },
  { item: '03.05', grupoItem: '03', partida: 'ELIM.MAT.CARG.MANUAL C/VOLQUETE 6m3 V=30 D=05 Km', unidad: 'm3', metrado: 48.16, precioUnitario: 81.51, parcial: 3925.52, especialidad: 'ESTRUCTURAS' },

  // 04 Concreto Simple
  { item: '04.01', grupoItem: '04', partida: 'CONCRETO CICLOPEO 1:8(C:H)+30% P.G.CIMIENTOS CORRIDOS', unidad: 'm3', metrado: 17.90, precioUnitario: 250.69, parcial: 4487.35, especialidad: 'ESTRUCTURAS' },
  { item: '04.02', grupoItem: '04', partida: 'CONCRETO C:H 1:12 E=4" PARA SOLADOS', unidad: 'm2', metrado: 4.32, precioUnitario: 45.67, parcial: 197.29, especialidad: 'ESTRUCTURAS' },
  { item: '04.03', grupoItem: '04', partida: 'CONCRETO 1:8 (C:H) + 25% P.M.-SOBRECIMIENTOS', unidad: 'm3', metrado: 3.93, precioUnitario: 346.60, parcial: 1362.14, especialidad: 'ESTRUCTURAS' },
  { item: '04.04', grupoItem: '04', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL PARA SOBRECIMIENTOS', unidad: 'm2', metrado: 45.12, precioUnitario: 49.17, parcial: 2218.55, especialidad: 'ESTRUCTURAS' },
  { item: '04.05', grupoItem: '04', partida: 'FALSOPISO DE 4" CON MEZC.1:8 C:H', unidad: 'm2', metrado: 83.90, precioUnitario: 41.40, parcial: 3473.46, especialidad: 'ESTRUCTURAS' },

  // 05 Concreto Armado
  { item: '05.01.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 ZAPATA', unidad: 'm3', metrado: 2.60, precioUnitario: 391.64, parcial: 1018.26, especialidad: 'ESTRUCTURAS' },
  { item: '05.01.02', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 31.11, precioUnitario: 5.89, parcial: 183.24, especialidad: 'ESTRUCTURAS' },
  { item: '05.02.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 TABIQUE Y PLACA', unidad: 'm3', metrado: 7.88, precioUnitario: 722.92, parcial: 5696.61, especialidad: 'ESTRUCTURAS' },
  { item: '05.02.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL TABIQUE Y PLACA', unidad: 'm2', metrado: 90.18, precioUnitario: 72.03, parcial: 6495.67, especialidad: 'ESTRUCTURAS' },
  { item: '05.02.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 450.06, precioUnitario: 5.89, parcial: 2650.85, especialidad: 'ESTRUCTURAS' },
  { item: '05.03.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 COLUMNA', unidad: 'm3', metrado: 8.29, precioUnitario: 633.48, parcial: 5251.55, especialidad: 'ESTRUCTURAS' },
  { item: '05.03.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL COLUMNA', unidad: 'm2', metrado: 109.13, precioUnitario: 72.95, parcial: 7961.03, especialidad: 'ESTRUCTURAS' },
  { item: '05.03.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 783.78, precioUnitario: 5.89, parcial: 4616.46, especialidad: 'ESTRUCTURAS' },
  { item: '05.04.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 VIGA', unidad: 'm3', metrado: 7.16, precioUnitario: 454.61, parcial: 3255.01, especialidad: 'ESTRUCTURAS' },
  { item: '05.04.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL VIGAS RECTAS', unidad: 'm2', metrado: 35.90, precioUnitario: 81.70, parcial: 2933.03, especialidad: 'ESTRUCTURAS' },
  { item: '05.04.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 759.10, precioUnitario: 5.89, parcial: 4471.10, especialidad: 'ESTRUCTURAS' },
  { item: '05.05.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 LOSA ALIGERADA', unidad: 'm3', metrado: 13.04, precioUnitario: 418.81, parcial: 5461.28, especialidad: 'ESTRUCTURAS' },
  { item: '05.05.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL LOSA ALIGERADA', unidad: 'm2', metrado: 148.90, precioUnitario: 51.72, parcial: 7701.11, especialidad: 'ESTRUCTURAS' },
  { item: '05.05.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 473.14, precioUnitario: 5.89, parcial: 2786.79, especialidad: 'ESTRUCTURAS' },
  { item: '05.05.04', grupoItem: '05', partida: 'LADRILLO ARCILLA PARA TECHO 15X30X30 CM', unidad: 'pza', metrado: 1365.00, precioUnitario: 2.63, parcial: 3589.95, especialidad: 'ESTRUCTURAS' },
  { item: '05.06.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 ESCALERA', unidad: 'm3', metrado: 3.65, precioUnitario: 652.24, parcial: 2380.68, especialidad: 'ESTRUCTURAS' },
  { item: '05.06.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL ESCALERA', unidad: 'm2', metrado: 14.70, precioUnitario: 110.43, parcial: 1623.32, especialidad: 'ESTRUCTURAS' },
  { item: '05.06.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 196.12, precioUnitario: 5.89, parcial: 1155.15, especialidad: 'ESTRUCTURAS' },
  { item: '05.07.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 CISTERNA', unidad: 'm3', metrado: 3.91, precioUnitario: 652.24, parcial: 2550.26, especialidad: 'ESTRUCTURAS' },
  { item: '05.07.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL CISTERNA', unidad: 'm2', metrado: 17.34, precioUnitario: 59.16, parcial: 1025.83, especialidad: 'ESTRUCTURAS' },
  { item: '05.07.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 74.34, precioUnitario: 5.89, parcial: 437.86, especialidad: 'ESTRUCTURAS' },
  { item: '05.08.01', grupoItem: '05', partida: 'CONCRETO F\'C 175 KG/CM2 TANQUE ELEVADO', unidad: 'm3', metrado: 0.55, precioUnitario: 652.24, parcial: 358.73, especialidad: 'ESTRUCTURAS' },
  { item: '05.08.02', grupoItem: '05', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL TANQUE ELEVADO', unidad: 'm2', metrado: 2.60, precioUnitario: 63.77, parcial: 165.80, especialidad: 'ESTRUCTURAS' },
  { item: '05.08.03', grupoItem: '05', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'kg', metrado: 19.01, precioUnitario: 5.89, parcial: 111.97, especialidad: 'ESTRUCTURAS' },

  // 06 Muros y Tabiques
  { item: '06.01', grupoItem: '06', partida: 'MURO LADR.K.K. MEZC.C:A 1:4, TIPO IV, P.TARRAJ. DE SOGA', unidad: 'm2', metrado: 342.45, precioUnitario: 71.94, parcial: 24635.85, especialidad: 'ARQUITECTURA' },
  { item: '06.02', grupoItem: '06', partida: 'MURO LADR.K.K. MEZC.C:A 1:4, TIPO IV, P.TARRAJ. DE CABEZA', unidad: 'm2', metrado: 7.22, precioUnitario: 118.34, parcial: 854.41, especialidad: 'ARQUITECTURA' },

  // 07 Revoques y Enlucidos
  { item: '07.01', grupoItem: '07', partida: 'TARRAJEO PRIMARIO Y RAYADO C/MEZCLA 1:5 E=1.5CM', unidad: 'm2', metrado: 30.31, precioUnitario: 29.00, parcial: 878.99, especialidad: 'ARQUITECTURA' },
  { item: '07.02', grupoItem: '07', partida: 'TARRAJEO MUROS INT.FROTACHADO MEZ.C:A 1:5,E=1.5 CM.', unidad: 'm2', metrado: 420.99, precioUnitario: 26.56, parcial: 11181.49, especialidad: 'ARQUITECTURA' },
  { item: '07.03', grupoItem: '07', partida: 'TARRAJEO MUROS EXT.FROTACHADO MEZ.C:A 1:5,E=1.5 CM.', unidad: 'm2', metrado: 82.71, precioUnitario: 35.60, parcial: 2944.48, especialidad: 'ARQUITECTURA' },
  { item: '07.04', grupoItem: '07', partida: 'VESTIDURA DERRAMES ANCHO=0.15 M MEZC.C:A 1:5 E=1.5CM.', unidad: 'm', metrado: 87.05, precioUnitario: 23.14, parcial: 2014.34, especialidad: 'ARQUITECTURA' },
  { item: '07.05', grupoItem: '07', partida: 'VESTIDURA DE DERRAMES ANCHO=0.125 MEZC.C:A 1:5 E=1.5CM', unidad: 'm', metrado: 4.35, precioUnitario: 20.68, parcial: 89.96, especialidad: 'ARQUITECTURA' },

  // 08 Cielo Raso
  { item: '08.01', grupoItem: '08', partida: 'CIELORASO CON MEZCLA C:A 1:4 E=0.15 M', unidad: 'm2', metrado: 164.40, precioUnitario: 47.13, parcial: 7748.17, especialidad: 'ARQUITECTURA' },
  { item: '08.02', grupoItem: '08', partida: 'TARRAJEO FONDO DE ESCALERA', unidad: 'm2', metrado: 20.70, precioUnitario: 56.75, parcial: 1174.73, especialidad: 'ARQUITECTURA' },

  // 09 Pisos y Pavimentos
  { item: '09.01', grupoItem: '09', partida: 'CONTRAPISO E=48 mm BASE 3.8 cm MEZC.1:5, ACAB. 1 cm PASTA 1:2', unidad: 'm2', metrado: 200.53, precioUnitario: 44.30, parcial: 8883.48, especialidad: 'ARQUITECTURA' },
  { item: '09.02', grupoItem: '09', partida: 'PISO DE CERAMICA COLOR 30X30', unidad: 'm2', metrado: 36.21, precioUnitario: 85.50, parcial: 3095.96, especialidad: 'ARQUITECTURA' },
  { item: '09.03', grupoItem: '09', partida: 'PISO DE CEMENTO PULIDO BRUÑADO 2" MEZCLA 1:4, PASTA 1:2', unidad: 'm2', metrado: 61.16, precioUnitario: 63.80, parcial: 3902.01, especialidad: 'ARQUITECTURA' },
  { item: '09.04', grupoItem: '09', partida: 'PISO DE PARQUET CORICASPI OSCURO', unidad: 'm2', metrado: 103.16, precioUnitario: 81.69, parcial: 8427.14, especialidad: 'ARQUITECTURA' },

  // 10 Contrazócalos
  { item: '10.01', grupoItem: '10', partida: 'CONTRAZOCALO DE CERAMICA 0.10X0.30 M', unidad: 'm', metrado: 15.50, precioUnitario: 11.27, parcial: 174.69, especialidad: 'ARQUITECTURA' },
  { item: '10.02', grupoItem: '10', partida: 'CONTRAZOCALO DE CERAMICA 0.10X0.30 M PARA ESCALERA', unidad: 'm', metrado: 1.30, precioUnitario: 11.27, parcial: 14.65, especialidad: 'ARQUITECTURA' },
  { item: '10.03', grupoItem: '10', partida: 'CONTRAZOCALO DE MADERA CEDRO 3/4" X 3", RODON 3/4"', unidad: 'm', metrado: 97.70, precioUnitario: 20.81, parcial: 2033.14, especialidad: 'ARQUITECTURA' },

  // 11 Zócalos
  { item: '11.01', grupoItem: '11', partida: 'ZOCALO CERAMICA 30X30 CM 1RA.', unidad: 'm2', metrado: 30.30, precioUnitario: 101.31, parcial: 3069.69, especialidad: 'ARQUITECTURA' },

  // 12 Revestimientos de Gradas y Escaleras
  { item: '12.01', grupoItem: '12', partida: 'REVESTIM. GRADAS Y ESCALERAS DE MADERA CEDRO 1"', unidad: 'm2', metrado: 13.48, precioUnitario: 110.84, parcial: 1494.12, especialidad: 'ARQUITECTURA' },
  { item: '12.02', grupoItem: '12', partida: 'REVESTIM.GRADAS Y ESCALERAS DE CERAMICO', unidad: 'm2', metrado: 1.85, precioUnitario: 101.66, parcial: 188.07, especialidad: 'ARQUITECTURA' },

  // 13 Cubiertas
  { item: '13.01', grupoItem: '13', partida: 'CUBIERTA LADRILLO PASTELERO 25X25 ASENT. C/MEZ. 1:5; JUNTA 1:5 E=1.5 CM', unidad: 'm2', metrado: 32.00, precioUnitario: 66.57, parcial: 2130.24, especialidad: 'ARQUITECTURA' },

  // 14 Carpintería de Madera
  { item: '14.01', grupoItem: '14', partida: 'PUERTA PRINCIPAL MACHIHEMBRADA', unidad: 'm2', metrado: 5.50, precioUnitario: 898.11, parcial: 4939.61, especialidad: 'ARQUITECTURA' },
  { item: '14.02', grupoItem: '14', partida: 'PUERTAS INTERIORES CONTRAPLACADAS 45 MM', unidad: 'm2', metrado: 35.70, precioUnitario: 297.79, parcial: 10631.10, especialidad: 'ARQUITECTURA' },
  { item: '14.03', grupoItem: '14', partida: 'PUERTAS CONTRAPLACADAS DE CLOSETS', unidad: 'm2', metrado: 14.85, precioUnitario: 251.62, parcial: 3736.56, especialidad: 'ARQUITECTURA' },
  { item: '14.04', grupoItem: '14', partida: 'PUERTAS DE PORTON DE GARAGE', unidad: 'm2', metrado: 7.50, precioUnitario: 363.90, parcial: 2729.25, especialidad: 'ARQUITECTURA' },
  { item: '14.05', grupoItem: '14', partida: 'BARANDAS DE MADERA CEDRO', unidad: 'm', metrado: 9.30, precioUnitario: 142.72, parcial: 1327.30, especialidad: 'ARQUITECTURA' },
  { item: '14.06', grupoItem: '14', partida: 'REPOSTEROS BAJOS', unidad: 'm', metrado: 3.75, precioUnitario: 1396.30, parcial: 5236.13, especialidad: 'ARQUITECTURA' },
  { item: '14.07', grupoItem: '14', partida: 'REPOSTEROS ALTOS', unidad: 'm', metrado: 2.20, precioUnitario: 1047.23, parcial: 2303.91, especialidad: 'ARQUITECTURA' },

  // 15 Carpintería Metálica
  { item: '15.01', grupoItem: '15', partida: 'REJA METALICA EXTERIOR INCLUYE PINTURA', unidad: 'pza', metrado: 1.00, precioUnitario: 2500.00, parcial: 2500.00, especialidad: 'ARQUITECTURA' },

  // 16 Cerrajería
  { item: '16.01', grupoItem: '16', partida: 'CERRADURA P/PUERTA PRINCIPAL CROMO MATE GR 2', unidad: 'pza', metrado: 1.00, precioUnitario: 230.67, parcial: 230.67, especialidad: 'ARQUITECTURA' },
  { item: '16.02', grupoItem: '16', partida: 'CERRADURA PARA PUERTA INTERIOR DORMITORIO CROMO MATE', unidad: 'pza', metrado: 12.00, precioUnitario: 104.40, parcial: 1252.80, especialidad: 'ARQUITECTURA' },
  { item: '16.03', grupoItem: '16', partida: 'CERRADURA PARA PUERTA INTERIOR BAÑO CROMO MATE', unidad: 'pza', metrado: 4.00, precioUnitario: 101.01, parcial: 404.04, especialidad: 'ARQUITECTURA' },
  { item: '16.04', grupoItem: '16', partida: 'CERRADURAS PARA MAMPARAS DE ALUMINIO', unidad: 'pza', metrado: 1.00, precioUnitario: 107.79, parcial: 107.79, especialidad: 'ARQUITECTURA' },
  { item: '16.05', grupoItem: '16', partida: 'CHAPAS DE CLOSETS', unidad: 'pza', metrado: 3.00, precioUnitario: 106.94, parcial: 320.82, especialidad: 'ARQUITECTURA' },
  { item: '16.06', grupoItem: '16', partida: 'BISAGRAS DE COCINA VAIVEN DOBLE EFECTO ALUMINIZADA', unidad: 'par', metrado: 3.00, precioUnitario: 171.43, parcial: 514.29, especialidad: 'ARQUITECTURA' },
  { item: '16.07', grupoItem: '16', partida: 'SISTEMA PUERTA LEVADIZA CON CONTROL REMOTO INC. EQUIPO E INSTALACION', unidad: 'pza', metrado: 1.00, precioUnitario: 1391.00, parcial: 1391.00, especialidad: 'ARQUITECTURA' },
  { item: '16.08', grupoItem: '16', partida: 'BISAGRAS CAPUCHINAS ALUMINIZADAS 3 1/2"', unidad: 'pza', metrado: 48.00, precioUnitario: 16.80, parcial: 806.40, especialidad: 'ARQUITECTURA' },
  { item: '16.09', grupoItem: '16', partida: 'CERRADURA CON RECIBIDOR ELECTRICO', unidad: 'pza', metrado: 1.00, precioUnitario: 219.02, parcial: 219.02, especialidad: 'ARQUITECTURA' },

  // 17 Vidrios y Cristales
  { item: '17.01', grupoItem: '17', partida: 'VIDRIO TEMPLADO INCOLORO 6MM', unidad: 'm2', metrado: 26.50, precioUnitario: 195.20, parcial: 5172.80, especialidad: 'ARQUITECTURA' },
  { item: '17.02', grupoItem: '17', partida: 'MAMPARA DE CRISTAL TEMPLADO INCLUYE INSTALACION Y ACCESORIOS', unidad: 'm2', metrado: 7.70, precioUnitario: 195.20, parcial: 1503.04, especialidad: 'ARQUITECTURA' },
  { item: '17.03', grupoItem: '17', partida: 'ESPEJO BISELADO 0.60X0.60 M', unidad: 'm2', metrado: 1.44, precioUnitario: 201.33, parcial: 289.92, especialidad: 'ARQUITECTURA' },
  { item: '17.04', grupoItem: '17', partida: 'ACCESORIOS P. VENTANAS DE CRISTAL TEMPLADO', unidad: 'glb', metrado: 1.00, precioUnitario: 800.00, parcial: 800.00, especialidad: 'ARQUITECTURA' },

  // 18 Pintura
  { item: '18.01', grupoItem: '18', partida: 'PINTURA LATEX EN CIELORASOS', unidad: 'm2', metrado: 164.40, precioUnitario: 15.72, parcial: 2584.37, especialidad: 'ARQUITECTURA' },
  { item: '18.02', grupoItem: '18', partida: 'PINTURA LATEX EN MUROS INTERIORES', unidad: 'm2', metrado: 435.14, precioUnitario: 13.40, parcial: 5830.88, especialidad: 'ARQUITECTURA' },
  { item: '18.03', grupoItem: '18', partida: 'PINTURA LATEX EN FONDO DE ESCALERAS Y FRIZOS', unidad: 'm2', metrado: 20.70, precioUnitario: 20.81, parcial: 430.77, especialidad: 'ARQUITECTURA' },
  { item: '18.04', grupoItem: '18', partida: 'PINTURA LATEX EN MUROS EXTERIORES', unidad: 'm2', metrado: 82.81, precioUnitario: 14.06, parcial: 1164.31, especialidad: 'ARQUITECTURA' },
  { item: '18.05', grupoItem: '18', partida: 'PINTURA EN PUERTAS INTERIORES AL DUCO', unidad: 'm2', metrado: 71.40, precioUnitario: 94.70, parcial: 6761.58, especialidad: 'ARQUITECTURA' },
  { item: '18.06', grupoItem: '18', partida: 'PINTURA EN CLOSETS AL DUCO', unidad: 'm2', metrado: 29.70, precioUnitario: 94.70, parcial: 2812.59, especialidad: 'ARQUITECTURA' },
  { item: '18.07', grupoItem: '18', partida: 'PINTURA BARNIZ DD EN PISO DE PARQUET', unidad: 'm2', metrado: 125.00, precioUnitario: 27.50, parcial: 3437.50, especialidad: 'ARQUITECTURA' },
  { item: '18.08', grupoItem: '18', partida: 'PINTURA BARNIZ DD EN CONTRAZOCALO DE MADERA', unidad: 'm', metrado: 120.68, precioUnitario: 5.82, parcial: 702.36, especialidad: 'ARQUITECTURA' },
  { item: '18.09', grupoItem: '18', partida: 'PINTURA BARNIZ DD EN PASOS Y CONTRAPASOS DE ESCALERA', unidad: 'm2', metrado: 41.86, precioUnitario: 60.74, parcial: 2542.58, especialidad: 'ARQUITECTURA' },
  { item: '18.10', grupoItem: '18', partida: 'PINTURA BARNIZ DD EN PASAMANOS DE ESCALERA', unidad: 'm', metrado: 9.30, precioUnitario: 13.77, parcial: 128.06, especialidad: 'ARQUITECTURA' },
  { item: '18.11', grupoItem: '18', partida: 'LAQUEADO EN PORTON DE GARAGE', unidad: 'm2', metrado: 15.00, precioUnitario: 90.87, parcial: 1363.05, especialidad: 'ARQUITECTURA' },

  // 19 Varios, Limpieza, Jardinería
  { item: '19.01', grupoItem: '19', partida: 'LIMPIEZA PERMANENTE DE OBRA', unidad: 'glb', metrado: 1.00, precioUnitario: 2000.00, parcial: 2000.00, especialidad: 'ARQUITECTURA' },
  { item: '19.02', grupoItem: '19', partida: 'LIMPIEZA FINAL DE OBRA', unidad: 'glb', metrado: 1.00, precioUnitario: 1000.00, parcial: 1000.00, especialidad: 'ARQUITECTURA' },
  { item: '19.03', grupoItem: '19', partida: 'CAMPANA EXTRACTORA', unidad: 'pza', metrado: 1.00, precioUnitario: 479.33, parcial: 479.33, especialidad: 'ARQUITECTURA' },
  { item: '19.04', grupoItem: '19', partida: 'INTERCOMUNICADOR CON 02 TELEFONOS', unidad: 'pza', metrado: 1.00, precioUnitario: 316.00, parcial: 316.00, especialidad: 'ARQUITECTURA' },
  { item: '19.05', grupoItem: '19', partida: 'JARDIN, INCLUYE TIERRA DE CHACRA Y PLANTAS', unidad: 'm2', metrado: 16.28, precioUnitario: 48.80, parcial: 794.46, especialidad: 'ARQUITECTURA' },

  // 20 Aparatos y Accesorios Sanitarios
  { item: '20.01', grupoItem: '20', partida: 'INODORO TOP PIECE COLOR BLANCO CALIDAD STANDARD (SIN COLOCACION)', unidad: 'pza', metrado: 3.00, precioUnitario: 404.41, parcial: 1213.23, especialidad: 'SANITARIAS' },
  { item: '20.02', grupoItem: '20', partida: 'INODORO SIFON JET BLANCO CALIDAD STANDARD (SIN COLOCACION)', unidad: 'pza', metrado: 1.00, precioUnitario: 237.00, parcial: 237.00, especialidad: 'SANITARIAS' },
  { item: '20.03', grupoItem: '20', partida: 'LAVATORIO OVALIN MAXBELL BLANCO INC. MEZCLADORA (SIN COLOCACION)', unidad: 'pza', metrado: 3.00, precioUnitario: 442.31, parcial: 1326.93, especialidad: 'SANITARIAS' },
  { item: '20.04', grupoItem: '20', partida: 'GRIFERIA P/LAVATORIO MEZCLADORA TIPO CLASSIC', unidad: 'pza', metrado: 3.00, precioUnitario: 175.04, parcial: 525.12, especialidad: 'SANITARIAS' },
  { item: '20.05', grupoItem: '20', partida: 'LAVATORIO FONTANA BLANCO CALIDAD STANDARD (SIN COLOCACION)', unidad: 'pza', metrado: 1.00, precioUnitario: 324.43, parcial: 324.43, especialidad: 'SANITARIAS' },
  { item: '20.06', grupoItem: '20', partida: 'GRIFERIA P/LAVATORIO LINEA ECONOMICA', unidad: 'pza', metrado: 1.00, precioUnitario: 295.38, parcial: 295.38, especialidad: 'SANITARIAS' },
  { item: '20.07', grupoItem: '20', partida: 'JABONERA ADHESIVA S/ASA DE LOSA BLANCA', unidad: 'pza', metrado: 8.00, precioUnitario: 25.46, parcial: 203.68, especialidad: 'SANITARIAS' },
  { item: '20.08', grupoItem: '20', partida: 'PAPELERA ADHESIVA C/EJE DE LOSA BLANCA', unidad: 'pza', metrado: 4.00, precioUnitario: 21.22, parcial: 84.88, especialidad: 'SANITARIAS' },
  { item: '20.09', grupoItem: '20', partida: 'GANCHO ADHESIVO DOBLE DE LOSA BLANCA', unidad: 'pza', metrado: 3.00, precioUnitario: 12.75, parcial: 38.25, especialidad: 'SANITARIAS' },
  { item: '20.10', grupoItem: '20', partida: 'COLOCACION DE APARATOS SANITARIOS', unidad: 'pza', metrado: 10.00, precioUnitario: 172.66, parcial: 1726.60, especialidad: 'SANITARIAS' },
  { item: '20.11', grupoItem: '20', partida: 'COLOCACION DE ACCESORIOS SANITARIOS', unidad: 'pza', metrado: 15.00, precioUnitario: 34.54, parcial: 518.10, especialidad: 'SANITARIAS' },
  { item: '20.12', grupoItem: '20', partida: 'LAVADERO DE COCINA ACERO INOXIDABLE C/ESCURRIDERO 1 POZA', unidad: 'pza', metrado: 1.00, precioUnitario: 488.93, parcial: 488.93, especialidad: 'SANITARIAS' },
  { item: '20.13', grupoItem: '20', partida: 'GRIFERIA MEZCLADORA PARA LAVADERO', unidad: 'pza', metrado: 1.00, precioUnitario: 220.25, parcial: 220.25, especialidad: 'SANITARIAS' },
  { item: '20.14', grupoItem: '20', partida: 'LAVADERO DE ROPA DE GRANITO BLANCO 1 POZA', unidad: 'pza', metrado: 1.00, precioUnitario: 126.69, parcial: 126.69, especialidad: 'SANITARIAS' },
  { item: '20.15', grupoItem: '20', partida: 'GRIFERIA PARA LAVADERO DE ROPA (LLAVE ESFERICA 1/2")', unidad: 'pza', metrado: 1.00, precioUnitario: 15.17, parcial: 15.17, especialidad: 'SANITARIAS' },
];

// 3. PRECIOS UNITARIOS DE PARTIDAS OE & HU (PÁGINAS 1.5 A 1.13)
export const PARTIDAS_OE_HU: PartidaUnitarioOEHU[] = [
  // OE.1 OBRAS PROVISIONALES Y TRABAJOS PRELIMINARES
  { codigo: 'OE.1.1.1.01', partida: 'OFICINAS, ALMACENES, CASETA GUARDIANÍA, COMEDORES, VESTUARIOS', unidad: 'M2', precioUnitario: 101.48, manoDeObra: 57.79, materiales: 40.80, equipos: 2.89, especialidad: 'OE', subcategoria: 'Construcciones Provisionales' },
  { codigo: 'OE.1.1.1.07', partida: 'CERCO C/TRIPLAY H=2.40M', unidad: 'M', precioUnitario: 122.43, manoDeObra: 29.74, materiales: 92.69, equipos: 0.00, especialidad: 'OE', subcategoria: 'Construcciones Provisionales' },
  { codigo: 'OE.1.1.1.08', partida: 'CARTEL DE OBRA 3.60X7.20 M. (MADERA)', unidad: 'PZA', precioUnitario: 4024.32, manoDeObra: 1282.17, materiales: 2485.72, equipos: 256.43, especialidad: 'OE', subcategoria: 'Construcciones Provisionales' },
  { codigo: 'OE.1.1.2.01', partida: 'AGUA PARA LA CONSTRUCCIÓN', unidad: 'MES', precioUnitario: 2840.57, manoDeObra: 242.34, materiales: 0.00, equipos: 2598.23, especialidad: 'OE', subcategoria: 'Instalaciones Provisionales' },
  { codigo: 'OE.1.1.2.11', partida: 'CISTERNA PROVISIONAL P/AGUA CONSTRUC. DE ALBANILERIA (4 M3)', unidad: 'PZA', precioUnitario: 938.28, manoDeObra: 383.79, materiales: 535.30, equipos: 19.19, especialidad: 'OE', subcategoria: 'Instalaciones Provisionales' },
  { codigo: 'OE.1.1.3.01', partida: 'LIMPIEZA MANUAL DE TERRENO', unidad: 'M2', precioUnitario: 4.84, manoDeObra: 4.61, materiales: 0.00, equipos: 0.23, especialidad: 'OE', subcategoria: 'Trabajos Preliminares' },
  { codigo: 'OE.1.1.3.02', partida: 'LIMPIEZA DEL TERRENO C/EQUIPO', unidad: 'M2', precioUnitario: 2.53, manoDeObra: 0.62, materiales: 0.00, equipos: 1.91, especialidad: 'OE', subcategoria: 'Trabajos Preliminares' },
  { codigo: 'OE.1.1.3.03', partida: 'ELIMINACION DE BASURA Y ELEMENTOS SUELTOS LIVIANOS', unidad: 'M3', precioUnitario: 38.93, manoDeObra: 37.80, materiales: 0.00, equipos: 1.13, especialidad: 'OE', subcategoria: 'Trabajos Preliminares' },
  { codigo: 'OE.1.1.3.04', partida: 'ELIMINACION DE BASURA Y ELEMENTOS SUELTOS PESADOS', unidad: 'M3', precioUnitario: 66.16, manoDeObra: 63.01, materiales: 0.00, equipos: 3.15, especialidad: 'OE', subcategoria: 'Trabajos Preliminares' },
  { codigo: 'OE.1.1.5.11', partida: 'DESMONTAJE DE PUERTA', unidad: 'M2', precioUnitario: 27.31, manoDeObra: 26.01, materiales: 0.00, equipos: 1.30, especialidad: 'OE', subcategoria: 'Remociones' },
  { codigo: 'OE.1.1.5.12', partida: 'DESMONTAJE DE VENTANAS', unidad: 'M2', precioUnitario: 10.71, manoDeObra: 10.40, materiales: 0.00, equipos: 0.31, especialidad: 'OE', subcategoria: 'Remociones' },
  { codigo: 'OE.1.1.6.11', partida: 'DEMOLICION CIMIENTOS ARMADOS C/EQUIPO', unidad: 'M3', precioUnitario: 429.71, manoDeObra: 83.81, materiales: 0.00, equipos: 345.90, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.6.12', partida: 'DEMOLICION SOBRECIMIENTOS ARMADOS C/EQUIPO', unidad: 'M3', precioUnitario: 401.77, manoDeObra: 55.87, materiales: 0.00, equipos: 345.90, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.6.13', partida: 'DEMOLICION COLUMNAS Y VIGAS DE CONCRETO ARMADO C/EQUIPO', unidad: 'M3', precioUnitario: 570.27, manoDeObra: 109.06, materiales: 0.00, equipos: 461.21, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.6.15', partida: 'DEMOLICION CIMIENTOS MANUAL', unidad: 'M3', precioUnitario: 661.55, manoDeObra: 630.05, materiales: 0.00, equipos: 31.50, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.6.16', partida: 'DEMOLICION DE COLUMNAS CONCRETO ARMADO MANUAL', unidad: 'M3', precioUnitario: 793.86, manoDeObra: 756.06, materiales: 0.00, equipos: 37.80, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.6.31', partida: 'DEMOLICION DE MUROS DE LADRILLO KK CABEZA', unidad: 'M2', precioUnitario: 24.34, manoDeObra: 23.63, materiales: 0.00, equipos: 0.71, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.6.32', partida: 'DEMOLICION DE MUROS DE LADRILLO KK SOGA', unidad: 'M2', precioUnitario: 16.22, manoDeObra: 15.75, materiales: 0.00, equipos: 0.47, especialidad: 'OE', subcategoria: 'Demoliciones' },
  { codigo: 'OE.1.1.9.13', partida: 'TRAZO, NIVELES Y REPLANTEO PRELIMINAR', unidad: 'M2', precioUnitario: 3.79, manoDeObra: 2.12, materiales: 1.16, equipos: 0.51, especialidad: 'OE', subcategoria: 'Trazos y Replanteo' },

  // OE.2 ESTRUCTURAS - MOVIMIENTO DE TIERRAS & CONCRETO SIMPLE
  { codigo: 'OE.2.1.2.11', partida: 'EXCAV. ZANJAS P/CIMIENTOS MAT.SUEL.H=1.00 M.', unidad: 'M3', precioUnitario: 49.61, manoDeObra: 47.25, materiales: 0.00, equipos: 2.36, especialidad: 'OE', subcategoria: 'Movimiento de Tierras' },
  { codigo: 'OE.2.1.2.12', partida: 'EXCAV. ZANJAS P/CIMIENTOS MAT.SUEL.H=1.40 M.', unidad: 'M3', precioUnitario: 56.71, manoDeObra: 54.01, materiales: 0.00, equipos: 2.70, especialidad: 'OE', subcategoria: 'Movimiento de Tierras' },
  { codigo: 'OE.2.1.2.13', partida: 'EXCAV. ZANJAS P/CIMIENTOS MAT.SUEL.H=1.70 M.', unidad: 'M3', precioUnitario: 66.16, manoDeObra: 63.01, materiales: 0.00, equipos: 3.15, especialidad: 'OE', subcategoria: 'Movimiento de Tierras' },
  { codigo: 'OE.2.1.2.41', partida: 'EXCAV. ZAPATAS MAT.SUELTO H=1.00 M', unidad: 'M3', precioUnitario: 56.71, manoDeObra: 54.01, materiales: 0.00, equipos: 2.70, especialidad: 'OE', subcategoria: 'Movimiento de Tierras' },
  { codigo: 'OE.2.1.4.1.11', partida: 'RELLENO COMPACTADO A MANO - MAT. PROPIO, R=7M3/D C/PISON', unidad: 'M3', precioUnitario: 28.35, manoDeObra: 27.00, materiales: 0.00, equipos: 1.35, especialidad: 'OE', subcategoria: 'Rellenos' },
  { codigo: 'OE.2.1.4.1.13', partida: 'RELLENO COMPACTADO C/COMPACTADORA 5.8HP-MAT. PROPIO', unidad: 'M3', precioUnitario: 64.67, manoDeObra: 44.66, materiales: 0.74, equipos: 19.27, especialidad: 'OE', subcategoria: 'Rellenos' },
  { codigo: 'OE.2.1.5.21', partida: 'ELIMIN. MAT. CARGUIO MANUAL/VOLQUET 4 M3 DM=5 KM.', unidad: 'M3', precioUnitario: 96.61, manoDeObra: 33.71, materiales: 0.00, equipos: 62.90, especialidad: 'OE', subcategoria: 'Eliminación Excedentes' },
  { codigo: 'OE.2.1.5.22', partida: 'ELIM.MAT.CARG.MANUAL/VOLQUETE 6 M3,V=30 D= 5 KMS.', unidad: 'M3', precioUnitario: 81.51, manoDeObra: 33.26, materiales: 0.00, equipos: 48.25, especialidad: 'OE', subcategoria: 'Eliminación Excedentes' },
  { codigo: 'OE.2.2.1.12', partida: 'CONCRETO CICLOPEO 1:8(C:H)+30% P.G.-CIMIENTOS CORRIDOS', unidad: 'M3', precioUnitario: 250.69, manoDeObra: 88.74, materiales: 149.14, equipos: 12.81, especialidad: 'OE', subcategoria: 'Concreto Simple' },
  { codigo: 'OE.2.2.1.13', partida: 'CONCRETO CICLOPEO 1:10(C:H)+30% P.G.-CIMIENTO CORRIDOS', unidad: 'M3', precioUnitario: 231.08, manoDeObra: 88.74, materiales: 129.53, equipos: 12.81, especialidad: 'OE', subcategoria: 'Concreto Simple' },
  { codigo: 'OE.2.2.1.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL P. CIMIENTOS', unidad: 'M2', precioUnitario: 45.45, manoDeObra: 21.65, materiales: 22.72, equipos: 1.08, especialidad: 'OE', subcategoria: 'Concreto Simple' },
  { codigo: 'OE.2.2.3.12', partida: 'CONCRETO C:H 1:12 E=2"-SOLADO', unidad: 'M2', precioUnitario: 32.05, manoDeObra: 22.19, materiales: 6.66, equipos: 3.20, especialidad: 'OE', subcategoria: 'Concreto Simple' },
  { codigo: 'OE.2.2.6.12', partida: 'CONCRETO 1:8 (C:H) + 25% P.M.-SOBRECIMIENTOS', unidad: 'M3', precioUnitario: 346.60, manoDeObra: 184.86, materiales: 138.75, equipos: 22.99, especialidad: 'OE', subcategoria: 'Concreto Simple' },
  { codigo: 'OE.2.2.6.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL PARA SOBRECIMIENTOS', unidad: 'M2', precioUnitario: 49.17, manoDeObra: 27.07, materiales: 21.29, equipos: 0.81, especialidad: 'OE', subcategoria: 'Concreto Simple' },
  { codigo: 'OE.2.2.9.22', partida: 'FALSOPISO DE 4" CON MEZC.1:8 C:H', unidad: 'M2', precioUnitario: 41.40, manoDeObra: 20.84, materiales: 18.03, equipos: 2.53, especialidad: 'OE', subcategoria: 'Concreto Simple' },

  // OE.2.3 CONCRETO ARMADO
  { codigo: 'OE.2.3.2.35', partida: 'CONCRETO F\'C 175 KG/CM2 ZAPATA', unidad: 'M3', precioUnitario: 391.64, manoDeObra: 98.21, materiales: 277.62, equipos: 15.81, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.2.36', partida: 'CONCRETO F\'C 210 KG/CM2 ZAPATA', unidad: 'M3', precioUnitario: 411.25, manoDeObra: 98.21, materiales: 297.23, equipos: 15.81, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.2.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL ZAPATA', unidad: 'M2', precioUnitario: 81.10, manoDeObra: 54.13, materiales: 24.26, equipos: 2.71, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.3.36', partida: 'CONCRETO F\'C 210 KG/CM2 VIGA CIMENTACION', unidad: 'M3', precioUnitario: 440.24, manoDeObra: 122.76, materiales: 297.71, equipos: 19.77, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.3.81', partida: 'ENCOFRADO Y DESENCOFRADO VIGA DE CIMENTACION', unidad: 'M2', precioUnitario: 72.49, manoDeObra: 54.13, materiales: 15.65, equipos: 2.71, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.6.2.35', partida: 'CONCRETO F\'C 175 KG/CM2 TABIQUE Y PLACA', unidad: 'M3', precioUnitario: 722.92, manoDeObra: 387.78, materiales: 281.67, equipos: 53.47, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.6.2.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL TABIQUE Y PLACA', unidad: 'M2', precioUnitario: 72.03, manoDeObra: 43.30, materiales: 26.56, equipos: 2.17, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.7.35', partida: 'CONCRETO F\'C 175 KG/CM2 COLUMNA', unidad: 'M3', precioUnitario: 633.48, manoDeObra: 310.22, materiales: 280.48, equipos: 42.78, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.7.36', partida: 'CONCRETO F\'C 210 KG/CM2 COLUMNA', unidad: 'M3', precioUnitario: 653.09, manoDeObra: 310.22, materiales: 300.09, equipos: 42.78, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.7.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL COLUMNA', unidad: 'M2', precioUnitario: 72.95, manoDeObra: 43.30, materiales: 27.48, equipos: 2.17, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.8.35', partida: 'CONCRETO F\'C 175 KG/CM2 VIGA', unidad: 'M3', precioUnitario: 454.61, manoDeObra: 155.12, materiales: 278.10, equipos: 21.39, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.8.36', partida: 'CONCRETO F\'C 210 KG/CM2 VIGA', unidad: 'M3', precioUnitario: 474.22, manoDeObra: 155.12, materiales: 297.71, equipos: 21.39, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.8.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL VIGAS RECTAS', unidad: 'M2', precioUnitario: 81.70, manoDeObra: 46.24, materiales: 33.15, equipos: 2.31, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.9.2.35', partida: 'CONCRETO F\'C 175 KG/CM2 LOSA ALIGERADA', unidad: 'M3', precioUnitario: 418.81, manoDeObra: 124.09, materiales: 277.62, equipos: 17.10, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.9.2.72', partida: 'LADRILLO ARCILLA PARA TECHO 15X30X30 CM', unidad: 'PZA', precioUnitario: 2.63, manoDeObra: 1.07, materiales: 1.53, equipos: 0.03, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.9.2.74', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL LOSA ALIGERADA', unidad: 'M2', precioUnitario: 51.72, manoDeObra: 28.87, materiales: 21.41, equipos: 1.44, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.10.35', partida: 'CONCRETO F\'C 175 KG/CM2 ESCALERA', unidad: 'M3', precioUnitario: 652.24, manoDeObra: 328.09, materiales: 280.48, equipos: 43.67, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.10.81', partida: 'ENCOFRADO Y DESENCOFRADO NORMAL ESCALERA', unidad: 'M2', precioUnitario: 110.43, manoDeObra: 72.16, materiales: 34.66, equipos: 3.61, especialidad: 'OE', subcategoria: 'Concreto Armado' },
  { codigo: 'OE.2.3.81.03', partida: 'ACERO FY=4,200 KG/CM2 REND:300 KG/DIA', unidad: 'KG', precioUnitario: 5.89, manoDeObra: 1.45, materiales: 4.28, equipos: 0.16, especialidad: 'OE', subcategoria: 'Acero de Refuerzo' },

  // OE.3 ARQUITECTURA
  { codigo: 'OE.3.1.1.12', partida: 'MURO LADR.K.K. MEZC.C:A 1:5, TIPO IV, P.TARRAJ. DE SOGA', unidad: 'M2', precioUnitario: 71.00, manoDeObra: 37.26, materiales: 31.88, equipos: 1.86, especialidad: 'OE', subcategoria: 'Albañilería' },
  { codigo: 'OE.3.1.1.14', partida: 'MURO LADR.K.K. MEZC.C:A 1:4, TIPO IV, P.TARRAJ. DE CABEZA', unidad: 'M2', precioUnitario: 118.34, manoDeObra: 55.87, materiales: 59.68, equipos: 2.79, especialidad: 'OE', subcategoria: 'Albañilería' },
  { codigo: 'OE.3.1.3.12', partida: 'MURO LADR.PANDERETA DE SOGA MEZC.C:A 1:5 P/TARRAJEAR', unidad: 'M2', precioUnitario: 64.79, manoDeObra: 37.26, materiales: 25.67, equipos: 1.86, especialidad: 'OE', subcategoria: 'Albañilería' },
  { codigo: 'OE.3.1.10.21', partida: 'TABIQUE SIMPLE PLACA GYPLAC ST. 1/2" PERFIL 64 E = 8.94CM', unidad: 'M2', precioUnitario: 52.46, manoDeObra: 11.68, materiales: 39.61, equipos: 1.17, especialidad: 'OE', subcategoria: 'Drywall y Tabiques' },
  { codigo: 'OE.3.1.10.25', partida: 'TABIQUE DOBLE PLACA GYPLAC ST. 1/2" PERFIL 64 E = 11.48CM', unidad: 'M2', precioUnitario: 84.50, manoDeObra: 16.81, materiales: 66.01, equipos: 1.68, especialidad: 'OE', subcategoria: 'Drywall y Tabiques' },
  { codigo: 'OE.3.2.1.11', partida: 'TARRAJEO PRIMARIO Y RAYADO C/MEZCLA 1:5 E=1.5CM', unidad: 'M2', precioUnitario: 29.00, manoDeObra: 20.96, materiales: 6.99, equipos: 1.05, especialidad: 'OE', subcategoria: 'Revoques' },
  { codigo: 'OE.3.2.2.11', partida: 'TARRAJEO MUROS INT.FROTACHADO MEZ.C:A 1:5,E=1.5 CM.', unidad: 'M2', precioUnitario: 26.56, manoDeObra: 20.52, materiales: 5.01, equipos: 1.03, especialidad: 'OE', subcategoria: 'Revoques' },
  { codigo: 'OE.3.2.3.11', partida: 'TARRAJEO MUROS EXT.FROTACHADO MEZ.C:A 1:5,E=1.5 CM.', unidad: 'M2', precioUnitario: 35.60, manoDeObra: 25.65, materiales: 8.67, equipos: 1.28, especialidad: 'OE', subcategoria: 'Revoques' },
  { codigo: 'OE.3.2.11.13', partida: 'VESTIDURA DERRAMES ANCHO=0.15 M MEZC.C:A 1:5 E=1.5CM.', unidad: 'M', precioUnitario: 23.14, manoDeObra: 20.52, materiales: 1.59, equipos: 1.03, especialidad: 'OE', subcategoria: 'Derrames' },
  { codigo: 'OE.3.3.3.11', partida: 'CIELORASO CON MEZC.C:A 1:5 CON CINTAS E=1.5 CM.', unidad: 'M2', precioUnitario: 46.64, manoDeObra: 38.47, materiales: 7.02, equipos: 1.15, especialidad: 'OE', subcategoria: 'Cielorrasos' },
  { codigo: 'OE.3.4.1.12', partida: 'CONTRAPISO E=48 MM. BASE 3.8 CM.MEZC.1:5,ACAB.1 CM.PASTA 1:2', unidad: 'M2', precioUnitario: 44.30, manoDeObra: 26.86, materiales: 14.01, equipos: 3.43, especialidad: 'OE', subcategoria: 'Pisos' },
  { codigo: 'OE.3.4.2.56', partida: 'CERAMICO PISO EXTRA FORTE BLANCO 45X45 CM DE 1RA. (JUNTA 3MM)', unidad: 'M2', precioUnitario: 73.72, manoDeObra: 43.96, materiales: 27.56, equipos: 2.20, especialidad: 'OE', subcategoria: 'Pisos' },
  { codigo: 'OE.3.4.2.72', partida: 'PISO DE CEMENTO PULIDO E=2" MEZCLA 1:4', unidad: 'M2', precioUnitario: 54.58, manoDeObra: 36.10, materiales: 16.67, equipos: 1.81, especialidad: 'OE', subcategoria: 'Pisos' },
  { codigo: 'OE.3.5.2.3.01', partida: 'CONTRAZOCALO CEMENTO SIN COLOREAR PULIDO H=10 CM. MEZC.1:5', unidad: 'M', precioUnitario: 13.65, manoDeObra: 12.81, materiales: 0.46, equipos: 0.38, especialidad: 'OE', subcategoria: 'Contrazócalos' },
  { codigo: 'OE.3.6.3.11', partida: 'CUB.LADR.PAST.24X24 ASENT.C/MEZC.1:5 2.5CM;JUNTA 1:5 1.5CM', unidad: 'M2', precioUnitario: 68.43, manoDeObra: 28.90, materiales: 38.66, equipos: 0.87, especialidad: 'OE', subcategoria: 'Cubiertas' },
  { codigo: 'OE.3.7.1.11', partida: 'PUERTAS CONTRAPLACADAS E=35 MM C/TRIPLAY LUPUNA 4 MM.', unidad: 'M2', precioUnitario: 254.74, manoDeObra: 157.97, materiales: 77.75, equipos: 19.02, especialidad: 'OE', subcategoria: 'Carpintería de Madera' },
  { codigo: 'OE.3.7.1.41', partida: 'MARCOS DE MADERA PARA PUERTAS DE CEDRO 1 1/2" X 3"', unidad: 'M', precioUnitario: 22.11, manoDeObra: 9.58, materiales: 11.43, equipos: 1.10, especialidad: 'OE', subcategoria: 'Carpintería de Madera' },
  { codigo: 'OE.3.7.12.11', partida: 'MUEBLE BAJO DE COCINA MELAMINA C/TABLERO POSTFORMADO H=0.80 A=0.60 M', unidad: 'M', precioUnitario: 1396.30, manoDeObra: 0.00, materiales: 1396.30, equipos: 0.00, especialidad: 'OE', subcategoria: 'Muebles' },
  { codigo: 'OE.3.8.1.11', partida: 'VENTANA DE FIERRO CON REJA DE SEGURIDAD', unidad: 'M2', precioUnitario: 584.61, manoDeObra: 259.25, materiales: 287.28, equipos: 38.08, especialidad: 'OE', subcategoria: 'Carpintería Metálica' },
  { codigo: 'OE.3.9.2.11', partida: 'CERRADURA PUERTA PRINCIPAL PESADA', unidad: 'PZA', precioUnitario: 120.50, manoDeObra: 63.59, materiales: 55.00, equipos: 1.91, especialidad: 'OE', subcategoria: 'Cerrajería' },
  { codigo: 'OE.3.10.3.11', partida: 'VIDRIO TEMPLADO INCOLORO 6MM', unidad: 'M2', precioUnitario: 195.20, manoDeObra: 20.39, materiales: 174.37, equipos: 0.44, especialidad: 'OE', subcategoria: 'Vidrios' },
  { codigo: 'OE.3.11.1.13', partida: 'PINTURA MUROS INTERIORES VINILICA-2 MANOS C/IMPRIMANTE', unidad: 'M2', precioUnitario: 13.40, manoDeObra: 9.08, materiales: 4.05, equipos: 0.27, especialidad: 'OE', subcategoria: 'Pintura' },
  { codigo: 'OE.3.11.1.21', partida: 'PINTURA MUROS EXTERIORES VINILICA 2 MANOS C/IMPRIMANTE', unidad: 'M2', precioUnitario: 14.06, manoDeObra: 10.17, materiales: 3.58, equipos: 0.31, especialidad: 'OE', subcategoria: 'Pintura' },

  // OE.4 INSTALACIONES SANITARIAS
  { codigo: 'OE.4.1.1.11', partida: 'INODORO TWO PIECE SIFON JET BLANCO (SIN COLOCACION)', unidad: 'PZA', precioUnitario: 237.00, manoDeObra: 0.00, materiales: 237.00, equipos: 0.00, especialidad: 'OE', subcategoria: 'Aparatos Sanitarios' },
  { codigo: 'OE.4.1.1.21', partida: 'INODORO ONE PIECE ADVANCE BLANCO (SIN COLOCACION)', unidad: 'PZA', precioUnitario: 525.31, manoDeObra: 0.00, materiales: 525.31, equipos: 0.00, especialidad: 'OE', subcategoria: 'Aparatos Sanitarios' },
  { codigo: 'OE.4.1.1.31', partida: 'LAVATORIO FONTANA BLANCO INC. MEZCLADORA (SIN COLOCACION)', unidad: 'PZA', precioUnitario: 324.43, manoDeObra: 0.00, materiales: 324.43, equipos: 0.00, especialidad: 'OE', subcategoria: 'Aparatos Sanitarios' },
  { codigo: 'OE.4.1.3.11', partida: 'COLOCACION DE APARATOS SANITARIOS', unidad: 'PZA', precioUnitario: 172.66, manoDeObra: 167.63, materiales: 0.00, equipos: 5.03, especialidad: 'OE', subcategoria: 'Instalación Sanitarios' },
  { codigo: 'OE.4.2.1.11', partida: 'SALIDA DE AGUA FRIA PVC INC.TUBERIA Y ACCESORIOS 1/2"', unidad: 'PTO', precioUnitario: 132.47, manoDeObra: 111.76, materiales: 17.36, equipos: 3.35, especialidad: 'OE', subcategoria: 'Agua Fría' },
  { codigo: 'OE.4.2.2.21', partida: 'TUBERIA PVC CLASE 10 SP P/AGUA FRIA D=1/2"', unidad: 'M', precioUnitario: 22.76, manoDeObra: 17.32, materiales: 4.92, equipos: 0.52, especialidad: 'OE', subcategoria: 'Agua Fría' },
  { codigo: 'OE.4.2.2.22', partida: 'TUBERIA PVC CLASE 10 SP P/AGUA FRIA D=3/4"', unidad: 'M', precioUnitario: 24.80, manoDeObra: 17.32, materiales: 6.96, equipos: 0.52, especialidad: 'OE', subcategoria: 'Agua Fría' },
  { codigo: 'OE.4.2.5.11', partida: 'VALVULA DE COMPUERTA PESADA DE BRONCE DE 1/2"', unidad: 'PZA', precioUnitario: 110.76, manoDeObra: 57.28, materiales: 51.76, equipos: 1.72, especialidad: 'OE', subcategoria: 'Válvulas' },
  { codigo: 'OE.4.2.5.12', partida: 'VALVULA DE COMPUERTA PESADA DE BRONCE DE 3/4"', unidad: 'PZA', precioUnitario: 135.28, manoDeObra: 57.28, materiales: 76.28, equipos: 1.72, especialidad: 'OE', subcategoria: 'Válvulas' },
  { codigo: 'OE.4.2.6.21', partida: 'TANQUES-ETERNIT 1.0 M3', unidad: 'PZA', precioUnitario: 569.35, manoDeObra: 104.03, materiales: 462.20, equipos: 3.12, especialidad: 'OE', subcategoria: 'Almacenamiento Agua' },
  { codigo: 'OE.4.3.1.11', partida: 'SALIDA DE AGUA CALIENTE CON TUBERIA CPVC (PROMEDIO)', unidad: 'PTO', precioUnitario: 190.10, manoDeObra: 167.63, materiales: 17.44, equipos: 5.03, especialidad: 'OE', subcategoria: 'Agua Caliente' },
  { codigo: 'OE.4.3.2.11', partida: 'TUBO CPVC P/AGUA CALIENTE D=1/2"', unidad: 'M', precioUnitario: 19.14, manoDeObra: 13.41, materiales: 5.33, equipos: 0.40, especialidad: 'OE', subcategoria: 'Agua Caliente' },
  { codigo: 'OE.4.6.1.11', partida: 'SALIDA DE DESAGUE PVC-SAL 2"', unidad: 'PTO', precioUnitario: 136.13, manoDeObra: 104.03, materiales: 28.98, equipos: 3.12, especialidad: 'OE', subcategoria: 'Desagüe' },
  { codigo: 'OE.4.6.1.12', partida: 'SALIDA DE DESAGUE PVC-SAL 4"', unidad: 'PTO', precioUnitario: 152.82, manoDeObra: 104.03, materiales: 45.67, equipos: 3.12, especialidad: 'OE', subcategoria: 'Desagüe' },
  { codigo: 'OE.4.6.2.11', partida: 'TUBERIA PVC SAL P/DESAGUE D=2"', unidad: 'M', precioUnitario: 36.36, manoDeObra: 28.90, materiales: 6.59, equipos: 0.87, especialidad: 'OE', subcategoria: 'Desagüe' },
  { codigo: 'OE.4.6.2.13', partida: 'TUBERIA PVC SAL P/DESAGUE D=4"', unidad: 'M', precioUnitario: 41.87, manoDeObra: 28.90, materiales: 12.10, equipos: 0.87, especialidad: 'OE', subcategoria: 'Desagüe' },
  { codigo: 'OE.4.6.5.11', partida: 'CAJA DE REG. ALB. - 10" X 20" TAPA CONCRETO', unidad: 'PZA', precioUnitario: 225.94, manoDeObra: 104.03, materiales: 118.79, equipos: 3.12, especialidad: 'OE', subcategoria: 'Cámaras Inspección' },
  { codigo: 'OE.4.6.5.31', partida: 'BUZONES DE DESAGUE STD.', unidad: 'PZA', precioUnitario: 2294.00, manoDeObra: 1321.07, materiales: 891.44, equipos: 81.49, especialidad: 'OE', subcategoria: 'Cámaras Inspección' },

  // OE.5 INSTALACIONES ELÉCTRICAS
  { codigo: 'OE.5.2.1.11', partida: 'SALIDA DE TECHO C/TUB.SEL(3/4) CABLE TW12, CAJAS LIVIANAS', unidad: 'PTO', precioUnitario: 115.49, manoDeObra: 83.22, materiales: 28.11, equipos: 4.16, especialidad: 'OE', subcategoria: 'Instalaciones Eléctricas' },
  { codigo: 'OE.5.2.1.15', partida: 'SALIDA DE TECHO C/TUB.SAP(3/4) ALAMBRE TW 12, CAJAS LIVIANAS', unidad: 'PTO', precioUnitario: 122.68, manoDeObra: 83.22, materiales: 36.96, equipos: 2.50, especialidad: 'OE', subcategoria: 'Instalaciones Eléctricas' },
  { codigo: 'OE.5.2.1.59', partida: 'SALIDA P/TOMACORR.BIPOL.DOBLE TUB.SEL.3/4 CAB.TW12 CAJA LIV.', unidad: 'PTO', precioUnitario: 167.69, manoDeObra: 104.03, materiales: 58.46, equipos: 5.20, especialidad: 'OE', subcategoria: 'Tomacorrientes' },
  { codigo: 'OE.5.2.1.63', partida: 'SALIDA P/TOMACORR.BIPOL.DOBLE TUB.SAP.3/4 ALA.TW12 CAJA LIV.', unidad: 'PTO', precioUnitario: 172.44, manoDeObra: 104.03, materiales: 65.29, equipos: 3.12, especialidad: 'OE', subcategoria: 'Tomacorrientes' },
  { codigo: 'OE.5.2.1.71', partida: 'SALIDA PARA THERMAS PVC SEL', unidad: 'PTO', precioUnitario: 101.90, manoDeObra: 63.59, materiales: 35.13, equipos: 3.18, especialidad: 'OE', subcategoria: 'Fuerza' },
  { codigo: 'OE.5.2.2.11', partida: 'TUBERIAS DE PVC-SAP (ELECTRICAS) D=1/2" 15 MM', unidad: 'M', precioUnitario: 17.29, manoDeObra: 13.87, materiales: 3.00, equipos: 0.42, especialidad: 'OE', subcategoria: 'Canalizaciones' },
  { codigo: 'OE.5.2.2.12', partida: 'TUBERIAS DE PVC-SAP (ELECTRICAS) D=3/4"', unidad: 'M', precioUnitario: 18.01, manoDeObra: 13.87, materiales: 3.72, equipos: 0.42, especialidad: 'OE', subcategoria: 'Canalizaciones' },
  { codigo: 'OE.5.2.6.11', partida: 'TABLEROS DISTRIB.CAJA METALICA CON 12 POLOS', unidad: 'PZA', precioUnitario: 869.99, manoDeObra: 167.63, materiales: 697.33, equipos: 5.03, especialidad: 'OE', subcategoria: 'Tableros Eléctricos' },
  { codigo: 'OE.5.2.6.12', partida: 'TABLEROS DISTRIB.CAJA METALICA CON 18 POLOS', unidad: 'PZA', precioUnitario: 547.92, manoDeObra: 223.50, materiales: 317.71, equipos: 6.71, especialidad: 'OE', subcategoria: 'Tableros Eléctricos' },
  { codigo: 'OE.5.2.8.11', partida: 'INTERRUPTOR TERMOMAGNETICO MONOFASICA 2 X 15A', unidad: 'PZA', precioUnitario: 43.54, manoDeObra: 20.96, materiales: 21.95, equipos: 0.63, especialidad: 'OE', subcategoria: 'Termomagnéticos' },
  { codigo: 'OE.5.2.8.12', partida: 'INTERRUPTOR TERMOMAGNETICO MONOFASICA 2 X 30A', unidad: 'PZA', precioUnitario: 52.01, manoDeObra: 20.96, materiales: 30.42, equipos: 0.63, especialidad: 'OE', subcategoria: 'Termomagnéticos' },

  // HU HABILITACIONES URBANAS (PÁGINAS 1.11 - 1.13)
  { codigo: 'HU.1.1.6.11', partida: 'DEMOLICION PAVIMENTO FLEXIBLE C/EQUIPO E=0.05 M', unidad: 'M2', precioUnitario: 9.70, manoDeObra: 5.11, materiales: 0.00, equipos: 4.59, especialidad: 'HU', subcategoria: 'Demoliciones Viales' },
  { codigo: 'HU.1.1.6.21', partida: 'DEMOLICION PAVIMENTO RIGIDO C/EQ.(LOSA DE CONCRETO) E=0.15M', unidad: 'M2', precioUnitario: 45.73, manoDeObra: 24.09, materiales: 0.00, equipos: 21.64, especialidad: 'HU', subcategoria: 'Demoliciones Viales' },
  { codigo: 'HU.1.1.6.31', partida: 'DEMOLICION VEREDA DE CONCRETO C/EQUIPO E=0.10 M', unidad: 'M2', precioUnitario: 23.13, manoDeObra: 10.64, materiales: 0.00, equipos: 12.49, especialidad: 'HU', subcategoria: 'Demoliciones Viales' },
  { codigo: 'HU.2.1.1.11', partida: 'EXCAVACION HASTA SUBRASANTE MAT.SUELTO C/TRACTOR 140-160 HP', unidad: 'M3', precioUnitario: 12.34, manoDeObra: 1.89, materiales: 0.00, equipos: 10.45, especialidad: 'HU', subcategoria: 'Pistas y Veredas' },
  { codigo: 'HU.2.1.3.11', partida: 'RELLENO COMPACTADO CON MATERIAL PROPIO C/EQUIPO (PISTAS R=250 M3/D)', unidad: 'M3', precioUnitario: 33.64, manoDeObra: 5.68, materiales: 0.00, equipos: 27.96, especialidad: 'HU', subcategoria: 'Pistas y Veredas' },
  { codigo: 'HU.2.1.4.11', partida: 'ELIMINACION DE EXCEDENTES C/VOLQ.10 M3 D=10 KM.', unidad: 'M3', precioUnitario: 46.93, manoDeObra: 0.37, materiales: 0.00, equipos: 46.56, especialidad: 'HU', subcategoria: 'Pistas y Veredas' },
  { codigo: 'HU.2.1.5.11', partida: 'CONFORMACION Y COMPACTACION SUBRASANTE C/MOTONIV. 125HP', unidad: 'M2', precioUnitario: 4.17, manoDeObra: 0.73, materiales: 0.00, equipos: 3.44, especialidad: 'HU', subcategoria: 'Pistas y Veredas' },
  { codigo: 'HU.2.2.1.12', partida: 'SUB-BASE GRANULAR E=0.15 M.(AGREGADO PRODUCIDO) C/EQUIPO', unidad: 'M2', precioUnitario: 18.09, manoDeObra: 1.27, materiales: 0.59, equipos: 16.27, especialidad: 'HU', subcategoria: 'Bases Granulares' },
  { codigo: 'HU.2.2.2.12', partida: 'BASE GRANULAR E=0.15 M (AFIRMADO PRODUCIDO) C/EQUIPO', unidad: 'M2', precioUnitario: 29.21, manoDeObra: 1.59, materiales: 9.68, equipos: 17.98, especialidad: 'HU', subcategoria: 'Bases Granulares' },
  { codigo: 'HU.2.3.4.11', partida: 'VEREDA CONC.PREMEZC.F\'C=140KG/CM2 E=0.10M, ACABADO C:A 1:2', unidad: 'M2', precioUnitario: 43.87, manoDeObra: 18.32, materiales: 24.37, equipos: 1.18, especialidad: 'HU', subcategoria: 'Veredas' },
  { codigo: 'HU.2.4.1.21', partida: 'IMPRIMACION ASFALTICA MANUAL', unidad: 'M2', precioUnitario: 11.57, manoDeObra: 3.65, materiales: 5.46, equipos: 2.46, especialidad: 'HU', subcategoria: 'Pavimentos Asfálticos' },
  { codigo: 'HU.2.4.2.12', partida: 'CARPETA ASFALTICA EN CALIENTE E=1 1/2" C/EQUIPO, MEZCLA ADQ.', unidad: 'M2', precioUnitario: 39.24, manoDeObra: 1.20, materiales: 31.38, equipos: 6.68, especialidad: 'HU', subcategoria: 'Pavimentos Asfálticos' },
  { codigo: 'HU.2.4.2.13', partida: 'CARPETA ASFALTICA EN CALIENTE E=2" C/EQUIPO, MEZCLA ADQ.', unidad: 'M2', precioUnitario: 52.30, manoDeObra: 1.60, materiales: 41.80, equipos: 8.89, especialidad: 'HU', subcategoria: 'Pavimentos Asfálticos' },
  { codigo: 'HU.2.5.11', partida: 'SARDINEL DE VEREDA F\'C=140 KG/CM2 (15X40CM)', unidad: 'M', precioUnitario: 34.86, manoDeObra: 18.32, materiales: 15.46, equipos: 1.08, especialidad: 'HU', subcategoria: 'Sardineles' },
  { codigo: 'HU.2.7.6.11', partida: 'PINTADO DE PAVIMENTOS (LINEA CONTINUA)', unidad: 'M', precioUnitario: 17.19, manoDeObra: 15.13, materiales: 0.55, equipos: 1.51, especialidad: 'HU', subcategoria: 'Señalización Vial' },
  { codigo: 'HU.3.4.1.1.03', partida: 'EXCAV.C/I A MAQ. T.N."C" HASTA 1.0 P/TUB.D= 4"- 6"', unidad: 'M', precioUnitario: 4.70, manoDeObra: 1.39, materiales: 0.00, equipos: 3.31, especialidad: 'HU', subcategoria: 'Saneamiento Zanjas' },
  { codigo: 'HU.3.4.3.1.03', partida: 'RELLENO COMPAC.ZANJA T.N. P/TUB.HASTA 1.0 D= 4"- 6"', unidad: 'M', precioUnitario: 31.40, manoDeObra: 25.13, materiales: 4.07, equipos: 2.20, especialidad: 'HU', subcategoria: 'Saneamiento Zanjas' },
  { codigo: 'HU.3.5.2.53', partida: 'TUBERIA P.V.C. DES. SAL LIVIANA 4" (100MM) INC.UNION+2% DESP', unidad: 'M', precioUnitario: 13.80, manoDeObra: 2.37, materiales: 11.36, equipos: 0.07, especialidad: 'HU', subcategoria: 'Tuberías Saneamiento' },
];

// 4. ÍNDICE COMPLETO DE GRUPOS DE LA A A LA Z (PÁGINAS 3.1 Y 3.2 DEL PDF)
export const INDICE_GRUPOS_INSUMOS: GrupoIndiceInsumo[] = [
  // A
  { letra: 'A', grupo: 'ABRAZADERA', pagina: '3.23', tipo: 'MATERIAL', descripcion: 'Abrazaderas 1 1/2", 1", 1/2", 2", 3", 4" Jormen de 2mm' },
  { letra: 'A', grupo: 'ACCESORIOS', pagina: '3.12', tipo: 'MATERIAL', descripcion: 'Codos galv, tees, uniones, accesorios para desagüe' },
  { letra: 'A', grupo: 'ACCESORIOS', pagina: '3.29', tipo: 'MATERIAL', descripcion: 'Codos y curvas CPVC, PVC, tees sanitarias, válvulas check' },
  { letra: 'A', grupo: 'ACCESORIOS DE GRIFERÍA', pagina: '3.19', tipo: 'MATERIAL', descripcion: 'Desagües push inox, rejillas, tubos de abasto' },
  { letra: 'A', grupo: 'ACCESORIOS PARA CANALETA ELÉCTRICA', pagina: '3.23', tipo: 'MATERIAL', descripcion: 'Derivaciones T, ángulos internos/externos, tapas Dexson/Schneider' },
  { letra: 'A', grupo: 'ACCESORIOS PARA ENCOFRADOS', pagina: '3.15', tipo: 'EQUIPO', descripcion: 'Cabezal puntal viga H20, adaptadores, espárragos Altos' },
  { letra: 'A', grupo: 'ACCESORIOS SAP', pagina: '3.23', tipo: 'MATERIAL', descripcion: 'Conectores, curvas y uniones PVC SAP pesada Nicoll' },
  { letra: 'A', grupo: 'ACCESORIOS SEL', pagina: '3.23', tipo: 'MATERIAL', descripcion: 'Conectores, curvas y uniones PVC SEL liviana Nicoll' },
  { letra: 'A', grupo: 'ACERO CORRUGADO F\'Y 4200 (G-60)', pagina: '3.19', tipo: 'MATERIAL', descripcion: 'Varillas 6mm, 8mm, 3/8", 1/2", 5/8", 3/4", 1" Aceros Arequipa / La Viga' },
  { letra: 'A', grupo: 'ADAPTADORES', pagina: '3.24', tipo: 'MATERIAL', descripcion: 'Adaptadores trifásicos, Schuko, espiga plana Voltech/Wonpro' },
  { letra: 'A', grupo: 'ADITIVO ACELERANTE', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chema 3, Chema 5, Chema Estruct sin cloruros' },
  { letra: 'A', grupo: 'ADITIVO CURADOR', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Curador Membranil reforzado y vista para concreto' },
  { letra: 'A', grupo: 'ADITIVO DESMOLDANTE', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Desmoldante p/encofrado madera Chemalac y extra' },
  { letra: 'A', grupo: 'ADITIVO ENDURECEDOR DE PISO', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chemadur XF bolsa 25kg endurecedor superficial' },
  { letra: 'A', grupo: 'ADITIVO EXPANSIVO', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chema Crack fracturador de roca y concreto expansivo' },
  { letra: 'A', grupo: 'ADITIVO IMPERMEABILIZANTE', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chema 1 líquido y polvo, Chematop, Chema Techo' },
  { letra: 'A', grupo: 'ADITIVO INHIBIDOR DE LA CORROSIÓN', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Inhibidor de corrosión Chema galón' },
  { letra: 'A', grupo: 'ADITIVO PEGAMENTO Y ADHESIVO', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chemayolic pasta, blanco flexible, extrafuerte, Sanson' },
  { letra: 'A', grupo: 'ADITIVO PLASTIFICANTE', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chema Plast reductor de agua y plastificante' },
  { letra: 'A', grupo: 'ADITIVO SELLADOR', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Bellafragua sellador acrílico transparente' },
  { letra: 'A', grupo: 'ADITIVO SELLADOR DE JUNTAS', pagina: '3.17', tipo: 'MATERIAL', descripcion: 'Chema Junta Flex 100 FC cartucho y manga' },
  { letra: 'A', grupo: 'AGREGADOS Y CANTERA', pagina: '3.10', tipo: 'MATERIAL', descripcion: 'Arena gruesa, arena fina, piedra chancada 1/2", confitillo Rumiwasi' },
  { letra: 'A', grupo: 'ALQUILER DE ANDAMIOS ACROW CERTIFICADOS', pagina: '3.25', tipo: 'EQUIPO', descripcion: 'Cuerpo de andamio galvanizado Fimetsa tarifa diaria' },
  { letra: 'A', grupo: 'ANDAMIOS NORMADOS MULTIDIRECCIONALES', pagina: '3.16', tipo: 'EQUIPO', descripcion: 'Andamios MF48, plataformas perforadas, rodapiés Altos' },
  { letra: 'A', grupo: 'ASFALTO PRECIOS EX-PLANTA CONCHAN', pagina: '3.21', tipo: 'MATERIAL', descripcion: 'PEN 10/20, 40/50, 60/70, RC 70, RC 250, MC 30 Petroperu' },

  // B
  { letra: 'B', grupo: 'BOMBAS MULTIETAPAS TRIFASICAS', pagina: '3.14', tipo: 'EQUIPO', descripcion: 'Bombas Schneider 1.5HP a 7.5HP alta presión' },
  { letra: 'B', grupo: 'BARRAS DE SEGURIDAD', pagina: '3.31', tipo: 'MATERIAL', descripcion: 'Barras de apoyo discapacitados 12" a 36" y curvas' },
  { letra: 'B', grupo: 'BLOQUETAS DE CONCRETO', pagina: '3.13', tipo: 'MATERIAL', descripcion: 'Bloques lisos 19x19x39, 14x19x39, 12x19x39 Danobsa' },

  // C
  { letra: 'C', grupo: 'CALAMINAS DE ALUZINC', pagina: '3.8', tipo: 'MATERIAL', descripcion: 'Aluzinc ER4 recto y curvo 0.30mm a 0.40mm Cermetales' },
  { letra: 'C', grupo: 'CANALETAS', pagina: '3.26', tipo: 'MATERIAL', descripcion: 'Canaletas pluviales Matusita Tigre y Sodimac' },
  { letra: 'C', grupo: 'CANDADOS Y CANDADOS ARCO LARGO', pagina: '3.9', tipo: 'MATERIAL', descripcion: 'Candados Travex K25, K30, K40, K50, K60, K70' },
  { letra: 'C', grupo: 'CEMENTO PORTLAND Y GRANEL', pagina: '3.10', tipo: 'MATERIAL', descripcion: 'Sol, Andino Tipo I y V, Apu, Cemex, Quisqueya' },
  { letra: 'C', grupo: 'CERRADURAS TRAVEX (Perillas, Manijas, Trancas)', pagina: '3.9', tipo: 'MATERIAL', descripcion: 'Perillas principal, dormitorio, baño, sobreponer, trancas blindadas' },
  { letra: 'C', grupo: 'CHIMENEAS A GAS Y ELÉCTRICAS', pagina: '3.26', tipo: 'MATERIAL', descripcion: 'Modelos Rotonde Perú: Aspect, Relaxed, Focus, Duet' },
  { letra: 'C', grupo: 'COMPRESORAS DE AIRE', pagina: '3.26', tipo: 'EQUIPO', descripcion: 'Compresoras Hyundai 2HP a 3HP y tornillo 10HP a 20HP' },

  // E
  { letra: 'E', grupo: 'ELECTROBOMBAS SCHNEIDER', pagina: '3.13', tipo: 'EQUIPO', descripcion: 'Bombas centrífugas y sumergibles 0.5HP a 40HP Equipos y Redes' },
  { letra: 'E', grupo: 'EXTINTOR CONTRA INCENDIO', pagina: '3.5', tipo: 'EQUIPO', descripcion: 'Extintores PQS 1kg a 12kg, rodantes 50kg, CO2, A.B. Seguridad' },
  { letra: 'E', grupo: 'ESTRIBOS ARMADOS', pagina: '3.27', tipo: 'MATERIAL', descripcion: 'Estribos Aceros Arequipa 6mm y 3/8" medidas estándar' },

  // F
  { letra: 'F', grupo: 'FIERROS DE CONSTRUCCIÓN', pagina: '3.10', tipo: 'MATERIAL', descripcion: 'Fierro corrugado Arequipa 6mm a 1" precio puesto en obra' },
  { letra: 'F', grupo: 'FLUXÓMETROS Y URINARIOS', pagina: '3.31', tipo: 'MATERIAL', descripcion: 'Fluxómetros mecánicos y electrónicos para inodoro y urinario Vainsa' },
  { letra: 'F', grupo: 'FOCOS Y PANELES LED', pagina: '3.22', tipo: 'MATERIAL', descripcion: 'Focos LED 7W, 10W, 12W, paneles adosables y dicroicos Promart/Luminika' },

  // G
  { letra: 'G', grupo: 'GABINETE CONTRA INCENDIO', pagina: '3.5', tipo: 'EQUIPO', descripcion: 'Gabinetes 80x60x18cm con manguera 30m y pitón A.B. Seguridad' },
  { letra: 'G', grupo: 'GASFITERÍA Y CONEXIONES DE AGUA', pagina: '3.14', tipo: 'MATERIAL', descripcion: 'Reducciones, registros bronce/cromados, sumideros El Caribe' },
  { letra: 'G', grupo: 'GRIFERÍA DE BAÑO Y DUCHA', pagina: '3.18', tipo: 'MATERIAL', descripcion: 'Líneas Italgrif y Vainsa: lavatorio, mezcladoras 4", duchas monocomando' },

  // L
  { letra: 'L', grupo: 'LADRILLOS (KK, Pandereta, Techo)', pagina: '3.10', tipo: 'MATERIAL', descripcion: 'Lark, Delta, Lacasa, Sagitario, Pirámide, Inkaforte, Pro Home' },

  // M
  { letra: 'M', grupo: 'MADERA PARA CONSTRUCCIÓN', pagina: '3.20', tipo: 'MATERIAL', descripcion: 'Tablas, soleras, vigas almendro, puntales Maderera San Antonio' },
  { letra: 'M', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33', tipo: 'MANO_DE_OBRA', descripcion: 'Operario S/ 28.39/HH, Oficial S/ 22.33/HH, Peón S/ 20.22/HH con leyes sociales' },
  { letra: 'M', grupo: 'MAQUINARIA Y EQUIPO PESADO (TARIFAS ALQUILER)', pagina: '3.35', tipo: 'EQUIPO', descripcion: 'Cargadores, excavadoras, tractores, motoniveladoras, rodillos, volquetes' },

  // P
  { letra: 'P', grupo: 'PINTURAS LÁTEX, ESMALTES Y ANTICORROSIVOS', pagina: '3.25', tipo: 'MATERIAL', descripcion: 'American Colors, CPP, Tekno, Vencedor, Chema, Promart' },

  // T
  { letra: 'T', grupo: 'TUBERÍAS Y ACCESORIOS PVC / CPVC', pagina: '3.23', tipo: 'MATERIAL', descripcion: 'Agua fría SAP, CPVC caliente, desagüe SAL, luz SEL Nicoll/Pavco' },
];

// 5. CATÁLOGO COMPLETO DE INSUMOS, MATERIALES, MANO DE OBRA Y EQUIPOS
export const INSUMOS_PRECIOS: InsumoPrecio[] = [
  // --- A.B. SEGURIDAD (Pág. 3.5) ---
  { codigo: 'MAT-EXT-01', tipo: 'EQUIPO', descripcion: 'EXTINTOR C.I.POLVO QUIMICO SECO ABC 1 KG', unidad: 'PZA', precioSinIgv: 30.00, precioConIgv: 35.40, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'EXTINTOR CONTRA INCENDIO', pagina: '3.5' },
  { codigo: 'MAT-EXT-04', tipo: 'EQUIPO', descripcion: 'EXTINTOR C.I.POLVO QUIMICO SECO ABC 6 KG', unidad: 'PZA', precioSinIgv: 65.00, precioConIgv: 76.70, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'EXTINTOR CONTRA INCENDIO', pagina: '3.5' },
  { codigo: 'MAT-EXT-06', tipo: 'EQUIPO', descripcion: 'EXTINTOR C.I.POLVO QUIMICO SECO ABC 12 KG', unidad: 'PZA', precioSinIgv: 90.00, precioConIgv: 106.20, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'EXTINTOR CONTRA INCENDIO', pagina: '3.5' },
  { codigo: 'MAT-EXT-08', tipo: 'EQUIPO', descripcion: 'EXTINTOR C.I. GAS CARBONICO CO2 5 KG', unidad: 'PZA', precioSinIgv: 75.00, precioConIgv: 88.50, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'EXTINTOR CONTRA INCENDIO', pagina: '3.5' },
  { codigo: 'MAT-GAB-01', tipo: 'EQUIPO', descripcion: 'MANGUERA POLYESTER CON ACOPLES 1 1/2" 30M', unidad: 'UND', precioSinIgv: 180.00, precioConIgv: 212.40, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'GABINETE DE MANGUERA CONTRA INCENDIO', pagina: '3.5' },
  { codigo: 'MAT-GAB-02', tipo: 'EQUIPO', descripcion: 'PITÓN BRONCE CHORRO-NIEBLA 1 1/2" -95GPM M/GIACOMINI UL-FM', unidad: 'UND', precioSinIgv: 200.00, precioConIgv: 236.00, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'GABINETE DE MANGUERA CONTRA INCENDIO', pagina: '3.5' },
  { codigo: 'MAT-VAL-01', tipo: 'MATERIAL', descripcion: 'VALVULA ANGULAR BRONCE UL/FM 1 1/2" 300 PSI', unidad: 'PZA', precioSinIgv: 350.00, precioConIgv: 413.00, moneda: 'USD', proveedor: 'A.B. SEGURIDAD E.I.R.L.', grupo: 'LLAVES Y VÁLVULAS', pagina: '3.5' },

  // --- ACEROS ACRIMSA (Pág. 3.5 - 3.6) ---
  { codigo: 'PER-G2-01', tipo: 'MATERIAL', descripcion: 'PERNO HEXAG.ROSCA CORRIENTE G-2 1/2"X1/4" ZINCADO', unidad: 'CTO', precioSinIgv: 1.32, precioConIgv: 1.56, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'PERNOS Y FIJACIONES', pagina: '3.5' },
  { codigo: 'PER-G2-02', tipo: 'MATERIAL', descripcion: 'PERNO HEXAG.ROSCA CORRIENTE G-2 1"X1/2" ZINCADO', unidad: 'CTO', precioSinIgv: 8.80, precioConIgv: 10.38, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'PERNOS Y FIJACIONES', pagina: '3.5' },
  { codigo: 'PER-G2-03', tipo: 'MATERIAL', descripcion: 'PERNO HEXAG.ROSCA CORRIENTE G-2 2"X1/2" ZINCADO', unidad: 'CTO', precioSinIgv: 15.50, precioConIgv: 18.29, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'PERNOS Y FIJACIONES', pagina: '3.5' },
  { codigo: 'PER-G2-04', tipo: 'MATERIAL', descripcion: 'PERNO HEXAG.ROSCA CORRIENTE G-2 3"X1/2" ZINCADO', unidad: 'CTO', precioSinIgv: 21.80, precioConIgv: 25.72, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'PERNOS Y FIJACIONES', pagina: '3.5' },
  { codigo: 'ARA-PLA-01', tipo: 'MATERIAL', descripcion: 'ARANDELA ACERO GALVANIZADO 1/2"', unidad: 'CTO', precioSinIgv: 4.50, precioConIgv: 5.31, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'ARANDELAS', pagina: '3.6' },
  { codigo: 'TUE-HEX-01', tipo: 'MATERIAL', descripcion: 'TUERCA HEXAG.ROSCA CORRIENTE G-2 ZINCADO 1/2"', unidad: 'CTO', precioSinIgv: 3.80, precioConIgv: 4.48, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'TUERCAS', pagina: '3.6' },
  { codigo: 'VAR-ROS-01', tipo: 'MATERIAL', descripcion: 'VARILLA ROSCADA ZINC 1/2" X 1MT GRADO 2', unidad: 'PZA', precioSinIgv: 1.30, precioConIgv: 1.53, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'VARILLAS ROSCADAS', pagina: '3.6' },
  { codigo: 'VAR-ROS-02', tipo: 'MATERIAL', descripcion: 'VARILLA ROSCADA ZINC 5/8" X 1MT GRADO 2', unidad: 'PZA', precioSinIgv: 2.30, precioConIgv: 2.71, moneda: 'USD', proveedor: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', grupo: 'VARILLAS ROSCADAS', pagina: '3.6' },

  // --- ACEROS PROCESADOS - ACERO DECK (Pág. 3.6) ---
  { codigo: 'DEC-AD900-22', tipo: 'MATERIAL', descripcion: 'PLACA COLABORANTE ACERO-DECK AD 900 / E=0.76 MM CALIBRE 22', unidad: 'M2', precioSinIgv: 22.22, precioConIgv: 26.22, moneda: 'USD', proveedor: 'ACEROS PROCESADOS S.A.', grupo: 'PLACA COLABORANTE', pagina: '3.6' },
  { codigo: 'DEC-AD900-20', tipo: 'MATERIAL', descripcion: 'PLACA COLABORANTE ACERO-DECK AD 900 / E=0.90 MM CALIBRE 20', unidad: 'M2', precioSinIgv: 26.67, precioConIgv: 31.47, moneda: 'USD', proveedor: 'ACEROS PROCESADOS S.A.', grupo: 'PLACA COLABORANTE', pagina: '3.6' },
  { codigo: 'DEC-CON-01', tipo: 'MATERIAL', descripcion: 'CONECTORES DE CORTE ACERO NS-625/300 (5/8 X 3")', unidad: 'CTO', precioSinIgv: 180.53, precioConIgv: 213.03, moneda: 'USD', proveedor: 'ACEROS PROCESADOS S.A.', grupo: 'CONECTORES DE CORTE', pagina: '3.6' },

  // --- ACEROS Y FIERROS INDUSTRIALES (Pág. 3.6 - 3.7) ---
  { codigo: 'ANG-AC-01', tipo: 'MATERIAL', descripcion: 'ANGULO ACERO NEGRO IGUAL 1.1/2" X 1.1/2" X 3/16" X 6M', unidad: 'PZA', precioSinIgv: 84.50, precioConIgv: 99.71, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'PERFILES DE ACERO', pagina: '3.6' },
  { codigo: 'ANG-AC-02', tipo: 'MATERIAL', descripcion: 'ANGULO ACERO NEGRO IGUAL 2" X 2" X 1/4" X 6M', unidad: 'PZA', precioSinIgv: 152.33, precioConIgv: 179.75, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'PERFILES DE ACERO', pagina: '3.6' },
  { codigo: 'PLA-AC-01', tipo: 'MATERIAL', descripcion: 'PLATINA ACERO NEGRO 1" X 3/16" X 6 M', unidad: 'PZA', precioSinIgv: 39.80, precioConIgv: 46.96, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'PLATINAS DE ACERO', pagina: '3.6' },
  { codigo: 'PLA-AC-02', tipo: 'MATERIAL', descripcion: 'PLATINA ACERO NEGRO 2" X 1/4" X 6 M', unidad: 'PZA', precioSinIgv: 91.55, precioConIgv: 108.03, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'PLATINAS DE ACERO', pagina: '3.7' },
  { codigo: 'TUB-FN-01', tipo: 'MATERIAL', descripcion: 'TUBO ACERO NEGRO ELECTROS. CUADRADO 1 1/2" X 1.5 MM X 6 M', unidad: 'PZA', precioSinIgv: 63.19, precioConIgv: 74.56, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'TUBOS ESTRUCTURALES', pagina: '3.7' },
  { codigo: 'TUB-FN-02', tipo: 'MATERIAL', descripcion: 'TUBO ACERO NEGRO ELECTROS. CUADRADO 2" X 2.0 MM X 6 M', unidad: 'PZA', precioSinIgv: 94.58, precioConIgv: 111.60, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'TUBOS ESTRUCTURALES', pagina: '3.7' },
  { codigo: 'PLA-LAC-01', tipo: 'MATERIAL', descripcion: 'PLANCHA ACERO NEGRO LAC 6.0 X 1200 X 2400 MM (1/4")', unidad: 'PZA', precioSinIgv: 582.45, precioConIgv: 687.29, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'PLANCHAS DE ACERO', pagina: '3.7' },
  { codigo: 'SOL-CEL-01', tipo: 'MATERIAL', descripcion: 'SOLDADURA CELLOCORD P 1/8" E6010', unidad: 'KG', precioSinIgv: 21.36, precioConIgv: 25.20, proveedor: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', grupo: 'SOLDADURA', pagina: '3.7' },

  // --- ALLCI IMPORTADORA - LADRILLOS (Pág. 3.7) ---
  { codigo: 'LAD-KK-ALL', tipo: 'MATERIAL', descripcion: 'LADRILLO ARCILLA KING KONG 18 HUECOS 9X12.5X23CM', unidad: 'MLL', precioSinIgv: 593.22, precioConIgv: 700.00, proveedor: 'ALLCI IMPORTADORA', grupo: 'LADRILLOS', pagina: '3.7' },
  { codigo: 'LAD-PAN-ALL', tipo: 'MATERIAL', descripcion: 'LADRILLO ARCILLA PANDERETA 10X12X24CM', unidad: 'MLL', precioSinIgv: 279.66, precioConIgv: 330.00, proveedor: 'ALLCI IMPORTADORA', grupo: 'LADRILLOS', pagina: '3.7' },
  { codigo: 'LAD-TEC15-LARK', tipo: 'MATERIAL', descripcion: 'LADRILLO TECHO H 15x30 LARK', unidad: 'MLL', precioSinIgv: 1398.31, precioConIgv: 1650.00, proveedor: 'ALLCI IMPORTADORA', marca: 'Lark', grupo: 'LADRILLOS', pagina: '3.7' },
  { codigo: 'CEM-SOL-ALL', tipo: 'MATERIAL', descripcion: 'CEMENTO SOL TIPO I (BOLSA 42.5 KG)', unidad: 'BLS', precioSinIgv: 24.41, precioConIgv: 28.80, proveedor: 'ALLCI IMPORTADORA', marca: 'Sol', grupo: 'CEMENTO', pagina: '3.7' },
  { codigo: 'FIE-AA-12', tipo: 'MATERIAL', descripcion: 'BARRAS DE ACERO 1/2" ACEROS AREQUIPA (VARILLA 9M)', unidad: 'VAR', precioSinIgv: 9.14, precioConIgv: 10.79, moneda: 'USD', proveedor: 'ALLCI IMPORTADORA', marca: 'Aceros Arequipa', grupo: 'FIERROS DE CONSTRUCCIÓN', pagina: '3.7' },
  { codigo: 'FIE-AA-58', tipo: 'MATERIAL', descripcion: 'BARRAS DE ACERO 5/8" ACEROS AREQUIPA (VARILLA 9M)', unidad: 'VAR', precioSinIgv: 14.13, precioConIgv: 16.67, moneda: 'USD', proveedor: 'ALLCI IMPORTADORA', marca: 'Aceros Arequipa', grupo: 'FIERROS DE CONSTRUCCIÓN', pagina: '3.7' },
  { codigo: 'FIE-AA-38', tipo: 'MATERIAL', descripcion: 'BARRAS DE ACERO 3/8" ACEROS AREQUIPA (VARILLA 9M)', unidad: 'VAR', precioSinIgv: 5.09, precioConIgv: 6.01, moneda: 'USD', proveedor: 'ALLCI IMPORTADORA', marca: 'Aceros Arequipa', grupo: 'FIERROS DE CONSTRUCCIÓN', pagina: '3.7' },

  // --- BLANCO INGENIEROS - ADITIVOS (Pág. 3.8) ---
  { codigo: 'ADI-BLA-01', tipo: 'MATERIAL', descripcion: 'DESENCOFRANTE PARA MADERA (1GL), T-KOTE', unidad: 'GAL', precioSinIgv: 36.75, precioConIgv: 43.37, proveedor: 'BLANCO INGENIEROS S.R.L.', grupo: 'ADITIVO DESMOLDANTE', pagina: '3.8' },
  { codigo: 'ADI-BLA-02', tipo: 'MATERIAL', descripcion: 'ADITIVO ACELERANTE P/CONCRETO CON CLORURO 1GL-FRITZ', unidad: 'GAL', precioSinIgv: 36.75, precioConIgv: 43.37, proveedor: 'BLANCO INGENIEROS S.R.L.', grupo: 'ADITIVO ACELERANTE', pagina: '3.8' },
  { codigo: 'ADI-BLA-03', tipo: 'MATERIAL', descripcion: 'ADITIVO CURADOR P/CONCRETO LIQUIDO 1GAL - KYTASOL', unidad: 'GAL', precioSinIgv: 26.25, precioConIgv: 30.98, proveedor: 'BLANCO INGENIEROS S.R.L.', grupo: 'ADITIVO CURADOR', pagina: '3.8' },
  { codigo: 'ADI-BLA-04', tipo: 'MATERIAL', descripcion: 'SELLO P/JUNTAS ELASTOMERICO 1GAL - ECOSEAL', unidad: 'GAL', precioSinIgv: 126.00, precioConIgv: 148.68, proveedor: 'BLANCO INGENIEROS S.R.L.', grupo: 'SELLADOR DE JUNTAS', pagina: '3.8' },
  { codigo: 'ADI-BLA-05', tipo: 'MATERIAL', descripcion: 'IMPERMEABILIZANTE DE CONCRETO Y TARRAJEOS IMPERTOP FLEXIBLE (5GL)', unidad: 'GAL', precioSinIgv: 288.75, precioConIgv: 340.73, proveedor: 'BLANCO INGENIEROS S.R.L.', grupo: 'IMPERMEABILIZANTE', pagina: '3.8' },

  // --- CERMETALES - CALAMINAS ALUZINC (Pág. 3.8) ---
  { codigo: 'CAL-ER4-30', tipo: 'MATERIAL', descripcion: 'CALAMINA ALUZINC NATURAL MODELO ER4 RECTO E= 0.30 MM ANCHO UTIL 1.00M', unidad: 'M2', precioSinIgv: 11.02, precioConIgv: 13.00, proveedor: 'CERMETALES SAC', grupo: 'CALAMINAS DE ALUZINC', pagina: '3.8' },
  { codigo: 'CAL-ER4-40', tipo: 'MATERIAL', descripcion: 'CALAMINA ALUZINC NATURAL MODELO ER4 RECTO E= 0.40 MM ANCHO UTIL 1.00M', unidad: 'M2', precioSinIgv: 14.83, precioConIgv: 17.50, proveedor: 'CERMETALES SAC', grupo: 'CALAMINAS DE ALUZINC', pagina: '3.8' },
  { codigo: 'DRY-PAR-38', tipo: 'MATERIAL', descripcion: 'PARANTE METALICO DRYWALL 38X 0.45 MM X 3M', unidad: 'PZA', precioSinIgv: 6.57, precioConIgv: 7.75, proveedor: 'CERMETALES SAC', grupo: 'PARANTES DRYWALL', pagina: '3.8' },
  { codigo: 'DRY-PAR-64', tipo: 'MATERIAL', descripcion: 'PARANTE METALICO DRYWALL 64X 0.45 MM X 3M', unidad: 'PZA', precioSinIgv: 7.75, precioConIgv: 9.15, proveedor: 'CERMETALES SAC', grupo: 'PARANTES DRYWALL', pagina: '3.9' },
  { codigo: 'DRY-RIE-65', tipo: 'MATERIAL', descripcion: 'RIEL METALICO DRYWALL 65 X 0.45 MM X 3M', unidad: 'PZA', precioSinIgv: 6.06, precioConIgv: 7.15, proveedor: 'CERMETALES SAC', grupo: 'RIELES DRYWALL', pagina: '3.9' },

  // --- CERRADURAS TRAVEX (Pág. 3.9) ---
  { codigo: 'CER-TRA-01', tipo: 'MATERIAL', descripcion: 'CERRADURA DE PERILLA P/PUERTA PPAL ACERO INOXIDABLE GR 2 TRAVEX COMPACTO', unidad: 'PZA', precioSinIgv: 55.00, precioConIgv: 64.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-02', tipo: 'MATERIAL', descripcion: 'CERRADURAS PERILLA P/DORMITORIO - OFICINA ACERO INOX. GRADO 2 TRAVEX', unidad: 'PZA', precioSinIgv: 38.90, precioConIgv: 45.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-03', tipo: 'MATERIAL', descripcion: 'CERRADURA PERILLA P/BAÑO ACERO INOX. GRADO 2 TRAVEX COMPACTO', unidad: 'PZA', precioSinIgv: 35.51, precioConIgv: 41.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-04', tipo: 'MATERIAL', descripcion: 'CERRADURAS SOBREPONER P/EXTERIOR TRAVEX MOD 111 DOS GOLPES CERROJO BRONCE', unidad: 'PZA', precioSinIgv: 53.31, precioConIgv: 62.91, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-05', tipo: 'MATERIAL', descripcion: 'CERRADURAS SOBREPONER P/EXTERIOR TRAVEX MOD 333 TRES GOLPES CERROJO PIVOTES', unidad: 'PZA', precioSinIgv: 46.53, precioConIgv: 54.91, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-06', tipo: 'MATERIAL', descripcion: 'CERRADURAS SOBREPONER P/EXTERIOR TRAVEX MOD 960 TRES GOLPES 2 BARROTES BLINDADA', unidad: 'PZA', precioSinIgv: 50.76, precioConIgv: 59.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-07', tipo: 'MATERIAL', descripcion: 'CERRADURA TRANCA P/EXTERIOR TRAVEX MOD. T800 DE ALTA SEGURIDAD', unidad: 'PZA', precioSinIgv: 141.44, precioConIgv: 166.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-08', tipo: 'MATERIAL', descripcion: 'CERRADURA DE MANIJA ACERO INOXIDABLE GRADO 3 TRAVEX MOD. 808 SS', unidad: 'PZA', precioSinIgv: 61.44, precioConIgv: 72.50, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-TRA-09', tipo: 'MATERIAL', descripcion: 'CERRADURA P/PUERTA ELECTRICA C/BOTON MOD 1000E TRAVEX', unidad: 'PZA', precioSinIgv: 118.56, precioConIgv: 139.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CERRADURAS TRAVEX', pagina: '3.9' },
  { codigo: 'CER-CAN-01', tipo: 'MATERIAL', descripcion: 'CANDADO TRAVEX K50', unidad: 'PZA', precioSinIgv: 22.63, precioConIgv: 26.70, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CANDADOS', pagina: '3.9' },
  { codigo: 'CER-CAN-02', tipo: 'MATERIAL', descripcion: 'CANDADO K50 ARCO LARGO TRAVEX', unidad: 'PZA', precioSinIgv: 40.59, precioConIgv: 47.90, proveedor: 'CERRADURAS NACIONALES S.A.C.', marca: 'Travex', grupo: 'CANDADOS', pagina: '3.10' },

  // --- COMERCIALIZADORA RUMIWASI (Pág. 3.10) ---
  { codigo: 'AGR-ARE-01', tipo: 'MATERIAL', descripcion: 'ARENA GRUESA 1 M3 TOPEX', unidad: 'M3', precioSinIgv: 49.15, precioConIgv: 58.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', grupo: 'AGREGADOS', pagina: '3.10' },
  { codigo: 'AGR-PIE-01', tipo: 'MATERIAL', descripcion: 'PIEDRA CHANCADA DE 1/2" - 3/4" HUSO 67', unidad: 'M3', precioSinIgv: 55.08, precioConIgv: 65.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', grupo: 'AGREGADOS', pagina: '3.10' },
  { codigo: 'AGR-FIN-01', tipo: 'MATERIAL', descripcion: 'ARENA FINA SAN JUAN 1 M3', unidad: 'M3', precioSinIgv: 50.85, precioConIgv: 60.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', grupo: 'AGREGADOS', pagina: '3.10' },
  { codigo: 'LAD-KK-LARK', tipo: 'MATERIAL', descripcion: 'LADRILLO KING KONG 18 HUECOS LARK', unidad: 'MLL', precioSinIgv: 652.54, precioConIgv: 770.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Lark', grupo: 'LADRILLOS', pagina: '3.10' },
  { codigo: 'LAD-PAN-LARK', tipo: 'MATERIAL', descripcion: 'LADRILLO PANDERETA RAYAS LARK', unidad: 'MLL', precioSinIgv: 500.00, precioConIgv: 590.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Lark', grupo: 'LADRILLOS', pagina: '3.10' },
  { codigo: 'CEM-SOL-RUM', tipo: 'MATERIAL', descripcion: 'CEMENTO PORTLAND TIPO I (BLS 42.5 KG) EL SOL', unidad: 'BLS', precioSinIgv: 25.00, precioConIgv: 29.50, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Sol', grupo: 'CEMENTO', pagina: '3.10' },
  { codigo: 'CEM-AND-RUM', tipo: 'MATERIAL', descripcion: 'CEMENTO ANDINO TIPO I (BLS 42.5 KG)', unidad: 'BLS', precioSinIgv: 26.27, precioConIgv: 31.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Andino', grupo: 'CEMENTO', pagina: '3.10' },
  { codigo: 'TUB-DES-01', tipo: 'MATERIAL', descripcion: 'TUBO PVC DESAGUE SAL 2" X 3 M PAVCO', unidad: 'PZA', precioSinIgv: 13.47, precioConIgv: 15.89, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Pavco', grupo: 'TUBOS DE DESAGUE', pagina: '3.10' },
  { codigo: 'TUB-DES-02', tipo: 'MATERIAL', descripcion: 'TUBO PVC DESAGUE SAL 4" X 3 M PAVCO', unidad: 'PZA', precioSinIgv: 29.24, precioConIgv: 34.50, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Pavco', grupo: 'TUBOS DE DESAGUE', pagina: '3.10' },
  { codigo: 'TUB-AGU-01', tipo: 'MATERIAL', descripcion: 'TUBO PVC AGUA ROSCADO CLASE 7.5 1/2" X 5M PAVCO', unidad: 'PZA', precioSinIgv: 17.37, precioConIgv: 20.50, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Pavco', grupo: 'TUBOS DE AGUA', pagina: '3.10' },
  { codigo: 'TUB-AGU-02', tipo: 'MATERIAL', descripcion: 'TUBO CPVC AGUA CALIENTE S.P. 1/2" X 5 M PAVCO', unidad: 'PZA', precioSinIgv: 22.03, precioConIgv: 26.00, proveedor: 'COMERCIALIZADORA RUMIWASI SAC', marca: 'Pavco', grupo: 'TUBOS DE AGUA', pagina: '3.10' },

  // --- CHEMA / ITICSA (Pág. 3.17) ---
  { codigo: 'CHE-CH1-GL', tipo: 'MATERIAL', descripcion: 'ADITIVO IMPERMEABILIZANTE INTEGRAL LIQUIDO 1GAL - CHEMA 1', unidad: 'GAL', precioSinIgv: 24.14, precioConIgv: 28.49, proveedor: 'ITICSA (CHEMA)', marca: 'Chema 1', grupo: 'ADITIVO IMPERMEABILIZANTE', pagina: '3.17' },
  { codigo: 'CHE-CH3-5GL', tipo: 'MATERIAL', descripcion: 'ADITIVO ACELERANTE DE FRAGUA CHEMA 3 - BIDON 5 GALONES', unidad: 'GAL', precioSinIgv: 132.12, precioConIgv: 155.90, proveedor: 'ITICSA (CHEMA)', marca: 'Chema 3', grupo: 'ADITIVO ACELERANTE', pagina: '3.17' },
  { codigo: 'CHE-TEC-GL', tipo: 'MATERIAL', descripcion: 'IMPERMEABILIZANTE CHEMA TECHO BLANCO HUESO - GALON', unidad: 'GAL', precioSinIgv: 73.74, precioConIgv: 87.01, proveedor: 'ITICSA (CHEMA)', marca: 'Chema Techo', grupo: 'IMPERMEABILIZANTE', pagina: '3.17' },
  { codigo: 'CHE-MAY-25', tipo: 'MATERIAL', descripcion: 'PEGAMENTO CHEMAYOLIC BLANCO FLEXIBLE - 25 KG', unidad: 'BLS', precioSinIgv: 45.66, precioConIgv: 53.88, proveedor: 'ITICSA (CHEMA)', marca: 'Chemayolic', grupo: 'PEGAMENTO', pagina: '3.17' },
  { codigo: 'CHE-EXT-25', tipo: 'MATERIAL', descripcion: 'PEGAMENTO CHEMAYOLIC EXTRAFUERTE - 25 KG', unidad: 'BLS', precioSinIgv: 36.35, precioConIgv: 42.89, proveedor: 'ITICSA (CHEMA)', marca: 'Chemayolic', grupo: 'PEGAMENTO', pagina: '3.17' },
  { codigo: 'CHE-JUN-300', tipo: 'MATERIAL', descripcion: 'ADHESIVO Y SELLANTE DE JUNTAS CHEMA JUNTA FLEX 100 FC GRIS (300 ML)', unidad: 'L', precioSinIgv: 29.45, precioConIgv: 34.75, proveedor: 'ITICSA (CHEMA)', marca: 'Junta Flex', grupo: 'SELLADOR DE JUNTAS', pagina: '3.17' },
  { codigo: 'CHE-GRO-25', tipo: 'MATERIAL', descripcion: 'MORTERO EXPANSIVO GROUT CHEMA - BOLSA 25 KG', unidad: 'KG', precioSinIgv: 67.75, precioConIgv: 79.95, proveedor: 'ITICSA (CHEMA)', marca: 'Chema Grout', grupo: 'MORTERO AUTONIVELANTE', pagina: '3.17' },

  // --- INDUSTRIAS TECNOPOR (Pág. 3.17 - 3.18) ---
  { codigo: 'TEC-PLA-1', tipo: 'MATERIAL', descripcion: 'PLANCHA POLIESTIRENO EXPANDIDO 1" 2.44 X 1.22 M D=25 KG/M3', unidad: 'PZA', precioSinIgv: 10.17, precioConIgv: 12.00, proveedor: 'INDUSTRIAS TECNOPOR S.A.C.', grupo: 'PLANCHA TERMOPOR', pagina: '3.17' },
  { codigo: 'TEC-PLA-2', tipo: 'MATERIAL', descripcion: 'PLANCHA POLIESTIRENO EXPANDIDO 2" 2.44 X 1.22 M D=21 KG/M3', unidad: 'PZA', precioSinIgv: 20.34, precioConIgv: 24.00, proveedor: 'INDUSTRIAS TECNOPOR S.A.C.', grupo: 'PLANCHA TERMOPOR', pagina: '3.17' },
  { codigo: 'TEC-PLA-4', tipo: 'MATERIAL', descripcion: 'PLANCHA POLIESTIRENO EXPANDIDO 4" 2.44 X 1.22 M D=21 KG/M3', unidad: 'PZA', precioSinIgv: 140.00, precioConIgv: 165.20, proveedor: 'INDUSTRIAS TECNOPOR S.A.C.', grupo: 'PLANCHA TERMOPOR', pagina: '3.17' },

  // --- ITALGRIF / VAINSA (Pág. 3.18 - 3.19 y 3.29 - 3.31) ---
  { codigo: 'ITA-LAV-01', tipo: 'MATERIAL', descripcion: 'LLAVE DE LAVATORIO PESADA LINEA BUZIOS CROMADA ITALGRIF', unidad: 'PZA', precioSinIgv: 46.53, precioConIgv: 54.91, proveedor: 'ITALGRIF - VSI INDUSTRIAL', marca: 'Italgrif', grupo: 'GRIFERÍA DE BAÑO', pagina: '3.18' },
  { codigo: 'ITA-LAV-02', tipo: 'MATERIAL', descripcion: 'LLAVE DE LAVATORIO ALTA MINIMALISTA LINEA BUZIOS LEVER CROMADA', unidad: 'PZA', precioSinIgv: 249.07, precioConIgv: 293.90, proveedor: 'ITALGRIF - VSI INDUSTRIAL', marca: 'Italgrif', grupo: 'GRIFERÍA DE BAÑO', pagina: '3.18' },
  { codigo: 'ITA-MEZ-01', tipo: 'MATERIAL', descripcion: 'MEZCLADORA DE 4" PARA LAVATORIO LINEA CABO BLANCO BRONCE CROMADA', unidad: 'PZA', precioSinIgv: 187.20, precioConIgv: 220.90, proveedor: 'ITALGRIF - VSI INDUSTRIAL', marca: 'Italgrif', grupo: 'GRIFERÍA DE BAÑO - MEZCLADORAS', pagina: '3.19' },
  { codigo: 'ITA-MEZ-02', tipo: 'MATERIAL', descripcion: 'MEZCLADORA PARA LAVATORIO MONOCOMANDO LINEA BUZIOS LEVER', unidad: 'PZA', precioSinIgv: 305.90, precioConIgv: 360.96, proveedor: 'ITALGRIF - VSI INDUSTRIAL', marca: 'Italgrif', grupo: 'GRIFERÍA DE BAÑO - MEZCLADORAS', pagina: '3.19' },
  { codigo: 'ITA-SAN-01', tipo: 'MATERIAL', descripcion: 'INODORO ONE PIECE ACAPULCO BLANCO INTEGRADO ASIENTO CAÍDA LENTA', unidad: 'PZA', precioSinIgv: 427.88, precioConIgv: 504.90, proveedor: 'ITALGRIF - VSI INDUSTRIAL', marca: 'Italgrif', grupo: 'SANITARIOS', pagina: '3.19' },
  { codigo: 'VAI-SAN-01', tipo: 'MATERIAL', descripcion: 'ONE PIECE BALI BLANCO CON ASIENTO Y ACCESORIOS VAINSA', unidad: 'PZA', precioSinIgv: 495.68, precioConIgv: 584.90, proveedor: 'VAINSA - VSI INDUSTRIAL', marca: 'Vainsa', grupo: 'SANITARIOS', pagina: '3.29' },
  { codigo: 'VAI-SAN-02', tipo: 'MATERIAL', descripcion: 'ONE PIECE GLAMOUR BLANCO CON ASIENTO SOFT CLOSE VAINSA', unidad: 'PZA', precioSinIgv: 1101.61, precioConIgv: 1299.90, proveedor: 'VAINSA - VSI INDUSTRIAL', marca: 'Vainsa', grupo: 'SANITARIOS', pagina: '3.29' },
  { codigo: 'VAI-MEZ-01', tipo: 'MATERIAL', descripcion: 'MEZCLADORA DE DUCHA MONOCOMANDO CON SALIDA AQUARIUS VAINSA', unidad: 'PZA', precioSinIgv: 268.56, precioConIgv: 316.90, proveedor: 'VAINSA - VSI INDUSTRIAL', marca: 'Vainsa', grupo: 'GRIFERÍA DE DUCHA', pagina: '3.30' },
  { codigo: 'VAI-FLU-01', tipo: 'MATERIAL', descripcion: 'FLUXÓMETRO MECÁNICO 4.8L INODORO DESCARGA DIRECTA BOTÓN CROMADO VAINSA', unidad: 'PZA', precioSinIgv: 608.39, precioConIgv: 717.90, proveedor: 'VAINSA - VSI INDUSTRIAL', marca: 'Vainsa', grupo: 'FLUXÓMETROS', pagina: '3.31' },

  // --- MADERERA SAN ANTONIO (Pág. 3.20) ---
  { codigo: 'MAD-TAB-01', tipo: 'MATERIAL', descripcion: 'TABLA 1"X20CMX3M PINO / MADERA CORRIENTE', unidad: 'PZA', precioSinIgv: 17.50, precioConIgv: 20.65, proveedor: 'MADERERA SAN ANTONIO', grupo: 'TABLAS PARA CONSTRUCCIÓN', pagina: '3.20' },
  { codigo: 'MAD-SOL-01', tipo: 'MATERIAL', descripcion: 'SOLERA 2"X3"X3M MADERA PARA CONSTRUCCIÓN', unidad: 'P2', precioSinIgv: 16.00, precioConIgv: 18.88, proveedor: 'MADERERA SAN ANTONIO', grupo: 'SOLERAS', pagina: '3.20' },
  { codigo: 'MAD-PUN-01', tipo: 'MATERIAL', descripcion: 'PUNTAL PALO REDONDO 3M (2.5"-3")', unidad: 'UND', precioSinIgv: 7.70, precioConIgv: 9.09, proveedor: 'MADERERA SAN ANTONIO', grupo: 'PUNTALES', pagina: '3.20' },
  { codigo: 'MAD-FEN-01', tipo: 'MATERIAL', descripcion: 'TRIPLAY FENOLICO PREMIUM 18MM 1.22X2.44M', unidad: 'UND', precioSinIgv: 75.00, precioConIgv: 88.50, proveedor: 'MADERERA SAN ANTONIO', grupo: 'TABLEROS FENOLICOS', pagina: '3.20' },
  { codigo: 'MAD-OSB-01', tipo: 'MATERIAL', descripcion: 'TABLERO OSB 1.22X2.44M X 15MM', unidad: 'UND', precioSinIgv: 81.00, precioConIgv: 95.58, proveedor: 'MADERERA SAN ANTONIO', grupo: 'TABLEROS OSB', pagina: '3.20' },

  // --- PROMART ELECTRICIDAD & PINTURAS (Pág. 3.22 - 3.25) ---
  { codigo: 'ELE-CAB-12', tipo: 'MATERIAL', descripcion: 'CABLE THW 12AWG ROJO X ROLLO 100M CENTELSA', unidad: 'RLL', precioSinIgv: 219.49, precioConIgv: 259.00, proveedor: 'PROMART - ELECTRICIDAD', marca: 'Centelsa', grupo: 'CABLES ELÉCTRICOS', pagina: '3.22' },
  { codigo: 'ELE-CAB-14', tipo: 'MATERIAL', descripcion: 'CABLE THW 14AWG AZUL X ROLLO 100M CENTELSA', unidad: 'RLL', precioSinIgv: 143.22, precioConIgv: 169.00, proveedor: 'PROMART - ELECTRICIDAD', marca: 'Centelsa', grupo: 'CABLES ELÉCTRICOS', pagina: '3.22' },
  { codigo: 'ELE-TER-2X32', tipo: 'MATERIAL', descripcion: 'INTERRUPTOR TERMOMAGNÉTICO 2X32A 220V-10KA BTICINO', unidad: 'PZA', precioSinIgv: 38.05, precioConIgv: 44.90, proveedor: 'PROMART - ELECTRICIDAD', marca: 'Bticino', grupo: 'INTERRUPTORES TERMOMAGNETICOS', pagina: '3.22' },
  { codigo: 'ELE-TER-2X63', tipo: 'MATERIAL', descripcion: 'INTERRUPTOR TERMOMAGNÉTICO 2X63A 220V-10KA BTICINO', unidad: 'PZA', precioSinIgv: 72.12, precioConIgv: 85.10, proveedor: 'PROMART - ELECTRICIDAD', marca: 'Bticino', grupo: 'INTERRUPTORES TERMOMAGNETICOS', pagina: '3.22' },
  { codigo: 'ELE-TOM-01', tipo: 'MATERIAL', descripcion: 'TOMACORRIENTE DOBLE CON TOMA A TIERRA MODUS STYLE BTICINO', unidad: 'PZA', precioSinIgv: 16.86, precioConIgv: 19.89, proveedor: 'PROMART - ELECTRICIDAD', marca: 'Bticino', grupo: 'TOMACORRIENTES', pagina: '3.24' },
  { codigo: 'PIN-AME-BLA', tipo: 'MATERIAL', descripcion: 'PINTURA LÁTEX PREMIUM SATINADA BLANCO 4 LITROS AMERICAN COLORS', unidad: 'BALDE', precioSinIgv: 61.95, precioConIgv: 73.10, proveedor: 'PROMART - PINTURAS', marca: 'American Colors', grupo: 'PINTURAS LÁTEX', pagina: '3.25' },
  { codigo: 'PIN-CPP-PAT', tipo: 'MATERIAL', descripcion: 'PINTURA LÁTEX SUPERMATE ANTIBACTERIAL BLANCO 4 LITROS CPP', unidad: 'BALDE', precioSinIgv: 51.19, precioConIgv: 60.40, proveedor: 'PROMART - PINTURAS', marca: 'CPP', grupo: 'PINTURAS LÁTEX', pagina: '3.25' },

  // --- SODIMAC (Pág. 3.26 - 3.28) ---
  { codigo: 'SOD-CEM-YUR', tipo: 'MATERIAL', descripcion: 'CEMENTO TIPO I P 42.5 KG YURA', unidad: 'BLS', precioSinIgv: 27.00, precioConIgv: 31.86, proveedor: 'SODIMAC S.A.', marca: 'Yura', grupo: 'CEMENTOS', pagina: '3.26' },
  { codigo: 'SOD-CEM-PAC', tipo: 'MATERIAL', descripcion: 'CEMENTO EXTRAFORTE 42.5 KG PACASMAYO', unidad: 'BLS', precioSinIgv: 26.10, precioConIgv: 30.80, proveedor: 'SODIMAC S.A.', marca: 'Pacasmayo', grupo: 'CEMENTOS', pagina: '3.26' },
  { codigo: 'SOD-POL-105', tipo: 'MATERIAL', descripcion: 'PLANCHA ALVEOLAR POLICARBONATO CLEAR 6 MM 5.80 X 2.10M POLYARQ', unidad: 'PZA', precioSinIgv: 372.80, precioConIgv: 439.90, proveedor: 'SODIMAC S.A.', grupo: 'POLICARBONATO', pagina: '3.27' },
  { codigo: 'SOD-FIB-01', tipo: 'MATERIAL', descripcion: 'TEJA ANDINA FIBROCEMENTO 5MM 1.14 X 0.72 M ARCILLA ETERNIT', unidad: 'PZA', precioSinIgv: 34.92, precioConIgv: 41.21, proveedor: 'SODIMAC S.A.', marca: 'Eternit', grupo: 'TECHO DE FIBROCEMENTO', pagina: '3.27' },
  { codigo: 'SOD-MEL-BLA', tipo: 'MATERIAL', descripcion: 'TABLERO DE MELAMINA BLANCO 18 MM 2.15 X 2.44 M VESTO', unidad: 'UND', precioSinIgv: 139.75, precioConIgv: 164.91, proveedor: 'SODIMAC S.A.', marca: 'Vesto', grupo: 'MELAMINAS', pagina: '3.28' },

  // --- MANO DE OBRA CONSTRUCCIÓN CIVIL - CAPECO (Pág. 3.33) ---
  { codigo: 'MO-OPE-HH', tipo: 'MANO_DE_OBRA', descripcion: 'OPERARIO DE CONSTRUCCIÓN CIVIL (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 28.39, precioConIgv: 28.39, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },
  { codigo: 'MO-OFI-HH', tipo: 'MANO_DE_OBRA', descripcion: 'OFICIAL DE CONSTRUCCIÓN CIVIL (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 22.33, precioConIgv: 22.33, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },
  { codigo: 'MO-PEO-HH', tipo: 'MANO_DE_OBRA', descripcion: 'PEÓN DE CONSTRUCCIÓN CIVIL (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 20.22, precioConIgv: 20.22, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },
  { codigo: 'MO-CAP-HH', tipo: 'MANO_DE_OBRA', descripcion: 'CAPATAZ DE CUADRILLA (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 34.07, precioConIgv: 34.07, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },
  { codigo: 'MO-OPE-DH', tipo: 'MANO_DE_OBRA', descripcion: 'OPERARIO DE CONSTRUCCIÓN CIVIL (COSTO DÍA HOMBRE 8H)', unidad: 'DH', precioSinIgv: 227.13, precioConIgv: 227.13, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },
  { codigo: 'MO-OFI-DH', tipo: 'MANO_DE_OBRA', descripcion: 'OFICIAL DE CONSTRUCCIÓN CIVIL (COSTO DÍA HOMBRE 8H)', unidad: 'DH', precioSinIgv: 178.66, precioConIgv: 178.66, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },
  { codigo: 'MO-PEO-DH', tipo: 'MANO_DE_OBRA', descripcion: 'PEÓN DE CONSTRUCCIÓN CIVIL (COSTO DÍA HOMBRE 8H)', unidad: 'DH', precioSinIgv: 161.75, precioConIgv: 161.75, proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL (CAPECO)', pagina: '3.33' },

  // --- TARIFA ALQUILER MAQUINARIA Y EQUIPOS (Pág. 3.35 - 3.36) ---
  { codigo: 'MAQ-RET-62', tipo: 'EQUIPO', descripcion: 'CARGADOR RETROEXCAVADOR 62 HP 1.0 YD3 (TARIFA HORA)', unidad: 'HM', precioSinIgv: 170.35, precioConIgv: 201.01, proveedor: 'COSTOS PERÚ', grupo: 'ALQUILER MAQUINARIA PESADA', pagina: '3.35' },
  { codigo: 'MAQ-CAR-115', tipo: 'EQUIPO', descripcion: 'CARGADOR SOBRE LLANTAS 100-115 HP 2.0-2.35 YD3', unidad: 'HM', precioSinIgv: 220.18, precioConIgv: 259.81, proveedor: 'COSTOS PERÚ', grupo: 'ALQUILER MAQUINARIA PESADA', pagina: '3.35' },
  { codigo: 'MAQ-EXC-165', tipo: 'EQUIPO', descripcion: 'EXCAVADORA SOBRE ORUGAS 115-165 HP 0.75-1.6 YD3', unidad: 'HM', precioSinIgv: 325.24, precioConIgv: 383.78, proveedor: 'COSTOS PERÚ', grupo: 'ALQUILER MAQUINARIA PESADA', pagina: '3.35' },
  { codigo: 'MAQ-TRA-160', tipo: 'EQUIPO', descripcion: 'TRACTOR SOBRE ORUGAS 140-160 HP', unidad: 'HM', precioSinIgv: 363.40, precioConIgv: 428.81, proveedor: 'COSTOS PERÚ', grupo: 'ALQUILER MAQUINARIA PESADA', pagina: '3.35' },
  { codigo: 'MAQ-ROD-100', tipo: 'EQUIPO', descripcion: 'RODILLO VIB. LISO AUTOPROPULSADO 70-100 HP 7-9 TON', unidad: 'HM', precioSinIgv: 147.08, precioConIgv: 173.55, proveedor: 'COSTOS PERÚ', grupo: 'EQUIPOS DE COMPACTACIÓN', pagina: '3.35' },
  { codigo: 'MAQ-VOL-15', tipo: 'EQUIPO', descripcion: 'CAMIÓN VOLQUETE 6 X 4 330 HP 15 M3', unidad: 'HM', precioSinIgv: 397.63, precioConIgv: 469.20, proveedor: 'COSTOS PERÚ', grupo: 'VEHÍCULOS Y CAMIONES', pagina: '3.36' },
  { codigo: 'MAQ-CIS-2000', tipo: 'EQUIPO', descripcion: 'CAMION CISTERNA 4 x 2 (AGUA) 145-165 HP 2000 GLN', unidad: 'HM', precioSinIgv: 216.79, precioConIgv: 255.81, proveedor: 'COSTOS PERÚ', grupo: 'VEHÍCULOS Y CAMIONES', pagina: '3.36' },
  { codigo: 'MAQ-MEZ-9P3', tipo: 'EQUIPO', descripcion: 'MEZCLADORA CONCRETO TIPO TROMPO 8 HP 9 P3', unidad: 'HM', precioSinIgv: 4.42, precioConIgv: 5.22, proveedor: 'COSTOS PERÚ', grupo: 'EQUIPOS DE CONCRETO', pagina: '3.36' },
  { codigo: 'MAQ-MOT-135', tipo: 'EQUIPO', descripcion: 'MOTONIVELADORA 130-135 HP', unidad: 'HM', precioSinIgv: 266.60, precioConIgv: 314.59, proveedor: 'COSTOS PERÚ', grupo: 'ALQUILER MAQUINARIA PESADA', pagina: '3.36' },
];

// 6. ANÁLISIS DE PRECIOS UNITARIOS (APU) - PÁGINAS 2.1 A 2.4
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

// 7. DIRECTORIO DE PROVEEDORES DEL SECTOR CONSTRUCCIÓN (PÁGINAS 3.3 Y 3.4)
export const PROVEEDORES_DIRECTORIO: ProveedorInfo[] = [
  { nombre: 'A.B. SEGURIDAD E.I.R.L.', pagina: '3.5', direccion: 'Gonzales Prada 473 - Surquillo', telefono: '445 0232 / 241 4928', email: 'ventas@abseguridad-peru.com' },
  { nombre: 'ACEROS INDUSTRIALES ACRIMSA S.A.C.', pagina: '3.5', direccion: 'Mariscal Luzuriaga 533 – Jesús María / Av. Colonial 1877 Lima', telefono: '423 1599 / 423 6888', celular: '998 358 405', email: 'ventas@acrimsa.com', web: 'www.acrimsa.com' },
  { nombre: 'ACEROS PROCESADOS S.A. (ACERO-DECK)', pagina: '3.6', direccion: 'Chiclayo 893 - Miraflores', telefono: '445 3259', celular: '981 275 821', email: 'ventas@acero-deck.com', web: 'www.acero-deck.com' },
  { nombre: 'ACEROS Y FIERROS INDUSTRIALES S.A.C.', pagina: '3.6', direccion: 'Brasil 1689 - Jesús María', celular: '998 005 006' },
  { nombre: 'ACROSS CONSTRUCCIONES S.A.C.', pagina: '3.7', direccion: 'Mz. E Lt. 19 Los Claveles - Lurín', celular: '979 780 206', email: 'across.construcciones@gmail.com' },
  { nombre: 'ALLCI IMPORTADORA (LADRILLOS Y CEMENTOS)', pagina: '3.7', direccion: 'Mz. D Lt. 40 Virgen del Carmen - SMP', telefono: '655 2612', celular: '910 124 602', email: 'allci.importadora@gmail.com' },
  { nombre: 'BLANCO INGENIEROS S.R.L. (ADITIVOS)', pagina: '3.8', direccion: 'Francisco Almenara 383 La Victoria', telefono: '470 6272', email: 'administracion@blancoing.com', web: 'www.blancoing.com' },
  { nombre: 'CERMETALES S.A.C. (CALAMINAS ALUZINC)', pagina: '3.8', direccion: 'Abedules Lt 11 Panamericana Sur - Lurín', celular: '970 494 949 / 987 494 392', email: 'cermetales@gmail.com', web: 'www.cermetales.com' },
  { nombre: 'CERRADURAS NACIONALES S.A.C. (TRAVEX)', pagina: '3.9', direccion: 'Las Pléyades 372 La Campiña - Chorrillos', telefono: '251 8786', email: 'travex@travexperu.com', web: 'www.travexperu.com' },
  { nombre: 'COMERCIALIZADORA RUMIWASI S.A.C.', pagina: '3.10', direccion: 'Canto Rey 425-429 - San Juan de Lurigancho', celular: '998 143 568', email: 'ventas@rumiwasi.com' },
  { nombre: 'IMPORTADORA TECNICA INDUSTRIAL Y COMERCIAL - ITICSA (CHEMA)', pagina: '3.17', direccion: 'Industrial Nro. 765 Z. - Lima', telefono: '336 8407', celular: '955 102 140', email: 'atecnico@iticsa.com', web: 'www.chema.com.pe' },
  { nombre: 'INDUSTRIAS TECNOPOR S.A.C.', pagina: '3.17', direccion: 'Mz-B Lt-1 Sta. Elena - Villa El Salvador', telefono: '292 1504', email: 'industriatecnoporsac@hotmail.com' },
  { nombre: 'ITALGRIF - VSI INDUSTRIAL S.A.C.', pagina: '3.18', direccion: 'Las Fábricas 264 Zona Industrial - Lima', telefono: '336 8252', email: 'ventas@vsi-industrial.com', web: 'www.vsi-industrial.com' },
  { nombre: 'MADERERA SAN ANTONIO', pagina: '3.20', direccion: 'Mz. A3 Lt 7b Huertos de Manchay - Pachacamac', celular: '935 138 887', email: 'cialacumbre@gmail.com' },
  { nombre: 'PROMART - ELECTRICIDAD Y PINTURAS', pagina: '3.22', direccion: 'Aviación 2405 Piso 5 - San Borja', telefono: '619 4810', web: 'www.promart.pe' },
  { nombre: 'SODIMAC S.A.', pagina: '3.26', telefono: '419 2000', web: 'www.sodimac.com.pe' },
  { nombre: 'VAINSA - VSI INDUSTRIAL S.A.C.', pagina: '3.29', direccion: 'Urb. Industrial Las Praderas - Lurín', celular: '980 657 233', email: 'cflores@vainsa.com', web: 'www.vainsa.com' },
];
