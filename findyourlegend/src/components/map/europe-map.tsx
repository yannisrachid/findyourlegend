'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Building2 } from 'lucide-react'

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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

interface EuropeMapProps {
  cities: CityData[]
}

// Custom marker icon
const createCustomIcon = (clubCount: number) => {
  const size = Math.min(30 + clubCount * 2, 50) // Size based on number of clubs
  
  return L.divIcon({
    html: `
      <div style="
        background-color: #3B82F6;
        border: 3px solid white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${clubCount > 9 ? '10px' : '12px'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${clubCount}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Component to set map bounds to show all markers
function MapBounds({ cities }: { cities: CityData[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (cities.length > 0) {
      const group = new L.FeatureGroup(
        cities.map(city => 
          L.marker([city.latitude, city.longitude])
        )
      )
      map.fitBounds(group.getBounds().pad(0.1))
    }
  }, [cities, map])
  
  return null
}

export default function EuropeMap({ cities }: EuropeMapProps) {
  const router = useRouter()
  const mapRef = useRef<L.Map | null>(null)

  const handleClubClick = (clubId: string) => {
    router.push(`/clubs/${clubId}`)
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[54.5260, 15.2551]} // Center of Europe
        zoom={4}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds cities={cities} />
        
        {cities.map((city, index) => (
          <Marker
            key={`${city.city}-${city.country}`}
            position={[city.latitude, city.longitude]}
            icon={createCustomIcon(city.clubs.length)}
          >
            <Popup
              maxWidth={300}
              className="city-popup"
            >
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-3">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {city.city}, {city.country}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {city.clubs.length} club{city.clubs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {city.clubs.map((club) => (
                    <div
                      key={club.id}
                      className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-colors cursor-pointer"
                      onClick={() => handleClubClick(club.id)}
                    >
                      <div className="flex-shrink-0">
                        {club.logo && !club.logo.includes('wikipedia.org') ? (
                          <img 
                            src={club.logo} 
                            alt={`${club.name} logo`}
                            className="h-6 w-6 object-contain rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.nextElementSibling!.classList.remove('hidden')
                            }}
                          />
                        ) : null}
                        <Building2 
                          className={`h-6 w-6 text-blue-500 ${club.logo && !club.logo.includes('wikipedia.org') ? 'hidden' : ''}`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate hover:text-blue-700">
                          {club.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .leaflet-popup-content {
          margin: 0;
          min-width: 200px;
        }
        
        .leaflet-popup-tip-container {
          margin-top: -1px;
        }
      `}</style>
    </div>
  )
}