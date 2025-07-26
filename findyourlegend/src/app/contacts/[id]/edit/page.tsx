'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ContactWithRelations, ContactFormData, Club, Player, ContactType } from '@/types'
import { ArrowLeft, Save, X, Phone } from 'lucide-react'

// Contact type badge component
const ContactTypeBadge = ({ type }: { type: string }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'agent':
        return 'bg-purple-100 text-purple-800'
      case 'manager':
        return 'bg-blue-100 text-blue-800'
      case 'scout':
        return 'bg-green-100 text-green-800'
      case 'director':
        return 'bg-orange-100 text-orange-800'
      case 'coach':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
      {type}
    </span>
  )
}

export default function EditContactPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string

  const [contact, setContact] = useState<ContactWithRelations | null>(null)
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/contacts/${contactId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact details')
        }
        
        const contactData: ContactWithRelations = await response.json()
        setContact(contactData)
        
        // Populate form data
        setFormData({
          firstName: contactData.firstName,
          lastName: contactData.lastName,
          role: contactData.role,
          email: contactData.email || '',
          phone: contactData.phone || '',
          type: contactData.type,
          clubId: contactData.clubId || '',
          playerId: contactData.playerId || '',
          notes: contactData.notes || '',
        })
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching contact:', err)
      } finally {
        setLoading(false)
      }
    }

    if (contactId) {
      fetchContact()
    }
  }, [contactId])

  // Fetch clubs and players
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch clubs
        const clubsResponse = await fetch('/api/clubs?pageSize=100')
        const clubsData = await clubsResponse.json()
        setClubs(clubsData.data || [])

        // Fetch players
        const playersResponse = await fetch('/api/players?pageSize=100')
        const playersData = await playersResponse.json()
        setPlayers(playersData.data || [])
      } catch (error) {
        console.error('Error fetching clubs/players:', error)
      }
    }
    
    fetchData()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const contactData: ContactFormData = {
        ...formData,
        clubId: formData.type === 'CLUB' ? formData.clubId : undefined,
        playerId: formData.type === 'PLAYER' ? formData.playerId : undefined,
      }

      console.log('Updating contact:', contactData)
      
      const response = await fetch(`/api/contacts/${contactId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Contact updated successfully:', result)
        
        // Redirect back to contact details
        router.push(`/contacts/${contactId}`)
      } else {
        const errorData = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorData}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating contact:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/contacts/${contactId}`)
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-green-500 rounded-full mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    )
  }

  if (error && !contact) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-500 rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Contact</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contact Details
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Contact</h1>
        </div>
      </div>

      {/* Current Contact Preview */}
      {contact && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h3>
                <ContactTypeBadge type={formData.type} />
              </div>
              <p className="text-sm text-gray-600">{formData.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
          <p className="text-gray-600">Update the contact's details below</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  required
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g., Agent, Manager, Scout"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Contact Type *</Label>
                <Select
                  id="type"
                  required
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value as ContactType)}
                  className="w-full"
                >
                  <option value="CLUB">Club Contact</option>
                  <option value="PLAYER">Player Contact</option>
                </Select>
              </div>
            </div>

            {/* Related Entity Selection */}
            {formData.type === 'CLUB' && (
              <div className="space-y-2">
                <Label htmlFor="clubId">Related Club *</Label>
                <Select
                  id="clubId"
                  required
                  value={formData.clubId || ''}
                  onChange={(e) => handleInputChange('clubId', e.target.value)}
                  className="w-full"
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
                  className="w-full"
                >
                  <option value="">Select a player</option>
                  {players.map((player) => (
                    <option key={player.id} value={player.id}>
                      {player.firstName} {player.lastName} ({(player as any).club?.name || 'No club'})
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@email.com"
                    className="w-full"
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
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes about this contact..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}