'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ContactWithRelations, ContactFormData, Club, Player, ContactType } from '@/types'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  contact?: ContactWithRelations | null
  defaultClubId?: string
  defaultPlayerId?: string
}

export function ContactModal({ isOpen, onClose, onSave, contact, defaultClubId, defaultPlayerId }: ContactModalProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    type: 'CLUB',
    clubId: '',
    playerId: '',
    notes: '',
  })
  const [clubs, setClubs] = useState<Club[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clubSearch, setClubSearch] = useState('')
  const [showClubDropdown, setShowClubDropdown] = useState(false)
  const clubDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      fetchClubs()
      fetchPlayers()
    }
  }, [isOpen])

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName,
        lastName: contact.lastName,
        role: contact.role,
        email: contact.email || '',
        phone: contact.phone || '',
        type: contact.type,
        clubId: contact.clubId || '',
        playerId: contact.playerId || '',
        notes: contact.notes || '',
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        phone: '',
        type: defaultPlayerId ? 'PLAYER' : 'CLUB',
        clubId: defaultClubId || '',
        playerId: defaultPlayerId || '',
        notes: '',
      })
    }
    setError('') // Clear error when modal opens/closes
    setShowClubDropdown(false)
    
    // Set club search text
    if (contact && contact.clubId) {
      const contactClub = clubs.find(c => c.id === contact.clubId)
      setClubSearch(contactClub ? `${contactClub.name} - ${contactClub.city}` : '')
    } else if (defaultClubId) {
      const defaultClub = clubs.find(c => c.id === defaultClubId)
      setClubSearch(defaultClub ? `${defaultClub.name} - ${defaultClub.city}` : '')
    } else {
      setClubSearch('')
    }
  }, [contact, isOpen, defaultClubId, defaultPlayerId, clubs])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clubDropdownRef.current && !clubDropdownRef.current.contains(event.target as Node)) {
        setShowClubDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs?pageSize=1000') // Fetch more clubs
      const data = await response.json()
      setClubs(data.data)
    } catch (error) {
      console.error('Error fetching clubs:', error)
    }
  }

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players?pageSize=100')
      const data = await response.json()
      setPlayers(data.data)
    } catch (error) {
      console.error('Error fetching players:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts'
      const method = contact ? 'PUT' : 'POST'

      const contactData: ContactFormData = {
        ...formData,
        clubId: formData.type === 'CLUB' ? formData.clubId : undefined,
        playerId: formData.type === 'PLAYER' ? formData.playerId : undefined,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        const result = await response.json()
        onSave()
      } else {
        const errorData = await response.json()
        setError(errorData.error || `Error: ${response.status}`)
      }
    } catch (error) {
      setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    setLoading(false)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string | ContactType) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClubSearch = (value: string) => {
    setClubSearch(value)
    setShowClubDropdown(true)
    if (!value) {
      setFormData(prev => ({ ...prev, clubId: '' }))
    }
  }

  const handleClubSelect = (club: Club) => {
    setFormData(prev => ({ ...prev, clubId: club.id }))
    setClubSearch(`${club.name} - ${club.city}`)
    setShowClubDropdown(false)
  }

  const filteredClubs = clubs.filter(club =>
    `${club.name} ${club.city} ${club.country}`.toLowerCase().includes(clubSearch.toLowerCase())
  )

  const handleTypeChange = (type: ContactType) => {
    setFormData((prev) => ({
      ...prev,
      type,
      clubId: '',
      playerId: '',
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{contact ? 'Edit Contact' : 'Create New Contact'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                required
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                placeholder="e.g., Agent, Manager, Scout"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Contact Type *</Label>
              <Select
                id="type"
                required
                value={formData.type}
                onChange={(e) => handleTypeChange(e.target.value as ContactType)}
              >
                <option value="CLUB">Club Contact</option>
                <option value="PLAYER">Player Contact</option>
              </Select>
            </div>
          </div>

          {formData.type === 'CLUB' && (
            <div className="space-y-2 relative" ref={clubDropdownRef}>
              <Label htmlFor="clubId">Related Club *</Label>
              <Input
                id="clubId"
                type="text"
                required
                value={clubSearch}
                onChange={(e) => handleClubSearch(e.target.value)}
                onFocus={() => setShowClubDropdown(true)}
                placeholder="Type to search clubs..."
                className="w-full"
              />
              {showClubDropdown && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredClubs.length > 0 ? (
                    filteredClubs.map((club) => (
                      <div
                        key={club.id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleClubSelect(club)}
                      >
                        <div className="font-medium">{club.name}</div>
                        <div className="text-sm text-gray-500">{club.city}, {club.country}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500">No clubs found</div>
                  )}
                </div>
              )}
            </div>
          )}

          {formData.type === 'PLAYER' && (
            <div className="space-y-2">
              <Label htmlFor="playerId">Related Player *</Label>
              <Select
                id="playerId"
                required
                value={formData.playerId || ''}
                onChange={(e) => handleInputChange('playerId', e.target.value)}
              >
                <option value="">Select a player</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.firstName} {player.lastName} ({(player as any).club.name})
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this contact..."
              rows={3}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}