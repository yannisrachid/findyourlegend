'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { PlayerWithRelations, PlayerFormData, Club } from '@/types'

interface PlayerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  player?: PlayerWithRelations | null
}

export function PlayerModal({ isOpen, onClose, onSave, player }: PlayerModalProps) {
  const [formData, setFormData] = useState<Omit<PlayerFormData, 'age'> & { age: string }>({
    firstName: '',
    lastName: '',
    age: '',
    position: '',
    nationality: '',
    clubId: '',
    photo: '',
    email: '',
    phone: '',
  })
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchClubs()
    }
  }, [isOpen])

  useEffect(() => {
    if (player) {
      setFormData({
        firstName: player.firstName,
        lastName: player.lastName,
        age: player.age.toString(),
        position: player.position,
        nationality: player.nationality,
        clubId: player.clubId,
        photo: player.photo || '',
        email: player.email || '',
        phone: player.phone || '',
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        position: '',
        nationality: '',
        clubId: '',
        photo: '',
        email: '',
        phone: '',
      })
    }
  }, [player, isOpen])

  const fetchClubs = async () => {
    try {
      const response = await fetch('/api/clubs?pageSize=100')
      const data = await response.json()
      setClubs(data.data)
    } catch (error) {
      console.error('Error fetching clubs:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = player ? `/api/players/${player.id}` : '/api/players'
      const method = player ? 'PUT' : 'POST'

      const playerData: PlayerFormData = {
        ...formData,
        age: parseInt(formData.age),
      }

      console.log('Submitting player data:', playerData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Player saved successfully:', result)
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{player ? 'Edit Player' : 'Create New Player'}</DialogTitle>
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

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                required
                min="16"
                max="50"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                required
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder="e.g., Forward, Midfielder"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                required
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="Nationality"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clubId">Club *</Label>
            <Select
              id="clubId"
              required
              value={formData.clubId}
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

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              type="url"
              value={formData.photo}
              onChange={(e) => handleInputChange('photo', e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="player@email.com"
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : player ? 'Update Player' : 'Create Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}