'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ClubWithRelations, PlayerWithRelations, ContactWithRelations } from '@/types'
import { ArrowLeft, Building2, Users, Phone, Mail, Globe, MapPin, Edit, Trash2, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Utility function to convert Wikipedia file URLs to direct image URLs
const getImageUrl = (url: string): string => {
  if (!url) return ''
  
  // For Wikipedia URLs, we'll show the fallback icon for now
  if (url.includes('wikipedia.org')) {
    return '' // This will trigger the fallback Building2 icon
  }
  
  return url
}

// Club logo component
const ClubLogo = ({ club, size = 'large' }: { club: ClubWithRelations; size?: 'small' | 'large' }) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const logoUrl = getImageUrl(club.logo || '')
  const sizeClasses = size === 'large' ? 'h-24 w-24' : 'h-8 w-8'
  
  if (!logoUrl || imageError) {
    return <Building2 className={`${sizeClasses} text-gray-400`} />
  }
  
  return (
    <div className="relative flex items-center justify-center">
      {isLoading && (
        <div className={`${sizeClasses} rounded bg-gray-200 animate-pulse`} />
      )}
      <img 
        src={logoUrl} 
        alt={`${club.name} logo`}
        className={`${sizeClasses} object-contain ${isLoading ? 'hidden' : 'block'}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        loading="lazy"
      />
    </div>
  )
}

export default function ClubDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clubId = params.id as string

  const [club, setClub] = useState<ClubWithRelations | null>(null)
  const [players, setPlayers] = useState<PlayerWithRelations[]>([])
  const [contacts, setContacts] = useState<ContactWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClubDetails = async () => {
      try {
        setLoading(true)
        
        // Fetch club details
        const clubResponse = await fetch(`/api/clubs/${clubId}`)
        if (!clubResponse.ok) {
          throw new Error('Failed to fetch club details')
        }
        const clubData = await clubResponse.json()
        setClub(clubData)

        // Fetch related players
        const playersResponse = await fetch(`/api/players?clubId=${clubId}&pageSize=100`)
        if (playersResponse.ok) {
          const playersData = await playersResponse.json()
          setPlayers(playersData.data || [])
        }

        // Fetch related contacts
        const contactsResponse = await fetch(`/api/contacts?clubId=${clubId}&pageSize=100`)
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json()
          setContacts(contactsData.data || [])
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching club details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (clubId) {
      fetchClubDetails()
    }
  }, [clubId])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this club? This will also delete all related players and contacts.')) {
      try {
        await fetch(`/api/clubs/${clubId}`, { method: 'DELETE' })
        router.push('/clubs')
      } catch (error) {
        console.error('Error deleting club:', error)
        alert('Failed to delete club. Please try again.')
      }
    }
  }

  const handlePlayerAction = (playerId: string) => {
    router.push(`/players/${playerId}`)
  }

  const handleContactAction = (contactId: string) => {
    router.push(`/contacts/${contactId}`)
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading club details...</p>
        </div>
      </div>
    )
  }

  if (error || !club) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Club</h2>
          <p className="text-gray-600 mb-4">{error || 'Club not found'}</p>
          <Button onClick={() => router.push('/clubs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clubs
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
          <Button variant="ghost" onClick={() => router.push('/clubs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clubs
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Club Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push(`/clubs/${clubId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Club
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Club
          </Button>
        </div>
      </div>

      {/* Club Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <ClubLogo club={club} size="large" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{club.name}</h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{club.city}, {club.country}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{players.length} players</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{contacts.length} contacts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Club Details Grid */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {club.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a href={`mailto:${club.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
                    {club.email}
                  </a>
                </div>
              </div>
            )}
            
            {club.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <a href={`tel:${club.phone}`} className="text-green-600 hover:text-green-700 text-sm">
                    {club.phone}
                  </a>
                </div>
              </div>
            )}
            
            {club.website && (
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <a 
                    href={club.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    {club.website}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-gray-600 text-sm">{formatDate(club.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-gray-600 text-sm">{formatDate(club.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Players Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Players ({players.length})</h3>
            </div>
            <Button size="sm" onClick={() => router.push(`/players/new?clubId=${clubId}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Player
            </Button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          {players.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No players found for this club</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handlePlayerAction(player.id)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {player.firstName} {player.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">{player.position}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Age: {player.age}</p>
                    <p>Nationality: {player.nationality}</p>
                    {player.email && <p>Email: {player.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contacts Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Contacts ({contacts.length})</h3>
            </div>
            <Button size="sm" onClick={() => router.push(`/contacts/new?clubId=${clubId}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No contacts found for this club</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleContactAction(contact.id)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </h4>
                      <p className="text-sm text-gray-500">{contact.role}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Type: {contact.type}</p>
                    {contact.email && <p>Email: {contact.email}</p>}
                    {contact.phone && <p>Phone: {contact.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}