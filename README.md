# RaumLog — Marketplace de Almacenamiento

**RaumLog** conecta personas que necesitan espacio de almacenamiento con vecinos que tienen garajes, cuartos de herramientas o bodegas disponibles. Operamos en Medellín y Bogotá (Colombia).

---

## Tecnologías

| Capa | Stack |
|------|-------|
| Web frontend | React 18 + Vite + Tailwind CSS v3 |
| Mobile | Expo 52 (React Native) — iOS + Android |
| API | Express 5 + TypeScript (Node 20) |
| Base de datos | PostgreSQL (Replit managed) |
| Pagos | Wompi (sandbox → producción) |
| Autenticación | JWT + bcryptjs |

---

## Estructura del proyecto

```
workspace/
├── artifacts/
│   ├── raumlog/          # App web (React + Vite)
│   ├── raumlog-mobile/   # App móvil (Expo)
│   └── api-server/       # API REST (Express)
├── packages/
│   └── shared/           # Tipos y utilidades compartidas
└── README.md
```

---

## Módulos principales

### Web (`artifacts/raumlog/src/`)

| Archivo | Descripción |
|---------|-------------|
| `pages/Home.tsx` | Landing page con HeroSection, estadísticas y CTA |
| `pages/FindSpace.tsx` | Búsqueda, filtros y flujo de reserva completo |
| `pages/OfferSpace.tsx` | Formulario de registro de espacios para anfitriones |
| `pages/AuthPage.tsx` | Login / Registro con JWT y checkbox LOPD |
| `pages/AdminControl.tsx` | Panel superadmin: espacios, reservas, finanzas |
| `lib/payment-service.ts` | Motor de comisiones + integración Wompi |
| `lib/auth-api.ts` | Funciones de login/registro/me contra la API |
| `components/Header.tsx` | Navbar responsive con dropdown de usuario |
| `components/WhatsAppButton.tsx` | Botón flotante de soporte WhatsApp |

### Mobile (`artifacts/raumlog-mobile/app/`)

| Ruta | Descripción |
|------|-------------|
| `(tabs)/index.tsx` | Búsqueda de espacios con geolocalización |
| `(tabs)/reservas.tsx` | Historial de reservas del cliente |
| `(tabs)/dashboard.tsx` | Panel del anfitrión: espacios y solicitudes |
| `(tabs)/cuenta.tsx` | Perfil, configuración y logout |
| `auth.tsx` | Login / Registro con validación LOPD |
| `soporte.tsx` | Canales de contacto y soporte |
| `context/AuthContext.tsx` | Estado de sesión con AsyncStorage |

### API (`artifacts/api-server/src/`)

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/register` | POST | Registro de usuarios (bcrypt + JWT) |
| `/api/auth/login` | POST | Login (devuelve JWT 7 días) |
| `/api/auth/me` | GET | Perfil del usuario autenticado |
| `/api/spaces/public` | GET | Listado de espacios publicados |
| `/api/spaces/public/:id` | GET | Detalle de un espacio |
| `/api/reservations` | POST | Crear reserva |
| `/api/reservations/:id/pay` | POST | Confirmar pago (Wompi sandbox) |
| `/api/host/spaces` | GET | Espacios del anfitrión |
| `/api/host/reservations/:id/status` | PATCH | Aprobar / rechazar reserva |
| `/api/admin/login` | POST | Login de superadmin |
| `/api/admin/spaces` | GET/PATCH | Gestión de espacios |

---

## Motor de comisiones

| Escenario | Duración | Comisión |
|-----------|----------|----------|
| A — Estadía corta | 1–5 meses | 20% del total |
| B — Estadía larga | 6+ meses | 1 mes de renta fijo |

IVA (19%) se aplica **sobre** el precio público y es pagado por el cliente al momento de la reserva. Se remite a la DIAN.

---

## Variables de entorno

```env
# Compartidas API + Web
DATABASE_URL=postgres://...
JWT_SECRET=...
ADMIN_PASSWORD=...

# Mobile
EXPO_PUBLIC_DOMAIN=...
```

---

## Arrancar en desarrollo

```bash
# Instalar dependencias
pnpm install

# API
pnpm --filter @workspace/api-server run dev

# Web
pnpm --filter @workspace/raumlog run dev

# Mobile
pnpm --filter @workspace/raumlog-mobile run dev
```

---

## Pagos — Wompi

El flujo de pago usa Wompi en modo **sandbox**. Para pasar a producción:
1. Reemplazar `WOMPI_SANDBOX_INTEGRITY_KEY` por la clave real.
2. Cambiar el endpoint en `payment-service.ts` → `https://checkout.wompi.co/p/`.
3. Verificar el webhook de confirmación desde el panel de Wompi.

---

## Entidad legal

**COALGE S.A.S.**
NIT 901.234.567-8 · Medellín, Colombia
info@coalge.com.co

---

## Licencia

Propietario — todos los derechos reservados © 2025 COALGE S.A.S.
