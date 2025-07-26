'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Building2, MapPin, Users, RefreshCw, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Dynamically import the map component to avoid SSR issues
const EuropeMap = dynamic(() => import('@/components/map/europe-map'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  )
})

interface CityData {
  city: string
  country: string
  latitude: number
  longitude: number
  clubs: Array<{
    id: string
    name: string
    logo: string
  }>
}

interface CitiesResponse {
  cities: CityData[]
  total: number
}

export default function MapPage() {
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      const response = await fetch('/api/cities', {
        cache: 'no-store', // Ensure fresh data
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch cities data')
      }
      
      const data: CitiesResponse = await response.json()
      setCities(data.cities)
      console.log('Fetched cities data:', data.cities.length, 'cities with', data.total, 'total clubs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching cities:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  // Set up automatic refresh every 30 seconds when page is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden && !loading && !isRefreshing) {
        fetchCities(true)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [loading, isRefreshing])

  if (error) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Map</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  // Filter cities based on search term
  const filteredCities = cities.filter(city => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    
    // Search by city name or country
    const cityMatch = city.city.toLowerCase().includes(searchLower) ||
                     city.country.toLowerCase().includes(searchLower)
    
    // Search by club names
    const clubMatch = city.clubs.some(club => 
      club.name.toLowerCase().includes(searchLower)
    )
    
    return cityMatch || clubMatch
  })

  const totalClubs = cities.reduce((sum, city) => sum + city.clubs.length, 0)
  const filteredClubsCount = filteredCities.reduce((sum, city) => sum + city.clubs.length, 0)

  const clearSearch = () => setSearchTerm('')

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">European Clubs Map</h1>
            <p className="text-gray-600">
              {searchTerm ? (
                <>Showing {filteredClubsCount} clubs in {filteredCities.length} cities matching "{searchTerm}"</>
              ) : (
                <>Explore {totalClubs} clubs across {cities.length} cities in Europe</>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {searchTerm ? filteredCities.length : cities.length}
              </div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {searchTerm ? filteredClubsCount : totalClubs}
              </div>
              <div className="text-sm text-gray-500">Clubs</div>
            </div>
            <Button
              onClick={() => fetchCities(true)}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search cities or clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or type to search by city, country, or club name
            </p>
          )}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading cities and clubs...</p>
            </div>
          </div>
        ) : filteredCities.length === 0 && searchTerm ? (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                No cities or clubs match "{searchTerm}"
              </p>
              <Button onClick={clearSearch} variant="outline" size="sm">
                Clear search
              </Button>
            </div>
          </div>
        ) : (
          <EuropeMap cities={filteredCities} />
        )}
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">City with clubs</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-600">Hover for club details</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Map data from OpenStreetMap contributors
          </div>
        </div>
      </div>
    </div>
  )
}