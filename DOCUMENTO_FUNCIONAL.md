# Manual Funcional: Sistema de Trazabilidad y Acreditación de Experiencia para Licitaciones Estatales

**Dirigido a:** Gerencia General, Área de Logística y Especialistas en Licitaciones del Grupo Empresarial.

---

## 1. Introducción y Propósito del Sistema

El **Sistema de Trazabilidad y Gestión de Licitaciones** es una plataforma centralizada diseñada para optimizar los procesos de contratación con el Estado Peruano (OSCE / SIGA / SIAF) para las **3 empresas del grupo**.

### ¿Qué problemas resuelve?
1. **Búsqueda inmediata de experiencia previa:** Evita revisar archivadores físicos o carpetas dispersas para encontrar facturas pasadas que sumen los montos exigidos en un Término de Referencia (TDR).
2. **Empaquetado rápido de propuestas en PDF:** Reúne en segundos toda la documentación legal (RNP, RUC, CCI, DDJJs) y técnica (CVs, títulos, certificados) en un solo archivo PDF con **foliación automática (`0001`, `0002`...)**.
3. **Control del ciclo de vida del servicio:** Registra cada etapa desde la invitación hasta el pago efectivo en la cuenta bancaria (CCI) vía SIAF.
4. **Semáforo de caducidades:** Advierte con anticipación el vencimiento de constancias de habilidad o colegiatura de los profesionales.

---

## 2. Los 8 Hitos de la Trazabilidad Documental

Cada contratación sigue un flujo estructurado de 8 etapas reglamentarias:

```
[1. Convocatoria (TDR)] ➔ [2. Cotización (Cód. Interno)] ➔ [3. Expediente PDF] ➔ [4. Orden O/S & SIAF]
           ▲                                                                           │
           └─────────────────────────── [FLUJO OPERATIVO] ─────────────────────────────┘
                                                       │
                                                       ▼
[8. Pago SIAF & Detracción] ➔ [7. Facturación Electrónica] ➔ [6. Conformidad Oficial] ➔ [5. Informe Final]
```

### Detalle de cada hito:
1. **Convocatoria / Invitación:** Registro de la entidad convocante (ej. SUSALUD, PNP, UGEL) y adjunto de las especificaciones técnicas o TDR.
2. **Cotización:** Se asigna un código único interno correlativo (ej. `COT-2026-00175`). Registra los montos desglosados (sin IGV, IGV y Total).
3. **Preparación de Documentación:** Acceso al generador del paquete de postulación.
4. **Orden de Servicio (O/S):** Al ser notificados como ganadores, se ingresa el **N° de Orden de Servicio** (ej. `0000701`) y el **N° de Expediente SIAF** (ej. `0000001761`), plazos y el PDF oficial emitido por la entidad.
5. **Informe Técnico Final:** Carga del entregable con el registro fotográfico de las actividades ejecutadas.
6. **Acta de Conformidad:** Registro del acta firmada por Servicios Generales o Logística de la entidad pública.
7. **Facturación Electrónica:** Emisión del comprobante de pago electrónico (ej. `E001-150`), fecha y monto facturado.
8. **Conformidad de Pago & Cierre:** Registro del depósito en la cuenta CCI, constancia de detracción en el Banco de la Nación y reporte SIAF cancelado.

---

## 3. Módulos Principales y Guía Operativa

### Módulo A: Buscador y Acreditador de Experiencia (`/experiencia`)
* **Cuándo usarlo:** Cuando una entidad solicita acreditar experiencia en un rubro específico (ej. *"Se requiere experiencia acumulada no menor de S/ 50,000 en trabajos de pintura"*).
* **Cómo operar:**
  1. En el buscador escribe la palabra clave: `pintura`, `alfombra`, `escaleras`, `drywall`, etc.
  2. En el recuadro **Monto Meta Requerido**, digita el valor exigido (ej. `50000`).
  3. El sistema listará automáticamente todas las órdenes y facturas que contengan ese rubro.
  4. Marca con el casillero `[✓]` los servicios a presentar.
  5. La barra inferior sumará en tiempo real:
     $$\text{Monto Acumulado: } S/\ 140,446.00 \quad (\text{Meta Superada: } 280\%)$$
  6. Haz clic en **"Exportar Cuadro OSCE (Excel)"** para descargar la tabla oficial con el formato reglamentario listo para imprimir y foliar.

---

### Módulo B: Empaquetador de Expedientes en PDF (`/empaquetador`)
* **Cuándo usarlo:** Al momento de enviar una cotización formal a Mesa de Partes.
* **Cómo operar:**
  1. **Paso 1 (Empresa):** Selecciona la empresa postulante y marca los documentos requeridos:
     - `[✓] Ficha RUC (SUNAT)`
     - `[✓] Constancia RNP (OSCE) Vigente`
     - `[✓] Carta de Autorización CCI (Banco)`
     - `[✓] Declaraciones Juradas (Anexos 1, 2 y 3 Antisoborno)`
  2. **Paso 2 (Personal Clave):** Marca los técnicos o ingenieros a asignar (ej. Carlos Sandoval Farroñan) para incluir automáticamente sus títulos y constancias laborales.
  3. **Paso 3 (Cotización):** Confirma el monto y descripción del servicio.
  4. Haz clic en **"Compilar y Descargar PDF"**: El sistema unirá todos los archivos y estampará en la esquina superior derecha la foliación correlativa (`0001`, `0002`, `0003`...).

---

### Módulo C: Carga Rápida Histórica (15 años)
* **Cuándo usarlo:** Para digitalizar servicios antiguos ganados hace años y que sirvan como experiencia en futuras licitaciones.
* **Cómo operar:**
  1. Ve a **Trazabilidad & Servicios** $\rightarrow$ botón **"Carga Rápida Histórica (15 años)"**.
  2. Completa: Empresa, Entidad, N° de Orden, N° SIAF, N° de Factura, Fecha, Monto Total y Descripción detallada con las palabras clave del trabajo.
  3. Guarda el registro y quedará disponible de inmediato en el buscador de experiencia.

---

### Módulo D: Profesionales y Semáforo de Colegiaturas (`/profesionales`)
* Permite registrar a los técnicos e ingenieros con sus títulos y constancias laborales.
* **Semáforo de Vigencia:**
  * 🟢 **Vigente:** Colegiatura con más de 30 días antes de expirar.
  * 🟡 **Por Vencer:** Alerta preventiva (menos de 30 días).
  * 🔴 **Vencido:** Alerta crítica para solicitar la constancia de habilidad actualizada.

---

## 4. Preguntas Frecuentes

**¿Puedo usar cotizaciones que aún no tienen orden de servicio para acreditar experiencia?**
> No. El módulo de acreditación filtra estrictamente los servicios que cuentan con **Conformidad emitida, Factura o Pago**, garantizando que no se presenten propuestas rechazadas ante el OSCE.

**¿Qué pasa si mi orden de servicio es antigua y no tiene código SIAF?**
> El sistema permite registrar órdenes históricas con o sin número SIAF mediante el formulario de Carga Rápida.

**¿Dónde se guardan los archivos PDF?**
> Se almacenan de forma segura y organizada en el servidor local del grupo empresarial, estructurados por RUC y número de servicio.
