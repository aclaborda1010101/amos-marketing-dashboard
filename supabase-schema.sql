-- ============================================
-- MANIAS MARKETING - DATABASE SCHEMA
-- Supabase / PostgreSQL
-- ============================================

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
