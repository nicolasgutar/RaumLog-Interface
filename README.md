# RaumLog

Marketplace de almacenamiento entre particulares para Colombia. Conecta a personas que necesitan espacio de almacenamiento con vecinos que tienen garajes, cuartos útiles o bodegas disponibles. Opera en Medellín, Bogotá y área metropolitana.

**Producción:** https://raumlog-production-379615565756.us-central1.run.app/

---

## Origen del proyecto

RaumLog fue prototipado en Replit. Posteriormente fue adaptado para funcionalidad completa de producción: se migró la autenticación a Firebase, se reemplazó el almacenamiento efímero por Google Cloud Storage, se añadió un panel de administración, y se desplegó fuera de Replit en Google Cloud Run para reducir costos operativos y tener mayor control sobre la infraestructura.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite 7 + Tailwind CSS |
| Backend | Express 5 + TypeScript, Node 22 |
| Monorepo | pnpm workspaces |
| Auth | Firebase Authentication (Google + email/password) |
| Base de datos | PostgreSQL en Cloud SQL + Drizzle ORM |
| Almacenamiento | Google Cloud Storage (bucket público para imágenes, bucket privado para documentos KYC) |
| Secrets | GCP Secret Manager |
| Despliegue | Google Cloud Run (Docker, source-based deploy) |

---

## Estructura del monorepo

```
artifacts/
  api-server/       Express REST API
  raumlog/          Frontend web (React + Vite)
  raumlog-mobile/   App móvil (Expo / React Native)
lib/
  db/               Schema Drizzle + migraciones
  api-zod/          Schemas Zod compartidos
  api-client-react/ Cliente React generado
scripts/            Scripts de utilidad (seed, update-user, etc.)
specs/              Especificaciones de producto por feature
```

---

## Desarrollo local

**Requisitos:** Node 22, pnpm

```bash
# Instalar dependencias
pnpm install

# Backend (desde artifacts/api-server, tras compilar)
pnpm --filter @workspace/api-server build
PORT=5001 DATABASE_URL=... FIREBASE_SERVICE_ACCOUNT=... node --enable-source-maps ./dist/index.mjs

# Frontend
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/raumlog dev
```

El frontend corre en `:5000` y hace proxy de `/api` hacia `:5001` (configurado en `vite.config.ts`).

Las variables de entorno locales van en `.env` en la raíz del monorepo (ver `.env` de ejemplo — no se sube a git).

---

## Despliegue

```bash
gcloud run deploy raumlog-production \
  --source . \
  --region us-central1 \
  --set-env-vars="NODE_ENV=production,DATABASE_URL=...,GCS_BUCKET_NAME=raumlog-spaces-public,GCP_PROJECT_ID=raumlog-e5b0f" \
  --add-cloudsql-instances="raumlog:us-central1:raumlog-db" \
  --service-account="raumlog-runner@raumlog.iam.gserviceaccount.com" \
  --set-secrets="/app/secrets/firebase-sa.json=raumlog-firebase-sa:latest" \
  --allow-unauthenticated \
  --project=raumlog
```

El `Dockerfile` compila el frontend (con variables `VITE_*` baked-in) y el backend, y sirve ambos desde un único proceso Express en el puerto 8080.

---

## Licencia

Propietario — todos los derechos reservados © 2025 COALGE S.A.S.
