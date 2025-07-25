'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Building2, Users, Phone, Trophy, Map } from 'lucide-react'

const navigation = [
  {
    name: 'Clubs',
    href: '/clubs',
    icon: Building2,
  },
  {
    name: 'Players',
    href: '/players',
    icon: Users,
  },
  {
    name: 'Contacts',
    href: '/contacts',
    icon: Phone,
  },
  {
    name: 'Map',
    href: '/map',
    icon: Map,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Trophy className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">FindYourLegend</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 FindYourLegend CRM
        </div>
      </div>
    </div>
  )
}