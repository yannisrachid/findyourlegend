'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ContactWithRelations } from '@/types'
import { ArrowLeft, Phone, Mail, Globe, MapPin, Edit, Trash2, Building2, Users, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'

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

export default function ContactDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string

  const [contact, setContact] = useState<ContactWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        setLoading(true)
        
        // Fetch contact details
        const contactResponse = await fetch(`/api/contacts/${contactId}`)
        if (!contactResponse.ok) {
          throw new Error('Failed to fetch contact details')
        }
        const contactData = await contactResponse.json()
        setContact(contactData)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching contact details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (contactId) {
      fetchContactDetails()
    }
  }, [contactId])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await fetch(`/api/contacts/${contactId}`, { method: 'DELETE' })
        router.push('/contacts')
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact. Please try again.')
      }
    }
  }

  const handleClubAction = () => {
    if (contact?.club) {
      router.push(`/clubs/${contact.club.id}`)
    }
  }

  const handlePlayerAction = () => {
    if (contact?.player) {
      router.push(`/players/${contact.player.id}`)
    }
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Phone className="h-12 w-12 text-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading contact details...</p>
        </div>
      </div>
    )
  }

  if (error || !contact) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Phone className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Contact</h2>
          <p className="text-gray-600 mb-4">{error || 'Contact not found'}</p>
          <Button onClick={() => router.push('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.push('/contacts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push(`/contacts/${contactId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Contact
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Contact
          </Button>
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="h-12 w-12 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {contact.firstName} {contact.lastName}
                </h2>
                <ContactTypeBadge type={contact.type} />
              </div>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{contact.role}</span>
                </div>
                {contact.club && (
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>Club Contact</span>
                  </div>
                )}
                {contact.player && (
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>Player Contact</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details Grid */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Role</p>
                <p className="text-gray-600 text-sm">{contact.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Type</p>
                <p className="text-gray-600 text-sm">{contact.type}</p>
              </div>
            </div>

            {contact.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
            
            {contact.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <a href={`tel:${contact.phone}`} className="text-green-600 hover:text-green-700 text-sm">
                    {contact.phone}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-gray-600 text-sm">{formatDate(contact.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-gray-600 text-sm">{formatDate(contact.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {contact.notes && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Related Club Section */}
      {contact.club && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Related Club</h3>
              </div>
              <Button size="sm" onClick={handleClubAction}>
                View Club Details
              </Button>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handleClubAction}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{contact.club.name}</h4>
                  <p className="text-sm text-gray-500">{contact.club.city}, {contact.club.country}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {contact.club.email && <p>Email: {contact.club.email}</p>}
                {contact.club.phone && <p>Phone: {contact.club.phone}</p>}
                {contact.club.website && <p>Website: {contact.club.website}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Related Player Section */}
      {contact.player && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Related Player</h3>
              </div>
              <Button size="sm" onClick={handlePlayerAction}>
                View Player Details
              </Button>
            </div>
          </div>
          
          <div className="px-6 py-4">
            <div
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={handlePlayerAction}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {contact.player.firstName} {contact.player.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{contact.player.position} • Age {contact.player.age}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Nationality: {contact.player.nationality}</p>
                {contact.player.email && <p>Email: {contact.player.email}</p>}
                {contact.player.phone && <p>Phone: {contact.player.phone}</p>}
                {contact.player.club && <p>Club: {contact.player.club.name}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}