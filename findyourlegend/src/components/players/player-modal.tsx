'use client'

import { useState, useEffect, useRef } from 'react'
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
  defaultClubId?: string
}

export function PlayerModal({ isOpen, onClose, onSave, player, defaultClubId }: PlayerModalProps) {
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
  const [error, setError] = useState('')
  const [clubSearch, setClubSearch] = useState('')
  const [showClubDropdown, setShowClubDropdown] = useState(false)
  const clubDropdownRef = useRef<HTMLDivElement>(null)

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
      // Set club search text for existing player
      const playerClub = clubs.find(c => c.id === player.clubId)
      setClubSearch(playerClub ? `${playerClub.name} - ${playerClub.city}` : '')
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        age: '',
        position: '',
        nationality: '',
        clubId: defaultClubId || '',
        photo: '',
        email: '',
        phone: '',
      })
      // Set club search text for default club
      const defaultClub = clubs.find(c => c.id === defaultClubId)
      setClubSearch(defaultClub ? `${defaultClub.name} - ${defaultClub.city}` : '')
    }
    setError('') // Clear error when modal opens/closes
    setShowClubDropdown(false)
  }, [player, isOpen, defaultClubId, clubs])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = player ? `/api/players/${player.id}` : '/api/players'
      const method = player ? 'PUT' : 'POST'

      const playerData: PlayerFormData = {
        ...formData,
        age: parseInt(formData.age),
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playerData),
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
              <Select
                id="nationality"
                required
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
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

          <div className="space-y-2 relative" ref={clubDropdownRef}>
            <Label htmlFor="clubId">Club *</Label>
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
              {loading ? 'Saving...' : player ? 'Update Player' : 'Create Player'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}