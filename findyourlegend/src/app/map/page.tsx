'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Building2, MapPin, Users } from 'lucide-react'

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

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cities')
        
        if (!response.ok) {
          throw new Error('Failed to fetch cities data')
        }
        
        const data: CitiesResponse = await response.json()
        setCities(data.cities)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching cities:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

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

  const totalClubs = cities.reduce((sum, city) => sum + city.clubs.length, 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">European Clubs Map</h1>
            <p className="text-gray-600">
              Explore {totalClubs} clubs across {cities.length} cities in Europe
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{cities.length}</div>
              <div className="text-sm text-gray-500">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalClubs}</div>
              <div className="text-sm text-gray-500">Clubs</div>
            </div>
          </div>
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
        ) : (
          <EuropeMap cities={cities} />
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