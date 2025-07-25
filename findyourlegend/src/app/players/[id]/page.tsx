'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PlayerWithRelations, ContactWithRelations } from '@/types'
import { ArrowLeft, Users, Phone, Mail, Globe, MapPin, Edit, Trash2, Plus, Building2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

// Player photo component
const PlayerPhoto = ({ player, size = 'large' }: { player: PlayerWithRelations; size?: 'small' | 'large' }) => {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const photoUrl = player.photo || ''
  const sizeClasses = size === 'large' ? 'h-24 w-24' : 'h-8 w-8'
  
  if (!photoUrl || imageError) {
    return (
      <div className={`${sizeClasses} rounded-full bg-blue-100 flex items-center justify-center`}>
        <Users className={`${size === 'large' ? 'h-12 w-12' : 'h-4 w-4'} text-blue-600`} />
      </div>
    )
  }
  
  return (
    <div className="relative flex items-center justify-center">
      {isLoading && (
        <div className={`${sizeClasses} rounded-full bg-gray-200 animate-pulse`} />
      )}
      <img 
        src={photoUrl} 
        alt={`${player.firstName} ${player.lastName}`}
        className={`${sizeClasses} object-cover rounded-full ${isLoading ? 'hidden' : 'block'}`}
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

export default function PlayerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const playerId = params.id as string

  const [player, setPlayer] = useState<PlayerWithRelations | null>(null)
  const [contacts, setContacts] = useState<ContactWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        setLoading(true)
        
        // Fetch player details
        const playerResponse = await fetch(`/api/players/${playerId}`)
        if (!playerResponse.ok) {
          throw new Error('Failed to fetch player details')
        }
        const playerData = await playerResponse.json()
        setPlayer(playerData)

        // Fetch related contacts
        const contactsResponse = await fetch(`/api/contacts?playerId=${playerId}&pageSize=100`)
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json()
          setContacts(contactsData.data || [])
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching player details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (playerId) {
      fetchPlayerDetails()
    }
  }, [playerId])

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this player? This will also delete all related contacts.')) {
      try {
        await fetch(`/api/players/${playerId}`, { method: 'DELETE' })
        router.push('/players')
      } catch (error) {
        console.error('Error deleting player:', error)
        alert('Failed to delete player. Please try again.')
      }
    }
  }

  const handleContactAction = (contactId: string) => {
    router.push(`/contacts/${contactId}`)
  }

  const handleClubAction = () => {
    if (player?.club) {
      router.push(`/clubs/${player.club.id}`)
    }
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading player details...</p>
        </div>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Player</h2>
          <p className="text-gray-600 mb-4">{error || 'Player not found'}</p>
          <Button onClick={() => router.push('/players')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Players
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
          <Button variant="ghost" onClick={() => router.push('/players')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Players
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Player Details</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push(`/players/${playerId}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Player
          </Button>
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Player
          </Button>
        </div>
      </div>

      {/* Player Information Card */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-6">
            <PlayerPhoto player={player} size="large" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {player.firstName} {player.lastName}
              </h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{player.position}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{player.nationality}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Building2 className="h-4 w-4" />
                  <span>Age {player.age}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>{contacts.length} contacts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Player Details Grid */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Position</p>
                <p className="text-gray-600 text-sm">{player.position}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Nationality</p>
                <p className="text-gray-600 text-sm">{player.nationality}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Age</p>
                <p className="text-gray-600 text-sm">{player.age} years old</p>
              </div>
            </div>

            {player.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a href={`mailto:${player.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
                    {player.email}
                  </a>
                </div>
              </div>
            )}
            
            {player.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <a href={`tel:${player.phone}`} className="text-green-600 hover:text-green-700 text-sm">
                    {player.phone}
                  </a>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-gray-600 text-sm">{formatDate(player.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-gray-600 text-sm">{formatDate(player.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Club Section */}
      {player.club && (
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Current Club</h3>
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
                  <h4 className="font-medium text-gray-900">{player.club.name}</h4>
                  <p className="text-sm text-gray-500">{player.club.city}, {player.club.country}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {player.club.email && <p>Email: {player.club.email}</p>}
                {player.club.phone && <p>Phone: {player.club.phone}</p>}
                {player.club.website && <p>Website: {player.club.website}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contacts Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Contacts ({contacts.length})</h3>
            </div>
            <Button size="sm" onClick={() => router.push(`/contacts/new?playerId=${playerId}`)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          {contacts.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No contacts found for this player</p>
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
                    {contact.notes && <p>Notes: {contact.notes}</p>}
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