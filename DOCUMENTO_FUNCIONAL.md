# Manual Funcional: Sistema de Trazabilidad, Cotizaciones y Acreditación de Experiencia para Licitaciones Estatales

**Dirigido a:** Gerencia General, Área de Logística y Especialistas en Licitaciones del Grupo Empresarial.

---

## 1. Introducción y Propósito del Sistema

El **Sistema de Trazabilidad y Gestión de Licitaciones** es una plataforma centralizada diseñada para optimizar los procesos de contratación con el Estado Peruano (OSCE / SIGA / SIAF) para las **3 empresas del grupo**.

### ¿Qué problemas resuelve?
1. **Elaboración y Control de Cotizaciones Formales:** Creación de presupuestos con partidas desglosadas por grupos, cálculo automático de costo directo, IGV (18%), total general y monto en letras, con **formato oficial imprimible idéntico al emitido por la empresa**.
2. **Búsqueda inmediata de experiencia previa:** Evita revisar archivadores físicos o carpetas dispersas para encontrar facturas pasadas que sumen los montos exigidos en un Término de Referencia (TDR).
3. **Empaquetado rápido de propuestas en PDF:** Reúne en segundos toda la documentación legal (RNP, RUC, CCI, DDJJs) y técnica (CVs, títulos, certificados) en un solo archivo PDF con **foliación automática (`0001`, `0002`...)**.
4. **Control del ciclo de vida del servicio:** Registra cada etapa desde la cotización hasta el pago efectivo en la cuenta bancaria (CCI) vía SIAF.
5. **Semáforo de caducidades:** Advierte con anticipación el vencimiento de constancias de habilidad o colegiatura de los profesionales.

---

## 2. Los 4 Grandes Módulos Operativos

```
                                [ DASHBOARD PRINCIPAL ]
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
[ 1. COTIZACIONES ]         [ 2. TRAZABILIDAD ]         [ 3. ACREDITADOR ]
  ├─ Partidas Desagregadas    ├─ 8 Hitos (TDR ➔ SIAF)     ├─ Buscador "Pintura"
  ├─ Formato Oficial PDF      ├─ N° Orden & SIAF          ├─ Suma Dinámica
  └─ Conversión a Orden       └─ Conformidad y Pago       └─ Exportación OSCE Excel
```

---

## 3. Guía Operativa de Módulos

### 📝 Módulo 1: Cotizaciones & Presupuestos (`/cotizaciones`)
* **Ubicación:** Menú lateral principal $\rightarrow$ **"Cotizaciones & Presupuestos"**.
* **Funcionalidades:**
  1. **Lista de Cotizaciones:** Visualiza todas las propuestas con su estado (`ENVIADA`, `ACEPTADA_CONVERTIDA_A_ORDEN`, `BORRADOR`), empresa emisora, entidad solicitante y montos.
  2. **Creador de Cotizaciones Desagregadas (`/cotizaciones/nueva`):**
     * Selección de la empresa emisora (Andean Trading Company, Grupo Constructores, Inversiones del Perú).
     * Registro de la entidad, atención, fecha y objeto del servicio.
     * **Tabla Dinámica de Partidas:**
       * Botón `+ Agregar Título / Grupo` (ej. *1.00 ACTIVIDADES PRELIMINARES*, *2.00 AREA DE ALTA DIRECCIÓN*).
       * Botón `+ Agregar Partida` (Ítem ej. *1.01*, Descripción, Unidad ej. *Global*, *m2*, Cantidad y Precio Unitario).
     * **Cálculos Automáticos:** El sistema calcula automáticamente el *Costo Directo*, *IGV (18%)*, *Total General* y genera el texto formal en letras (*SON: DIECISIETE MIL CON 00/100 SOLES*).
     * **Condiciones Comerciales:** Validez de oferta (30 días), plazo de ejecución (10 días), garantía (12 meses), forma de pago (Contado Comercial) y lugar de ejecución.
  3. **Formato Oficial Imprimible (`/cotizaciones/[id]`):**
     * Genera la vista formal lista para imprimir (`Ctrl + P`) o guardar en PDF con el logotipo y membrete oficial de la empresa, tabla con bordes negros reglamentarios, cuadro de condiciones comerciales y firma de Gerencia General.
  4. **Botón "Convertir a Orden de Servicio":**
     * Al momento que la entidad adjudica el servicio, con **1 solo clic** la cotización se traslada al módulo de **Trazabilidad** para asignarle el N° de Orden y N° de Expediente SIAF.
  5. **Subir Cotización Antigua (Imagen/PDF):**
     * Permite digitalizar cotizaciones de hace años con su fecha, descripción y monto para alimentar el histórico.

---

### 📋 Módulo 2: Trazabilidad de Contrataciones (`/servicios`)
Cubre los 8 hitos del ciclo de vida una vez asignada la orden:
1. **Convocatoria (TDR):** Subida de las bases y términos de referencia.
2. **Cotización:** Vinculada con su código único interno.
3. **Expediente:** Enlace al empaquetador foliado.
4. **Orden de Servicio (O/S):** Registro de **N° Orden de Servicio** (ej. `0000701`) y **N° Expediente SIAF** (ej. `0000001761`), plazos y PDF de la O/S.
5. **Informe Técnico:** Carga del entregable con registro fotográfico.
6. **Acta de Conformidad:** Registro del acta oficial firmada por la entidad.
7. **Facturación Electrónica:** Registro de Factura SUNAT (ej. `E001-150`).
8. **Pago SIAF & Detracción:** Constancia de abono en CCI y depósito de detracción en Banco de la Nación.

---

### 🔍 Módulo 3: Buscador & Acreditador de Experiencia (`/experiencia`)
* Permite buscar por palabras clave (ej. *"pintura"*, *"alfombra"*, *"escaleras"*) en todas las facturaciones de los 15 años.
* Permite ingresar una meta (ej. $S/\ 50,000.00$) y seleccionar las facturas: la barra inferior suma en vivo ($S/\ 109,446.00 + S/\ 31,000.00 = S/\ 140,446.00$) e indica si la meta fue superada.
* Botón para **Exportar el Cuadro OSCE oficial a Excel (.xlsx)** con 1 clic.

---

### 📦 Módulo 4: Empaquetador de Expedientes en PDF (`/empaquetador`)
* Wizard interactivo para seleccionar: Empresa (RNP, RUC, CCI, DDJJs 1-3) + Técnicos (título y colegiatura) + Cotización.
* Compila todo en un **único PDF foliado correlativamente (`0001`, `0002`...)**.

---

### 👥 Módulo 5: Profesionales (`/profesionales`) & Empresas (`/empresas`)
* Semáforo de colegiaturas (🟢 Vigente, 🟡 Por vencer, 🔴 Vencido).
* Datos tributarios SUNAT, cuentas bancarias CCI y vigencia de RNP de las 3 empresas.
