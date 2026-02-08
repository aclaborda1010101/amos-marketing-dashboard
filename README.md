# AMOS v2.0 - Marketing Dashboard

**Autonomous Marketing Operating System**

Sistema completo de marketing virtualizado con 18 especialistas IA trabajando coordinadamente.

## 🌐 Demo Online

**URL:** https://marketing-dashboard-two-iota.vercel.app

## 🚀 Quick Start

### Frontend (Next.js 14)

```bash
cd marketing-dashboard
npm install
npm run dev
# http://localhost:3000
```

### Backend (FastAPI)

```bash
cd amos-system
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
# http://localhost:8000
# Docs: http://localhost:8000/docs
```

## 📊 Arquitectura

```
┌─────────────────────────────────────┐
│   FRONTEND (Next.js 14)             │
│   - Dashboard                       │
│   - Clientes                        │
│   - Aprobaciones                    │
│   - shadcn/ui components            │
│   📍 Vercel                         │
└─────────────────────────────────────┘
              ↕ HTTP/REST API
┌─────────────────────────────────────┐
│   BACKEND (FastAPI)                 │
│   - AMOS Core                       │
│   - State Machine                   │
│   - Event Bus                       │
│   - 15 REST endpoints               │
│   📍 Railway (producción)           │
└─────────────────────────────────────┘
              ↕ SQL Queries
┌─────────────────────────────────────┐
│   DATABASE (Supabase PostgreSQL)    │
│   - 15+ tables                      │
│   - Event sourcing                  │
│   - RLS policies                    │
│   📍 Supabase Cloud                 │
└─────────────────────────────────────┘
```

## 🎯 Features Implementadas

### ✅ Dashboard Global
- Quick stats (clientes, campañas, posts)
- Estado del sistema
- Features grid

### ✅ Gestión de Clientes
- Lista de clientes con cards
- Detalle de cliente
- Estados por departamento
- Crear/editar clientes

### ✅ Sistema de Aprobaciones
- Cola de aprobaciones pendientes
- Aprobar/rechazar propuestas
- Prioridades (P0/P1/P2)
- Stats de aprobaciones

### ✅ AMOS Core
- State Machine con enforcement
- Event Bus con audit trail
- Contracts ejecutables
- Observability layer

### ✅ 18 Especialistas IA
- CMO / Director
- Brand Strategist
- Creative Director
- Copywriter
- Social Media Strategist
- Community Manager
- Campaign Manager
- Paid Media Specialist
- Y 10 más...

## 🗂️ Estructura del Proyecto

```
marketing-dashboard/
├── app/
│   ├── page.tsx                    # Dashboard home
│   ├── layout.tsx                  # Layout con sidebar
│   ├── approvals/
│   │   └── page.tsx                # Cola de aprobaciones
│   └── clients/
│       ├── page.tsx                # Lista de clientes
│       └── [clientId]/
│           └── page.tsx            # Detalle de cliente
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   └── layout/
│       └── sidebar.tsx             # Navegación principal
│
├── lib/
│   ├── api.ts                      # API client
│   └── utils.ts                    # Helpers
│
└── hooks/
    └── use-toast.ts                # Toast notifications

amos-system/
├── main.py                         # FastAPI app
├── amos/
│   ├── core/
│   │   ├── state_machine.py        # Estado con enforcement
│   │   ├── event_bus.py            # Event sourcing
│   │   ├── enforcement.py          # Validaciones
│   │   ├── contracts.py            # Bot contracts
│   │   └── observability.py        # Logging
│   └── integrations/
│       └── supabase_client.py      # Database client
└── requirements.txt
```

## 🔧 Stack Tecnológico

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- SWR (data fetching)

**Backend:**
- Python 3.10+
- FastAPI
- Pydantic
- Supabase Python Client
- Anthropic Claude API

**Database:**
- PostgreSQL 15 (Supabase)
- Event Sourcing
- RLS Policies

**Deployment:**
- Frontend: Vercel
- Backend: Railway / Local
- Database: Supabase Cloud

## 📝 Variables de Entorno

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)

```bash
SUPABASE_URL=https://mxlrboojfctcoqtssfpy.supabase.co
SUPABASE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
```

## 🧪 Testing

```bash
# Backend tests
cd amos-system
pytest tests/

# Frontend tests (coming soon)
cd marketing-dashboard
npm test
```

## 📚 API Documentation

Swagger UI disponible en: http://localhost:8000/docs

### Endpoints Principales

```
GET  /                              # Info del sistema
GET  /health                        # Health check
GET  /api/dashboard/summary         # Dashboard stats
GET  /api/clients                   # Lista de clientes
GET  /api/clients/{id}              # Detalle de cliente
POST /api/clients                   # Crear cliente
GET  /api/approvals                 # Lista de aprobaciones
POST /api/approvals/{id}/decide     # Aprobar/rechazar
GET  /api/specialists               # 18 especialistas
```

## 🎯 Roadmap

### Semana 1 ✅ (85%)
- [x] Infraestructura
- [x] AMOS Core
- [x] Backend API
- [x] Frontend base

### Semana 2 🔄 (60%)
- [x] Dashboard global
- [x] Clientes
- [x] Aprobaciones
- [ ] Notificaciones

### Semana 3 ⏳ (30%)
- [x] Cliente detail
- [ ] Campañas flow
- [ ] Integración completa

### Semana 4 ⏳ (10%)
- [ ] Content calendar
- [ ] Metrics dashboard
- [ ] Deploy final

## 🤝 Contributing

Este es un proyecto privado. Para contribuir, contacta al equipo.

## 📄 License

Propietario - ManIAS Lab

## 👥 Team

- **Director:** Agustín
- **Development:** POTUS (IA)
- **Infrastructure:** CloudBot Network

---

**Version:** 2.0.0  
**Last Updated:** 2026-02-08
