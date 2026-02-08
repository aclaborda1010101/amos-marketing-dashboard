"use client"

import { 
  LayoutDashboard, 
  Users, 
  Megaphone,
  Calendar,
  BarChart3,
  CheckSquare,
  Settings,
  Sparkles
} from "lucide-react"

interface SidebarProps {
  currentPath?: string
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Campañas', href: '/campaigns', icon: Megaphone },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
  { name: 'Aprobaciones', href: '/approvals', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar({ currentPath = '/' }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Logo ManIAS */}
      <div className="px-4 py-5 border-b border-[var(--dark-border)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg glow-lime">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white">ManIAS Marketing</h1>
            <p className="text-xs text-[var(--dark-text-subtle)]">Autonomous System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.href
          
          return (
            <a
              key={item.name}
              href={item.href}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--dark-border)]">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <span>A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Director
            </p>
            <p className="text-xs text-[var(--dark-text-muted)] truncate">
              director@manias.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
