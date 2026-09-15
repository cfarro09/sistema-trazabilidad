const fs = require('fs');
const path = require('path');

console.log('=== Ingestionando Suplemento Técnico Marzo 2025 (59 Páginas) ===');

// 1. VALOR M2 GRUPOS (Pág 2)
const valorM2Grupos = [
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

// 2. PARSE PRESUPUESTO DESGLOSADO (Págs 3 y 4)
let partidasPresupuesto = [];
for (let p of [3, 4]) {
  const text = fs.readFileSync(`scripts/pages/page_${p}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let l of lines) {
    // Matches like: 01.01.01 CONSTRUCCION DE ALMACEN... m2 15.00 101.48 1,522.20
    const m = l.match(/^(\d{2}(?:\.\d{2})?(?:\.\d{2})?)\s+(.+?)\s+([a-zA-Z0-9\/]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)$/);
    if (m) {
      const item = m[1];
      const desc = m[2];
      const und = m[3];
      const met = parseFloat(m[4].replace(/,/g, '')) || 0;
      const pu = parseFloat(m[5].replace(/,/g, '')) || 0;
      const par = parseFloat(m[6].replace(/,/g, '')) || 0;
      let esp = 'ARQUITECTURA';
      if (['01', '02'].includes(item.substring(0, 2))) esp = 'OE';
      else if (['03', '04', '05'].includes(item.substring(0, 2))) esp = 'ESTRUCTURAS';
      else if (['20', '21', '22', '23', '24', '25', '26'].includes(item.substring(0, 2))) esp = 'SANITARIAS';
      else if (['27', '28', '29', '30', '31', '32', '33'].includes(item.substring(0, 2))) esp = 'ELECTRICAS';

      partidasPresupuesto.push({
        item,
        grupoItem: item.substring(0, 2),
        partida: desc,
        unidad: und,
        metrado: met,
        precioUnitario: pu,
        parcial: par,
        especialidad: esp
      });
    }
  }
}
console.log(`✓ Partidas del Presupuesto desglosado: ${partidasPresupuesto.length}`);

// 3. PARSE PARTIDAS OE & HU (Págs 6 a 13)
let partidasOEHU = [];
for (let p = 6; p <= 13; p++) {
  const text = fs.readFileSync(`scripts/pages/page_${p}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentSub = '';

  for (let l of lines) {
    if (l.includes('Precios sin I.G.V') || l.includes('Sin I.G.V.') || l.includes('Precios de Partidas') || l.includes('PRECIOS UNITARIOS') || l.includes('Tipo de Cambio')) continue;
    if (l.startsWith('- 1.')) continue;

    const matchCode = l.match(/^((?:OE|HU)\.[\d\.\*]+)\s+(.+)/i);
    if (matchCode) {
      const rawCode = matchCode[1].replace(/\*/g, '').trim();
      const rest = matchCode[2].trim();

      const tokens = rest.split(/\t+/).map(t => t.trim()).filter(Boolean);
      if (tokens.length >= 5) {
        const desc = tokens[0];
        const und = tokens[1].toUpperCase();
        const pu = parseFloat(tokens[2].replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const mo = parseFloat(tokens[3].replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const mat = parseFloat(tokens[4].replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        const equ = tokens[5] ? (parseFloat(tokens[5].replace(/[^\d.,]/g, '').replace(',', '.')) || 0) : 0;
        partidasOEHU.push({
          codigo: rawCode,
          partida: desc,
          unidad: und,
          precioUnitario: pu,
          manoDeObra: mo,
          materiales: mat,
          equipos: equ,
          especialidad: rawCode.startsWith('OE') ? 'OE' : 'HU',
          subcategoria: currentSub || (rawCode.startsWith('OE') ? 'Obras de Edificación' : 'Habilitación Urbana')
        });
      } else {
        const numMatch = rest.match(/(.+?)\s+([A-Z0-9\/]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)$/);
        if (numMatch) {
          partidasOEHU.push({
            codigo: rawCode,
            partida: numMatch[1].trim(),
            unidad: numMatch[2].toUpperCase(),
            precioUnitario: parseFloat(numMatch[3].replace(/,/g, '')) || 0,
            manoDeObra: parseFloat(numMatch[4].replace(/,/g, '')) || 0,
            materiales: parseFloat(numMatch[5].replace(/,/g, '')) || 0,
            equipos: parseFloat(numMatch[6].replace(/,/g, '')) || 0,
            especialidad: rawCode.startsWith('OE') ? 'OE' : 'HU',
            subcategoria: currentSub || (rawCode.startsWith('OE') ? 'Obras de Edificación' : 'Habilitación Urbana')
          });
        }
      }
    } else if (l.length < 60 && l === l.toUpperCase() && !l.includes('\t') && !l.match(/\d/)) {
      currentSub = l;
    }
  }
}
console.log(`✓ Partidas Unitarias Normalizadas OE & HU: ${partidasOEHU.length}`);

// 4. PARSE INSUMOS Y MATERIALES (Págs 22 a 48)
let insumos = [];
let idCounter = 1;

for (let p = 22; p <= 48; p++) {
  const text = fs.readFileSync(`scripts/pages/page_${p}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  let currentProvider = '';
  let currentGroup = 'MATERIALES DE CONSTRUCCIÓN';
  let pageTag = '3.' + (p - 17);

  for (let l of lines) {
    if (l.includes('Precios sin I.G.V') || l.includes('Precios de los Materiales') || l.includes('INSUMO \tUND. PREC.')) continue;
    if (l.startsWith('- 3.')) continue;
    if (l.includes('DE INTERÉS PARA LOS SUSCRIPTORES')) break;
    if (l.includes('NO INCLUYE IGV') || l.includes('NO INCLUE FLETE') || l.includes('PRECIOS EN PLANTA') || l.includes('LISTA DE PRECIOS INCLUYE')) continue;

    // Detect provider
    if (l.match(/(S\.A\.C|E\.I\.R\.L|S\.R\.L|S\.A\.|PROMART|SODIMAC|PETRÓLEOS DEL PERÚ|ALLCI|BLANCO INGENIEROS|CERMETALES|CONSELVA|CONTE GROUP|DANOBSA|DINCORSA|ESIN|FERRETERÍA|GRUPO ALTOS|HERCAB|ICOFESA|ITICSA|ITALGRIF|LA VIGA|LEAF ENERGY|LUMINIKA|MADERERA|MAVERI|MERIDIAN|MI LADRILLO|OXIGAS|PARA RAYOS|PERU TOOL|PISOPAK|PISOS BRYCE|PRO HOME|RED PERUANA|ROTONDE|TECNOBLOCK|VAINSA)/i) && !l.includes('\t') && l.length < 65) {
      currentProvider = l.trim();
      continue;
    }

    const parts = l.split('\t').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 3 && /^(PZA|UND|M|M2|M3|KG|BLS|GL|GAL|RLL|MLL|CTO|VAR|JGO|PAR|HM|HA|KM|PTO|D|L|ML|CD)\b/i.test(parts[1])) {
      const desc = parts[0];
      const und = parts[1].toUpperCase();
      const priceStr = parts[2];
      const isUsd = priceStr.includes('$');
      const cleanPrice = parseFloat(priceStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
      const tc = 3.683;
      const priceSoles = isUsd ? Math.round(cleanPrice * tc * 100) / 100 : cleanPrice;
      const priceConIgv = Math.round(priceSoles * 1.18 * 100) / 100;

      insumos.push({
        codigo: `INS-${String(idCounter++).padStart(5, '0')}`,
        tipo: 'MATERIAL',
        descripcion: desc,
        unidad: und,
        precioSinIgv: priceSoles,
        precioConIgv: priceConIgv,
        moneda: isUsd ? 'USD' : 'PEN',
        proveedor: currentProvider || 'DISTRIBUIDOR LIMA',
        grupo: currentGroup,
        pagina: pageTag
      });
    } else if (!l.includes('\t') && l === l.toUpperCase() && l.length < 60 && !l.match(/\d{2,}/)) {
      currentGroup = l;
    }
  }
}
console.log(`✓ Materiales de Construcción extraídos: ${insumos.length}`);

// 5. PARSE MAQUINARIAS (Págs 52 y 53)
let maquinarias = [];
for (let p of [52, 53]) {
  const text = fs.readFileSync(`scripts/pages/page_${p}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentGroup = 'MAQUINARIA Y EQUIPOS PESADOS';

  for (let l of lines) {
    if (l.includes('Tarifa de Alquiler') || l.includes('Tarifas horarias') || l.startsWith('- 3-')) continue;
    if (!l.includes('\t') && l === l.toUpperCase() && l.length < 50 && !l.match(/\d/)) {
      currentGroup = l;
      continue;
    }
    const parts = l.split('\t').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 6) {
      const desc = parts[0] + (parts[1] ? ` (${parts[1]})` : '');
      const tarifaStr = parts[parts.length - 1].replace(/[^\d.,]/g, '').replace(',', '.') || parts[parts.length - 2].replace(/[^\d.,]/g, '').replace(',', '.');
      const tarifa = parseFloat(tarifaStr) || 0;
      if (tarifa > 0) {
        maquinarias.push({
          codigo: `MAQ-${String(idCounter++).padStart(5, '0')}`,
          tipo: 'EQUIPO',
          descripcion: desc,
          unidad: 'HM',
          precioSinIgv: tarifa,
          precioConIgv: Math.round(tarifa * 1.18 * 100) / 100,
          moneda: 'PEN',
          proveedor: 'COSTOS PERÚ / CÁMARA PERUANA DE LA CONSTRUCCIÓN',
          grupo: currentGroup,
          pagina: p === 52 ? '3.35' : '3.36'
        });
      }
    }
  }
}
console.log(`✓ Tarifas de Maquinaria y Equipos extraídas: ${maquinarias.length}`);

// 6. MANO DE OBRA CAPECO (Pág 50)
const manoDeObraCapeco = [
  { codigo: 'MO-CAP-HH', tipo: 'MANO_DE_OBRA', descripcion: 'CAPATAZ DE CUADRILLA (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 34.07, precioConIgv: 34.07, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-OPE-HH', tipo: 'MANO_DE_OBRA', descripcion: 'OPERARIO DE CONSTRUCCIÓN CIVIL (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 28.39, precioConIgv: 28.39, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-OFI-HH', tipo: 'MANO_DE_OBRA', descripcion: 'OFICIAL DE CONSTRUCCIÓN CIVIL (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 22.33, precioConIgv: 22.33, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-PEO-HH', tipo: 'MANO_DE_OBRA', descripcion: 'PEÓN DE CONSTRUCCIÓN CIVIL (COSTO HORA HOMBRE)', unidad: 'HH', precioSinIgv: 20.22, precioConIgv: 20.22, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-CAP-DH', tipo: 'MANO_DE_OBRA', descripcion: 'CAPATAZ DE CUADRILLA (COSTO DÍA HOMBRE 8 HORAS)', unidad: 'DH', precioSinIgv: 272.56, precioConIgv: 272.56, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-OPE-DH', tipo: 'MANO_DE_OBRA', descripcion: 'OPERARIO DE CONSTRUCCIÓN CIVIL (COSTO DÍA HOMBRE 8 HORAS)', unidad: 'DH', precioSinIgv: 227.13, precioConIgv: 227.13, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-OFI-DH', tipo: 'MANO_DE_OBRA', descripcion: 'OFICIAL DE CONSTRUCCIÓN CIVIL (COSTO DÍA HOMBRE 8 HORAS)', unidad: 'DH', precioSinIgv: 178.66, precioConIgv: 178.66, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-PEO-DH', tipo: 'MANO_DE_OBRA', descripcion: 'PEÓN DE CONSTRUCCIÓN CIVIL (COSTO DÍA HOMBRE 8 HORAS)', unidad: 'DH', precioSinIgv: 161.75, precioConIgv: 161.75, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA CONSTRUCCIÓN CIVIL', pagina: '3.33' },
  { codigo: 'MO-OP-ELEC', tipo: 'MANO_DE_OBRA', descripcion: 'OPERADOR DE EQUIPO ELECTROMECÁNICO HH', unidad: 'HH', precioSinIgv: 31.07, precioConIgv: 31.07, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA ESPECIALIZADA', pagina: '3.36' },
  { codigo: 'MO-OP-PES', tipo: 'MANO_DE_OBRA', descripcion: 'OPERADOR DE EQUIPO PESADO HH', unidad: 'HH', precioSinIgv: 29.61, precioConIgv: 29.61, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA ESPECIALIZADA', pagina: '3.36' },
  { codigo: 'MO-OP-MED', tipo: 'MANO_DE_OBRA', descripcion: 'OPERADOR DE EQUIPO MEDIANO HH', unidad: 'HH', precioSinIgv: 29.36, precioConIgv: 29.36, moneda: 'PEN', proveedor: 'CAPECO / MTPE', grupo: 'MANO DE OBRA ESPECIALIZADA', pagina: '3.36' },
];
console.log(`✓ Conceptos de Mano de Obra CAPECO: ${manoDeObraCapeco.length}`);

// 7. ÍNDICE DE GRUPOS (Págs 18 y 19)
let indiceGrupos = [];
for (let p of [18, 19]) {
  const text = fs.readFileSync(`scripts/pages/page_${p}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let currentLetra = 'A';
  for (let l of lines) {
    if (/^[A-Z]$/.test(l)) {
      currentLetra = l;
      continue;
    }
    const m = l.match(/^([A-ZÁÉÍÓÚÑ0-9\s\/\(\)\-\.\,]+?)\s+(3\.\d+)$/);
    if (m) {
      indiceGrupos.push({
        letra: currentLetra,
        grupo: m[1].trim(),
        pagina: m[2].trim(),
        tipo: 'MATERIAL'
      });
    }
  }
}
console.log(`✓ Grupos del Índice A-Z: ${indiceGrupos.length}`);

// 8. DIRECTORIO DE PROVEEDORES (Págs 20 y 21)
let proveedores = [];
for (let p of [20, 21]) {
  const text = fs.readFileSync(`scripts/pages/page_${p}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let cur = null;

  for (let l of lines) {
    if (l.includes('Índice por Colaborador') || l.includes('PROVEEDORES') || l.startsWith('- 3.')) continue;
    const pm = l.match(/^([A-Z0-9\.\s\/\&\,\-\'\(\)]+?)\.{2,}\s*(3\.\d+)$/);
    if (pm) {
      if (cur) proveedores.push(cur);
      cur = {
        nombre: pm[1].replace(/\.+$/, '').trim(),
        pagina: pm[2].trim(),
        direccion: '',
        telefono: '',
        celular: '',
        email: '',
        web: ''
      };
    } else if (cur && !/^[A-Z]$/.test(l)) {
      if (l.toLowerCase().includes('telf') || l.toLowerCase().includes('tel.')) {
        cur.telefono = l;
      } else if (l.toLowerCase().includes('cel.')) {
        cur.celular = l;
      } else if (l.includes('@')) {
        cur.email = l;
      } else if (l.includes('www.') || l.includes('http')) {
        cur.web = l;
      } else if (!cur.direccion) {
        cur.direccion = l;
      }
    }
  }
  if (cur) proveedores.push(cur);
}
console.log(`✓ Proveedores y Colaboradores: ${proveedores.length}`);

// Combinar todos los insumos (Materiales + Maquinaria + Mano de Obra)
const todosLosInsumos = [...insumos, ...maquinarias, ...manoDeObraCapeco];
console.log(`✓ TOTAL GENERAL DE RECURSOS & INSUMOS COMBINADOS: ${todosLosInsumos.length}`);

// Crear el objeto consolidado
const database = {
  version: '2025-03',
  fechaVigencia: '2025-02-28',
  tipoCambioOficial: 3.683,
  totalItems: valorM2Grupos.length + partidasPresupuesto.length + partidasOEHU.length + todosLosInsumos.length + indiceGrupos.length + proveedores.length,
  valorM2Grupos,
  partidasPresupuesto,
  partidasOEHU,
  insumos: todosLosInsumos,
  indiceGrupos,
  proveedores
};

// Escribir a src/data/costos-completos.json
if (!fs.existsSync('src/data')) fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/costos-completos.json', JSON.stringify(database, null, 2));

console.log(`=== BASE DE DATOS GENERADA CON ÉXITO ===`);
console.log(`Ruta: src/data/costos-completos.json`);
console.log(`Total registros catalogados: ${database.totalItems}`);
