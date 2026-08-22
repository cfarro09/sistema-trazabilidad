# Sistema de Trazabilidad y Gestión de Licitaciones Estatales (OSCE / SIGA / SIAF)

Sistema integral desarrollado para la gestión de contrataciones públicas, trazabilidad documental desde la convocatoria (TDR) hasta la conformidad de pago SIAF, acreditación inteligente de experiencia con suma dinámica de montos y empaquetador automático de propuestas en PDF con foliación correlativa.

---

## 🚀 Tecnologías Utilizadas

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos & UI**: [Tailwind CSS 4](https://tailwindcss.com/) + [Lucide React](https://lucide.dev/)
- **Base de Datos & ORM**: [PostgreSQL](https://www.postgresql.org/) con [Prisma ORM 6](https://www.prisma.io/)
- **Manipulación de PDFs**: [pdf-lib](https://pdf-lib.js.org/) (Fusión y foliación digital `0001`, `0002`...)
- **Exportación de Datos**: [xlsx](https://sheetjs.com/) (Plantillas oficiales OSCE)
- **Gestión de Procesos**: [PM2](https://pm2.keymetrics.io/)

---

## 📁 Estructura del Proyecto

```
sistema-trazabilidad/
├── prisma/
│   ├── schema.prisma         # Modelo de datos relacional (Empresas, Profesionales, Servicios, Hitos)
│   └── seed.ts               # Seeder con datos reales (SUSALUD, PNP, UGEL 06, Andean Trading)
├── public/
│   └── uploads/              # Almacén local de documentos y PDFs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── empaquetador/ # Compilación de propuestas en PDF con foliado
│   │   │   ├── empresas/     # CRUD de empresas del grupo
│   │   │   ├── experiencia/  # Buscador y exportador Excel OSCE
│   │   │   ├── profesionales/# Control de personal y semáforo de colegiaturas
│   │   │   ├── servicios/    # Trazabilidad de órdenes y ciclo de 8 hitos
│   │   │   └── upload/       # Subida de comprobantes y archivos
│   │   ├── empaquetador/     # Interfaz del compilador de expedientes PDF
│   │   ├── empresas/         # Gestión de personerías jurídicas, RNP, RUC y CCI
│   │   ├── experiencia/      # Buscador de palabras clave y sumatoria de montos
│   │   ├── profesionales/    # Fichas de técnicos e ingenieros con alertas de caducidad
│   │   ├── reportes/         # Distribución por rubros y entidades contratantes
│   │   ├── servicios/        # Listado de órdenes y vista detallada por hitos
│   │   ├── usuarios/         # Mantenimiento de usuarios y roles
│   │   ├── layout.tsx        # Shell global con Sidebar y Navbar
│   │   └── page.tsx          # Dashboard principal con métricas y pipeline
│   ├── components/           # Componentes UI (Sidebar, Navbar, Modales, Badges)
│   ├── lib/                  # Clientes de Prisma y utilidades de PDF
│   └── types/                # Interfaces y tipos TypeScript
└── DOCUMENTO_FUNCIONAL.md    # Manual funcional y operativo para el cliente
```

---

## ⚙️ Configuración y Variables de Entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://postgres:Loxer73147683@144.126.152.165:5924/trazabilidad_estado?schema=public"
PORT=3355
```

---

## 🛠️ Instalación y Ejecución Local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Sincronizar base de datos y generar cliente:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Poblar datos de prueba reales:**
   ```bash
   npm run db:seed
   ```

4. **Iniciar en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir: `http://localhost:3000`

---

## 🚢 Despliegue en Servidor con PM2

Para producción en el puerto `3355`:

```bash
npm run build
pm2 start npm --name "sistema-trazabilidad" -- start -- -p 3355
pm2 save
```

---

## 📄 Documentación Funcional

Para revisar el manual operativo detallado paso a paso, consulta el archivo [DOCUMENTO_FUNCIONAL.md](./DOCUMENTO_FUNCIONAL.md).
