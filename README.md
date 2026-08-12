# Private Membership Waitlist

Landing de waitlist premium con dos flujos: solicitud general y solicitud VIP protegida por un PIN visual. Las solicitudes se guardan directamente en Supabase y la tabla está protegida con Row Level Security.

## Configuración

La URL y la publishable key están en `lib/supabase.ts`. Una publishable key puede usarse en el navegador porque el acceso real lo controla RLS; nunca uses una `service_role` o secret key aquí. Si usas otro proyecto Supabase, actualiza ese archivo y ejecuta `supabase/schema.sql` una vez desde el SQL Editor.

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

## Publicación con GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` compila y publica automáticamente el sitio en GitHub Pages al hacer push a `main`. La salida estática se puede comprobar localmente con:

```bash
npm run build:pages
```

No hay login de GPT ni autenticación de visitantes. El formulario envía directamente a Supabase con la publishable key y las políticas RLS incluidas.

## Flujo de solicitud

El formulario conserva el avance incompleto en `sessionStorage` y divide la solicitud en 13 pasos breves. Incluye la confirmación personalizada del nombre, las preguntas de confianza y organización, la presentación de 20 minutos con su motivo, los escenarios de la jirafa y el pingüino, el escenario de $1,000,000, la elección de King Nicolas y la declaración final. La experiencia restringida es completamente ficticia: no solicita ubicación ni consulta servicios externos. La pantalla final solo aparece después de que Supabase confirma el envío.

## Seguridad de datos

La política incluida concede a `anon` únicamente `INSERT`. No existen políticas públicas de `SELECT`, `UPDATE` o `DELETE`, y esos privilegios se revocan de forma explícita. La administración debe realizarse desde Supabase con una cuenta autorizada.
