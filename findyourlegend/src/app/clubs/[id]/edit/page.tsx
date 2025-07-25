'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClubWithRelations, ClubFormData } from '@/types'
import { ArrowLeft, Save, X } from 'lucide-react'
import { ClubLogo } from '@/components/ui/club-logo'

export default function EditClubPage() {
  const params = useParams()
  const router = useRouter()
  const clubId = params.id as string

  const [club, setClub] = useState<ClubWithRelations | null>(null)
  const [formData, setFormData] = useState<ClubFormData>({
    name: '',
    city: '',
    country: '',
    logo: '',
    email: '',
    phone: '',
    website: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch club data
  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/clubs/${clubId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch club details')
        }
        
        const clubData: ClubWithRelations = await response.json()
        setClub(clubData)
        
        // Populate form data
        setFormData({
          name: clubData.name,
          city: clubData.city,
          country: clubData.country,
          logo: clubData.logo || '',
          email: clubData.email || '',
          phone: clubData.phone || '',
          website: clubData.website || '',
        })
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching club:', err)
      } finally {
        setLoading(false)
      }
    }

    if (clubId) {
      fetchClub()
    }
  }, [clubId])

  const handleInputChange = (field: keyof ClubFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      console.log('Updating club:', formData)
      
      const response = await fetch(`/api/clubs/${clubId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Club updated successfully:', result)
        
        // Redirect back to club details
        router.push(`/clubs/${clubId}`)
      } else {
        const errorData = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorData}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating club:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/clubs/${clubId}`)
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-blue-500 rounded mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading club details...</p>
        </div>
      </div>
    )
  }

  if (error && !club) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-500 rounded mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Club</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/clubs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clubs
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
            Back to Club Details
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Club</h1>
        </div>
      </div>

      {/* Current Logo Preview */}
      {club && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-6">
            <ClubLogo key={`${club.id}-${formData.logo}-edit`} club={{...club, logo: formData.logo}} size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Logo Preview</h3>
              <p className="text-sm text-gray-600">This is how the logo will appear with your current settings</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Club Information</h2>
          <p className="text-gray-600">Update the club's details below</p>
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
                <Label htmlFor="name">Club Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter club name"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                  className="w-full"
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
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Enter a URL to the club's logo image (Wikipedia URLs are supported)
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@club.com"
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
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.club.com"
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