"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Megaphone, Calendar, BarChart3,
  CheckSquare, Settings, Sparkles, PanelLeftClose, PanelLeftOpen
} from "lucide-react"

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Campañas', href: '/campaigns', icon: Megaphone },
  { name: 'Calendario', href: '/calendar', icon: Calendar },
  { name: 'Aprobaciones', href: '/approvals', icon: CheckSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar({ currentPath }: { currentPath?: string }) {
  const pathname = usePathname()
  const activePath = currentPath || pathname
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sidebar-collapsed')
      if (saved === 'true') setCollapsed(true)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-current-width',
      collapsed ? '64px' : '240px'
    )
  }, [collapsed])

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev
      try { localStorage.setItem('sidebar-collapsed', next.toString()) } catch {}
      return next
    })
  }

  return (
    <aside
      className="fixed left-0 top-0 h-screen border-r z-40 overflow-hidden flex flex-col"
      style={{
        width: collapsed ? 64 : 240,
        backgroundColor: 'var(--dark-surface)',
        borderColor: 'var(--dark-border)',
        transition: 'width 0.2s ease'
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 py-5 border-b border-[var(--dark-border)] hover:bg-[var(--dark-surface-hover)] transition-colors">
        <div className="w-10 h-10 bg-lime-500 rounded-xl flex items-center justify-center shadow-lg glow-lime flex-shrink-0">
          <Sparkles className="w-5 h-5 text-black" />
        </div>
        {!collapsed && (
          <div className="whitespace-nowrap overflow-hidden">
            <h1 className="text-base font-bold text-white">ManIAS Marketing</h1>
            <p className="text-xs text-[var(--dark-text-subtle)]">Autonomous System</p>
          </div>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = activePath === item.href || (item.href !== '/' && activePath.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-lime-500/15 text-lime-400 font-medium'
                  : 'text-[var(--dark-text-muted)] hover:bg-[var(--dark-surface-hover)] hover:text-white'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        className="mx-3 mb-3 flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-[var(--dark-text-muted)] hover:bg-[var(--dark-surface-hover)] hover:text-white"
        title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
      >
        {collapsed
          ? <PanelLeftOpen className="w-4 h-4 flex-shrink-0" />
          : <><PanelLeftClose className="w-4 h-4 flex-shrink-0" /><span className="whitespace-nowrap">Colapsar</span></>
        }
      </button>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--dark-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-lime-500 text-black flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Director</p>
              <p className="text-xs text-[var(--dark-text-muted)] truncate">director@manias.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
