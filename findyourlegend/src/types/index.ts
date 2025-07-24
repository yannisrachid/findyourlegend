import { Club, Player, Contact, ContactType } from '@/generated/prisma'

export type { Club, Player, Contact, ContactType }

export interface ClubWithRelations extends Club {
  players?: Player[]
  contacts?: Contact[]
  _count?: {
    players: number
    contacts: number
  }
}

export interface PlayerWithRelations extends Player {
  club: Club
  contacts?: Contact[]
  _count?: {
    contacts: number
  }
}

export interface ContactWithRelations extends Contact {
  club?: Club
  player?: Player
}

export interface ClubFormData {
  name: string
  city: string
  country: string
  logo?: string
  email?: string
  phone?: string
  website?: string
}

export interface PlayerFormData {
  firstName: string
  lastName: string
  age: number
  position: string
  nationality: string
  clubId: string
  photo?: string
  email?: string
  phone?: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  role: string
  email?: string
  phone?: string
  type: ContactType
  clubId?: string
  playerId?: string
  notes?: string
}

export interface TablePagination {
  page: number
  pageSize: number
  search?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}