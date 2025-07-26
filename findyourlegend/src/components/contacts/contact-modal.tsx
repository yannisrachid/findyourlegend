'use client'

import { useState, useEffect } from 'react'
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
  }, [contact, isOpen, defaultClubId, defaultPlayerId])

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs?pageSize=100')
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

    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts'
      const method = contact ? 'PUT' : 'POST'

      const contactData: ContactFormData = {
        ...formData,
        clubId: formData.type === 'CLUB' ? formData.clubId : undefined,
        playerId: formData.type === 'PLAYER' ? formData.playerId : undefined,
      }

      console.log('Submitting contact data:', contactData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Contact saved successfully:', result)
        onSave()
      } else {
        const errorData = await response.text()
        console.error('Server error:', response.status, errorData)
        alert(`Error: ${response.status} - ${errorData}`)
      }
    } catch (error) {
      console.error('Network error:', error)
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }

    setLoading(false)
  }

  const handleInputChange = (field: keyof ContactFormData, value: string | ContactType) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
            <div className="space-y-2">
              <Label htmlFor="clubId">Related Club *</Label>
              <Select
                id="clubId"
                required
                value={formData.clubId || ''}
                onChange={(e) => handleInputChange('clubId', e.target.value)}
              >
                <option value="">Select a club</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>
                    {club.name} - {club.city}
                  </option>
                ))}
              </Select>
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
                    {player.firstName} {player.lastName} ({player.club.name})
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