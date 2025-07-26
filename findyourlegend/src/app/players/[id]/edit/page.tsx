'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { PlayerWithRelations, PlayerFormData, Club } from '@/types'
import { ArrowLeft, Save, X, Users } from 'lucide-react'

// Player photo component
const PlayerPhotoPreview = ({ player, size = 'large' }: { player: PlayerWithRelations; size?: 'small' | 'large' }) => {
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

export default function EditPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const playerId = params.id as string

  const [player, setPlayer] = useState<PlayerWithRelations | null>(null)
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch player data
  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/players/${playerId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch player details')
        }
        
        const playerData: PlayerWithRelations = await response.json()
        setPlayer(playerData)
        
        // Populate form data
        setFormData({
          firstName: playerData.firstName,
          lastName: playerData.lastName,
          age: playerData.age.toString(),
          position: playerData.position,
          nationality: playerData.nationality,
          clubId: playerData.clubId,
          photo: playerData.photo || '',
          email: playerData.email || '',
          phone: playerData.phone || '',
        })
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching player:', err)
      } finally {
        setLoading(false)
      }
    }

    if (playerId) {
      fetchPlayer()
    }
  }, [playerId])

  // Fetch clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('/api/clubs?pageSize=100')
        const data = await response.json()
        setClubs(data.data || [])
      } catch (error) {
        console.error('Error fetching clubs:', error)
      }
    }
    
    fetchClubs()
  }, [])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const playerData: PlayerFormData = {
        ...formData,
        age: parseInt(formData.age),
      }

      console.log('Updating player:', playerData)
      
      const response = await fetch(`/api/players/${playerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Player updated successfully:', result)
        
        // Redirect back to player details
        router.push(`/players/${playerId}`)
      } else {
        const errorData = await response.text()
        throw new Error(`Server error: ${response.status} - ${errorData}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Error updating player:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push(`/players/${playerId}`)
  }

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-blue-500 rounded-full mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading player details...</p>
        </div>
      </div>
    )
  }

  if (error && !player) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-500 rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Player</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => router.push('/players')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Players
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
            Back to Player Details
          </Button>
          <div className="h-8 w-px bg-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Player</h1>
        </div>
      </div>

      {/* Current Photo Preview */}
      {player && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-6">
            <PlayerPhotoPreview key={`${player.id}-${formData.photo}-edit`} player={{...player, photo: formData.photo || null}} size="large" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Photo Preview</h3>
              <p className="text-sm text-gray-600">This is how the photo will appear with your current settings</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Player Information</h2>
          <p className="text-gray-600">Update the player's details below</p>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full"
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
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Select
                  id="nationality"
                  required
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full"
                >
                  <option value="">Select nationality</option>
                  <option value="Afghan">Afghan</option>
                  <option value="Albanian">Albanian</option>
                  <option value="Algerian">Algerian</option>
                  <option value="American">American</option>
                  <option value="Andorran">Andorran</option>
                  <option value="Angolan">Angolan</option>
                  <option value="Argentinian">Argentinian</option>
                  <option value="Armenian">Armenian</option>
                  <option value="Australian">Australian</option>
                  <option value="Austrian">Austrian</option>
                  <option value="Azerbaijani">Azerbaijani</option>
                  <option value="Bahraini">Bahraini</option>
                  <option value="Bangladeshi">Bangladeshi</option>
                  <option value="Barbadian">Barbadian</option>
                  <option value="Belarusian">Belarusian</option>
                  <option value="Belgian">Belgian</option>
                  <option value="Belizean">Belizean</option>
                  <option value="Beninese">Beninese</option>
                  <option value="Bhutanese">Bhutanese</option>
                  <option value="Bolivian">Bolivian</option>
                  <option value="Bosnian">Bosnian</option>
                  <option value="Botswanan">Botswanan</option>
                  <option value="Brazilian">Brazilian</option>
                  <option value="British">British</option>
                  <option value="Bruneian">Bruneian</option>
                  <option value="Bulgarian">Bulgarian</option>
                  <option value="Burkinabe">Burkinabe</option>
                  <option value="Burmese">Burmese</option>
                  <option value="Burundian">Burundian</option>
                  <option value="Cambodian">Cambodian</option>
                  <option value="Cameroonian">Cameroonian</option>
                  <option value="Canadian">Canadian</option>
                  <option value="Cape Verdean">Cape Verdean</option>
                  <option value="Central African">Central African</option>
                  <option value="Chadian">Chadian</option>
                  <option value="Chilean">Chilean</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Colombian">Colombian</option>
                  <option value="Comoran">Comoran</option>
                  <option value="Congolese">Congolese</option>
                  <option value="Costa Rican">Costa Rican</option>
                  <option value="Croatian">Croatian</option>
                  <option value="Cuban">Cuban</option>
                  <option value="Cypriot">Cypriot</option>
                  <option value="Czech">Czech</option>
                  <option value="Danish">Danish</option>
                  <option value="Djiboutian">Djiboutian</option>
                  <option value="Dominican">Dominican</option>
                  <option value="Dutch">Dutch</option>
                  <option value="East Timorese">East Timorese</option>
                  <option value="Ecuadorean">Ecuadorean</option>
                  <option value="Egyptian">Egyptian</option>
                  <option value="Emirian">Emirian</option>
                  <option value="English">English</option>
                  <option value="Equatorial Guinean">Equatorial Guinean</option>
                  <option value="Eritrean">Eritrean</option>
                  <option value="Estonian">Estonian</option>
                  <option value="Ethiopian">Ethiopian</option>
                  <option value="Fijian">Fijian</option>
                  <option value="Filipino">Filipino</option>
                  <option value="Finnish">Finnish</option>
                  <option value="French">French</option>
                  <option value="Gabonese">Gabonese</option>
                  <option value="Gambian">Gambian</option>
                  <option value="Georgian">Georgian</option>
                  <option value="German">German</option>
                  <option value="Ghanaian">Ghanaian</option>
                  <option value="Greek">Greek</option>
                  <option value="Grenadian">Grenadian</option>
                  <option value="Guatemalan">Guatemalan</option>
                  <option value="Guinea-Bissauan">Guinea-Bissauan</option>
                  <option value="Guinean">Guinean</option>
                  <option value="Guyanese">Guyanese</option>
                  <option value="Haitian">Haitian</option>
                  <option value="Herzegovinian">Herzegovinian</option>
                  <option value="Honduran">Honduran</option>
                  <option value="Hungarian">Hungarian</option>
                  <option value="I-Kiribati">I-Kiribati</option>
                  <option value="Icelander">Icelander</option>
                  <option value="Indian">Indian</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Iranian">Iranian</option>
                  <option value="Iraqi">Iraqi</option>
                  <option value="Irish">Irish</option>
                  <option value="Israeli">Israeli</option>
                  <option value="Italian">Italian</option>
                  <option value="Ivorian">Ivorian</option>
                  <option value="Jamaican">Jamaican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Jordanian">Jordanian</option>
                  <option value="Kazakhstani">Kazakhstani</option>
                  <option value="Kenyan">Kenyan</option>
                  <option value="Kittian and Nevisian">Kittian and Nevisian</option>
                  <option value="Kuwaiti">Kuwaiti</option>
                  <option value="Kyrgyz">Kyrgyz</option>
                  <option value="Laotian">Laotian</option>
                  <option value="Latvian">Latvian</option>
                  <option value="Lebanese">Lebanese</option>
                  <option value="Liberian">Liberian</option>
                  <option value="Libyan">Libyan</option>
                  <option value="Liechtensteiner">Liechtensteiner</option>
                  <option value="Lithuanian">Lithuanian</option>
                  <option value="Luxembourgish">Luxembourgish</option>
                  <option value="Macedonian">Macedonian</option>
                  <option value="Malagasy">Malagasy</option>
                  <option value="Malawian">Malawian</option>
                  <option value="Malaysian">Malaysian</option>
                  <option value="Maldivan">Maldivan</option>
                  <option value="Malian">Malian</option>
                  <option value="Maltese">Maltese</option>
                  <option value="Marshallese">Marshallese</option>
                  <option value="Mauritanian">Mauritanian</option>
                  <option value="Mauritian">Mauritian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Micronesian">Micronesian</option>
                  <option value="Moldovan">Moldovan</option>
                  <option value="Monacan">Monacan</option>
                  <option value="Mongolian">Mongolian</option>
                  <option value="Moroccan">Moroccan</option>
                  <option value="Mosotho">Mosotho</option>
                  <option value="Motswana">Motswana</option>
                  <option value="Mozambican">Mozambican</option>
                  <option value="Namibian">Namibian</option>
                  <option value="Nauruan">Nauruan</option>
                  <option value="Nepalese">Nepalese</option>
                  <option value="New Zealander">New Zealander</option>
                  <option value="Ni-Vanuatu">Ni-Vanuatu</option>
                  <option value="Nicaraguan">Nicaraguan</option>
                  <option value="Nigerian">Nigerian</option>
                  <option value="Nigerien">Nigerien</option>
                  <option value="North Korean">North Korean</option>
                  <option value="Northern Irish">Northern Irish</option>
                  <option value="Norwegian">Norwegian</option>
                  <option value="Omani">Omani</option>
                  <option value="Pakistani">Pakistani</option>
                  <option value="Palauan">Palauan</option>
                  <option value="Panamanian">Panamanian</option>
                  <option value="Papua New Guinean">Papua New Guinean</option>
                  <option value="Paraguayan">Paraguayan</option>
                  <option value="Peruvian">Peruvian</option>
                  <option value="Polish">Polish</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Qatari">Qatari</option>
                  <option value="Romanian">Romanian</option>
                  <option value="Russian">Russian</option>
                  <option value="Rwandan">Rwandan</option>
                  <option value="Saint Lucian">Saint Lucian</option>
                  <option value="Salvadoran">Salvadoran</option>
                  <option value="Samoan">Samoan</option>
                  <option value="San Marinese">San Marinese</option>
                  <option value="Sao Tomean">Sao Tomean</option>
                  <option value="Saudi">Saudi</option>
                  <option value="Scottish">Scottish</option>
                  <option value="Senegalese">Senegalese</option>
                  <option value="Serbian">Serbian</option>
                  <option value="Seychellois">Seychellois</option>
                  <option value="Sierra Leonean">Sierra Leonean</option>
                  <option value="Singaporean">Singaporean</option>
                  <option value="Slovakian">Slovakian</option>
                  <option value="Slovenian">Slovenian</option>
                  <option value="Solomon Islander">Solomon Islander</option>
                  <option value="Somali">Somali</option>
                  <option value="South African">South African</option>
                  <option value="South Korean">South Korean</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Sri Lankan">Sri Lankan</option>
                  <option value="Sudanese">Sudanese</option>
                  <option value="Surinamer">Surinamer</option>
                  <option value="Swazi">Swazi</option>
                  <option value="Swedish">Swedish</option>
                  <option value="Swiss">Swiss</option>
                  <option value="Syrian">Syrian</option>
                  <option value="Taiwanese">Taiwanese</option>
                  <option value="Tajik">Tajik</option>
                  <option value="Tanzanian">Tanzanian</option>
                  <option value="Thai">Thai</option>
                  <option value="Togolese">Togolese</option>
                  <option value="Tongan">Tongan</option>
                  <option value="Trinidadian or Tobagonian">Trinidadian or Tobagonian</option>
                  <option value="Tunisian">Tunisian</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Tuvaluan">Tuvaluan</option>
                  <option value="Ugandan">Ugandan</option>
                  <option value="Ukrainian">Ukrainian</option>
                  <option value="Uruguayan">Uruguayan</option>
                  <option value="Uzbekistani">Uzbekistani</option>
                  <option value="Venezuelan">Venezuelan</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Welsh">Welsh</option>
                  <option value="Yemenite">Yemenite</option>
                  <option value="Zambian">Zambian</option>
                  <option value="Zimbabwean">Zimbabwean</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clubId">Club *</Label>
                <Select
                  id="clubId"
                  required
                  value={formData.clubId}
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
              
              <div className="space-y-2">
                <Label htmlFor="photo">Photo URL</Label>
                <Input
                  id="photo"
                  type="url"
                  value={formData.photo}
                  onChange={(e) => handleInputChange('photo', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Enter a URL to the player's photo
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
                    placeholder="player@email.com"
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