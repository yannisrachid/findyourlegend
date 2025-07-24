'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ClubWithRelations, ClubFormData } from '@/types'

interface ClubModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  club?: ClubWithRelations | null
}

export function ClubModal({ isOpen, onClose, onSave, club }: ClubModalProps) {
  const [formData, setFormData] = useState<ClubFormData>({
    name: '',
    city: '',
    country: '',
    logo: '',
    email: '',
    phone: '',
    website: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name,
        city: club.city,
        country: club.country,
        logo: club.logo || '',
        email: club.email || '',
        phone: club.phone || '',
        website: club.website || '',
      })
    } else {
      setFormData({
        name: '',
        city: '',
        country: '',
        logo: '',
        email: '',
        phone: '',
        website: '',
      })
    }
  }, [club, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = club ? `/api/clubs/${club.id}` : '/api/clubs'
      const method = club ? 'PUT' : 'POST'

      console.log('Submitting club data:', formData)
      console.log('URL:', url, 'Method:', method)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log('Success:', result)
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

  const handleInputChange = (field: keyof ClubFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{club ? 'Edit Club' : 'Create New Club'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Club name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                required
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Country"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                type="url"
                value={formData.logo}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@club.com"
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
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.club.com"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : club ? 'Update Club' : 'Create Club'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}