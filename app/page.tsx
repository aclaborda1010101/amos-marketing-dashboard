export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AMOS v2.0
          </h1>
          <p className="text-2xl text-slate-600">
            Autonomous Marketing Operating System
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Clientes Activos", value: "3", color: "blue" },
            { label: "Campañas en Curso", value: "5", color: "purple" },
            { label: "Posts Este Mes", value: "47", color: "green" },
            { label: "Aprobaciones Pendientes", value: "2", color: "orange" }
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
              <div className="text-4xl font-bold text-slate-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "18 Especialistas IA",
              desc: "Equipo completo de marketing virtualizado",
              icon: "👥"
            },
            {
              title: "State Machine",
              desc: "Gestión de estados con enforcement",
              icon: "⚙️"
            },
            {
              title: "Event Sourcing",
              desc: "Audit trail completo y replayable",
              icon: "📊"
            },
            {
              title: "Brand DNA",
              desc: "Generación y validación automática",
              icon: "🧬"
            },
            {
              title: "Content Calendar",
              desc: "Planificación mensual automatizada",
              icon: "📅"
            },
            {
              title: "Campaign Manager",
              desc: "Orquestación multi-canal",
              icon: "🚀"
            }
          ].map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Estado del Sistema</h2>
          <div className="space-y-4">
            {[
              { component: "AMOS Core", status: "Operational", color: "green" },
              { component: "Event Bus", status: "Operational", color: "green" },
              { component: "State Machine", status: "Operational", color: "green" },
              { component: "Supabase Database", status: "Connected", color: "green" },
              { component: "Anthropic Claude", status: "Ready", color: "green" },
              { component: "18 Specialist Bots", status: "Standby", color: "blue" }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-900">{item.component}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500">
          <p className="text-sm">AMOS v2.0 MVP - Marketing Dashboard</p>
          <p className="text-xs mt-2">Built with Next.js 14 + FastAPI + Supabase + Anthropic Claude</p>
        </div>
      </div>
    </div>
  )
}
