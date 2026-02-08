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
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-md flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">AMOS v2.0</h1>
            <p className="text-xs text-gray-500">Marketing OS</p>
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
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <span>A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Director
            </p>
            <p className="text-xs text-gray-500 truncate">
              director@amos.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
