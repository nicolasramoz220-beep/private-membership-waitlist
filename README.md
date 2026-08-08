# Private Membership Waitlist

Landing de waitlist premium con dos flujos: solicitud general y solicitud VIP protegida por un PIN visual. Las solicitudes se guardan directamente en Supabase y la tabla está protegida con Row Level Security.

## Configuración

1. Copia `.env.example` como `.env.local`.
2. Añade la URL y la publishable key de tu proyecto Supabase. Una publishable key puede usarse en el navegador; nunca uses una `service_role` o secret key aquí.
3. Si usas otro proyecto Supabase, ejecuta `supabase/schema.sql` una vez desde el SQL Editor.

El PIN VIP está en `app/MembershipExperience.tsx` como `VIP_PIN`. El valor inicial es `1927`; cámbialo antes de compartir la página si lo deseas. Es una barrera estética, no un mecanismo de seguridad.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre la dirección local que aparece en la terminal.

## Verificar y compilar

```bash
npm run lint
npm test
```

## Despliegue

El proyecto genera una salida compatible con Cloudflare Workers mediante vinext. También puede conectarse a cualquier flujo de despliegue que ejecute `npm install` y `npm run build` y publique `dist/`. Configura las dos variables `NEXT_PUBLIC_SUPABASE_*` durante el build si no utilizas el archivo local.

## Seguridad de datos

La política incluida concede a `anon` únicamente `INSERT`. No existen políticas públicas de `SELECT`, `UPDATE` o `DELETE`, y esos privilegios se revocan de forma explícita. La administración debe realizarse desde Supabase con una cuenta autorizada.
