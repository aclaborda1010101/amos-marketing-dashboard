# 🚀 ManIAS Marketing - Instrucciones de Setup

## ✅ PASO 1: Ejecutar SQL en Supabase

1. **Ir al Dashboard de Supabase:**
   - URL: https://supabase.com/dashboard/project/mxlrboojfctcoqtssfpy
   - Login con GitHub (aclaborda1010101)

2. **Ir a SQL Editor:**
   - Sidebar izquierdo → Click en "SQL Editor"
   - Click en "+ New query"

3. **Copiar y ejecutar este SQL:**

```sql
-- CLIENTS
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  website TEXT,
  logo_url TEXT,
  brief TEXT,
  status TEXT CHECK (status IN ('active', 'paused', 'archived')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CLIENT STATE (AMOS Core)
CREATE TABLE IF NOT EXISTS client_state (
  client_id UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
  brand_dna_state TEXT CHECK (brand_dna_state IN (
    'not_started', 'generated', 'validated', 'approved', 'rejected'
  )) DEFAULT 'not_started',
  content_calendar_state TEXT CHECK (content_calendar_state IN (
    'not_started', 'generated', 'validated', 'approved', 'rejected'
  )) DEFAULT 'not_started',
  campaigns_state TEXT CHECK (campaigns_state IN (
    'inactive', 'active', 'paused', 'aborted'
  )) DEFAULT 'inactive',
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- CAMPAIGNS
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT CHECK (status IN (
    'draft', 'proposed', 'approved', 'active', 'paused', 'completed', 'aborted'
  )) DEFAULT 'draft',
  objective TEXT CHECK (objective IN (
    'awareness', 'consideration', 'conversion', 'loyalty'
  )),
  budget JSONB,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- EVENTS (AMOS Core)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created ON clients(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_client ON campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_events_client ON events(client_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);

-- AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Deshabilitado para desarrollo
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_state DISABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

4. **Click en "Run" (botón verde abajo a la derecha)**

5. **Verificar que se crearon las tablas:**
   - Sidebar izquierdo → "Table Editor"
   - Deberías ver: `clients`, `client_state`, `campaigns`, `events`

---

## ✅ PASO 2: Crear Bucket para Logos

1. **Ir a Storage:**
   - Sidebar izquierdo → Click en "Storage"

2. **Crear nuevo bucket:**
   - Click en "+ New bucket"
   - Nombre: `logos`
   - Public: ✅ Activar (para que los logos sean accesibles)
   - Click en "Create bucket"

3. **Configurar políticas (automático):**
   - Las políticas de lectura pública se crearán automáticamente

---

## ✅ PASO 3: Verificar Configuración

1. **Verificar .env.local existe:**
   ```bash
   cat .env.local
   ```
   Debería mostrar:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mxlrboojfctcoqtssfpy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```

2. **Si NO existe, créalo:**
   ```bash
   echo 'NEXT_PUBLIC_SUPABASE_URL=https://mxlrboojfctcoqtssfpy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bHJib29qZmN0Y29xdHNzZnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzQ4NjEsImV4cCI6MjA4NjExMDg2MX0.bJCvnsZ6Xyz41oBT0Qab-GIJ6X7IdSSmR7EDYahNfnA' > .env.local
   ```

---

## ✅ PASO 4: Probar Localmente

1. **Instalar dependencias (si no lo hiciste):**
   ```bash
   cd ~/clawd/marketing-dashboard
   npm install
   ```

2. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en navegador:**
   - http://localhost:3000

4. **Probar crear cliente:**
   - Click en "Nuevo Cliente"
   - Llenar wizard
   - Click en "Crear Cliente"
   - ✅ Debería aparecer en la tabla

---

## ✅ PASO 5: Deploy a Vercel (ya está configurado)

El deploy se hace automáticamente al hacer push:
```bash
git push origin main
```

**PERO** necesitas configurar las variables de entorno en Vercel:

1. **Ir a Vercel Dashboard:**
   - https://vercel.com/aclaborda1010101/marketing-dashboard

2. **Settings → Environment Variables:**
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = `https://mxlrboojfctcoqtssfpy.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14bHJib29qZmN0Y29xdHNzZnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzQ4NjEsImV4cCI6MjA4NjExMDg2MX0.bJCvnsZ6Xyz41oBT0Qab-GIJ6X7IdSSmR7EDYahNfnA`

3. **Redeploy:**
   - Settings → Deployments → Click en "..." de la última → "Redeploy"

---

## ✅ LISTO!

El dashboard debería estar **100% funcional**:
- ✅ Crear clientes con wizard
- ✅ Ver clientes en tabla
- ✅ Upload de logos
- ✅ Stats actualizadas en tiempo real
- ✅ Dark theme + lime green
- ✅ Responsive

---

## 📝 Credenciales Recordatorio

**Supabase Project:** mxlrboojfctcoqtssfpy  
**URL:** https://supabase.com/dashboard/project/mxlrboojfctcoqtssfpy  
**Login:** GitHub (aclaborda1010101)

**Frontend:**
- Local: http://localhost:3000
- Producción: https://marketing-dashboard-two-iota.vercel.app

---

## 🐛 Si algo falla:

1. **Verificar tablas en Supabase:**
   - Table Editor → Deberías ver las 4 tablas

2. **Verificar .env.local:**
   - `cat .env.local` debe mostrar las URLs correctas

3. **Verificar bucket logos:**
   - Storage → Debe existir bucket `logos` público

4. **Verificar variables en Vercel:**
   - Environment Variables configuradas

5. **Verificar console del navegador:**
   - F12 → Console → Ver errores

---

**Si todo está bien, el wizard debería crear clientes reales que aparecen en la tabla inmediatamente.** 🎉
