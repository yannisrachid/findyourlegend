'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { Building2, Users, Phone, Trophy, Map, Target, Mail, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    name: 'Prospection',
    href: '/prospection',
    icon: Target,
  },
  {
    name: 'Email',
    href: '/email',
    icon: Mail,
  },
  {
    name: 'Map',
    href: '/map',
    icon: Map,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
    }
  }

  return (
    <div className="flex w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img 
              src="/ylfc_logo_blue_nobg.png" 
              alt="YOUR LEGEND Logo" 
              className="w-full h-full object-contain"
            />
          </div>
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
      
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* User Info */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || 'Admin'}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>

        <div className="text-xs text-gray-500 text-center">
          © 2025 FindYourLegend CRM
        </div>
      </div>
    </div>
  )
}