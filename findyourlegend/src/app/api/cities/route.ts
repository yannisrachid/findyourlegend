import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Function to fetch coordinates from OpenStreetMap Nominatim API (free geocoding)
async function getCoordinatesFromGeocoding(city: string, country: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Use Nominatim API (free, no API key required)
    const query = encodeURIComponent(`${city}, ${country}`)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'FindYourLegend-App/1.0 (contact@yourlegendfc.com)', // Required by Nominatim
        },
      }
    )
    
    if (!response.ok) {
      console.error(`Geocoding API error for ${city}, ${country}: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      const result = data[0]
      const lat = parseFloat(result.lat)
      const lng = parseFloat(result.lon)
      
      if (!isNaN(lat) && !isNaN(lng)) {
        console.log(`Auto-geocoded ${city}, ${country}: lat=${lat}, lng=${lng}`)
        return { lat, lng }
      }
    }
    
    console.log(`No coordinates found for ${city}, ${country}`)
    return null
  } catch (error) {
    console.error(`Error geocoding ${city}, ${country}:`, error)
    return null
  }
}

interface CityWithClubs {
  city: string
  country: string
  latitude?: number
  longitude?: number
  clubs: Array<{
    id: string
    name: string
    logo: string
  }>
}

// Comprehensive geocoding data for European cities
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Belgium
  'Antwerp': { lat: 51.2194, lng: 4.4025 },
  'Beveren': { lat: 51.2149, lng: 4.2375 },
  'Boussu': { lat: 50.4342, lng: 3.7942 },
  'Bruges': { lat: 51.2085, lng: 3.2254 },
  'Brussels': { lat: 50.8503, lng: 4.3517 },
  'Charleroi': { lat: 50.4108, lng: 4.4446 },
  'Deinze': { lat: 50.9867, lng: 3.5219 },
  'Denderleeuw': { lat: 50.8858, lng: 4.0783 },
  'Eupen': { lat: 50.6275, lng: 6.0364 },
  'Genk': { lat: 50.9663, lng: 5.5047 },
  'Ghent': { lat: 51.0543, lng: 3.7174 },
  'Kortrijk': { lat: 50.8281, lng: 3.2648 },
  'La Louvière': { lat: 50.4833, lng: 4.1833 },
  'Leuven': { lat: 50.8798, lng: 4.7005 },
  'Lier': { lat: 51.1317, lng: 4.5703 },
  'Liège': { lat: 50.6326, lng: 5.5797 },
  'Lokeren': { lat: 51.1036, lng: 3.9933 },
  'Lommel': { lat: 51.2306, lng: 5.3125 },
  'Maasmechelen': { lat: 50.9696, lng: 5.6947 },
  'Mechelen': { lat: 51.0259, lng: 4.4777 },
  'Seraing': { lat: 50.6119, lng: 5.4953 },
  'Sint-Truiden': { lat: 50.8167, lng: 5.1867 },
  'Waregem': { lat: 50.8886, lng: 3.4267 },
  'Westerlo': { lat: 51.0906, lng: 4.9131 },
  
  // England
  'Birmingham': { lat: 52.4862, lng: -1.8904 },
  'Blackburn': { lat: 53.7475, lng: -2.4833 },
  'Bournemouth': { lat: 50.7192, lng: -1.8808 },
  'Brighton': { lat: 50.8225, lng: -0.1372 },
  'Bristol': { lat: 51.4545, lng: -2.5879 },
  'Burnley': { lat: 53.7889, lng: -2.2420 },
  'Coventry': { lat: 52.4068, lng: -1.5197 },
  'Derby': { lat: 52.9225, lng: -1.4746 },
  'Hull': { lat: 53.7457, lng: -0.3367 },
  'Ipswich': { lat: 52.0567, lng: 1.1482 },
  'Leeds': { lat: 53.8008, lng: -1.5491 },
  'Leicester': { lat: 52.6369, lng: -1.1398 },
  'Liverpool': { lat: 53.4084, lng: -2.9916 },
  'London': { lat: 51.5074, lng: -0.1278 },
  'Luton': { lat: 51.8781, lng: -0.4200 },
  'Manchester': { lat: 53.4808, lng: -2.2426 },
  'Middlesbrough': { lat: 54.5742, lng: -1.2356 },
  'Newcastle': { lat: 54.9783, lng: -1.6178 },
  'Norwich': { lat: 52.6309, lng: 1.2974 },
  'Nottingham': { lat: 52.9548, lng: -1.1581 },
  'Oxford': { lat: 51.7520, lng: -1.2577 },
  'Plymouth': { lat: 50.3755, lng: -4.1427 },
  'Portsmouth': { lat: 50.8058, lng: -1.0872 },
  'Preston': { lat: 53.7632, lng: -2.7031 },
  'Sheffield': { lat: 53.3811, lng: -1.4701 },
  'Southampton': { lat: 50.9097, lng: -1.4044 },
  'Stoke-on-Trent': { lat: 53.0027, lng: -2.1794 },
  'Sunderland': { lat: 54.9069, lng: -1.3838 },
  'Watford': { lat: 51.6554, lng: -0.3967 },
  'West Bromwich': { lat: 52.5186, lng: -1.9944 },
  'Wolverhampton': { lat: 52.5835, lng: -2.1282 },
  
  // France
  'Aix en Provence': { lat: 43.5297, lng: 5.4474 },
  'Ajaccio': { lat: 41.9196, lng: 8.7386 },
  'Amiens': { lat: 49.8942, lng: 2.2957 },
  'Angers': { lat: 47.4784, lng: -0.5632 },
  'Auxerre': { lat: 47.7975, lng: 3.5731 },
  'Bastia': { lat: 42.7026, lng: 9.4502 },
  'Brest': { lat: 48.3905, lng: -4.4861 },
  'Caen': { lat: 49.1829, lng: -0.3707 },
  'Clermont-Ferrand': { lat: 45.7797, lng: 3.0863 },
  'Dunkerque': { lat: 51.0342, lng: 2.3770 },
  'Grenoble': { lat: 45.1885, lng: 5.7245 },
  'Guingamp': { lat: 48.5618, lng: -3.1496 },
  'Laval': { lat: 48.0693, lng: -0.7700 },
  'Le Havre': { lat: 49.4944, lng: 0.1079 },
  'Lens': { lat: 50.4372, lng: 2.8031 },
  'Lille': { lat: 50.6292, lng: 3.0573 },
  'Lorient': { lat: 47.7482, lng: -3.3650 },
  'Lyon': { lat: 45.7640, lng: 4.8357 },
  'Marseille': { lat: 43.2965, lng: 5.3698 },
  'Martigues': { lat: 43.4057, lng: 5.0517 },
  'Metz': { lat: 49.1193, lng: 6.1757 },
  'Montpellier': { lat: 43.6110, lng: 3.8767 },
  'Nantes': { lat: 47.2184, lng: -1.5536 },
  'Nice': { lat: 43.7102, lng: 7.2620 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
  'Pau': { lat: 43.2951, lng: -0.3708 },
  'Reims': { lat: 49.2583, lng: 4.0317 },
  'Rennes': { lat: 48.1173, lng: -1.6778 },
  'Rodez': { lat: 44.3518, lng: 2.5747 },
  'Saint-Étienne': { lat: 45.4397, lng: 4.3872 },
  'Strasbourg': { lat: 48.5734, lng: 7.7521 },
  'Toulouse': { lat: 43.6047, lng: 1.4442 },
  'Troyes': { lat: 48.2973, lng: 4.0744 },
  'Valenciennes': { lat: 50.3592, lng: 3.5232 },
  
  // Germany
  'Augsburg': { lat: 48.3705, lng: 10.8978 },
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Bochum': { lat: 51.4818, lng: 7.2162 },
  'Braunschweig': { lat: 52.2689, lng: 10.5268 },
  'Bremen': { lat: 53.0793, lng: 8.8017 },
  'Cologne': { lat: 50.9375, lng: 6.9603 },
  'Darmstadt': { lat: 49.8728, lng: 8.6512 },
  'Dortmund': { lat: 51.5136, lng: 7.4653 },
  'Düsseldorf': { lat: 51.2277, lng: 6.7735 },
  'Elversberg': { lat: 49.2958, lng: 7.1214 },
  'Frankfurt': { lat: 50.1109, lng: 8.6821 },
  'Freiburg': { lat: 47.9990, lng: 7.8421 },
  'Fürth': { lat: 49.4775, lng: 10.9889 },
  'Gelsenkirchen': { lat: 51.5177, lng: 7.0857 },
  'Hamburg': { lat: 53.5511, lng: 9.9937 },
  'Hannover': { lat: 52.3759, lng: 9.7320 },
  'Heidenheim': { lat: 48.6761, lng: 10.1561 },
  'Hoffenheim': { lat: 49.2520, lng: 8.8808 },
  'Kaiserslautern': { lat: 49.4432, lng: 7.7690 },
  'Karlsruhe': { lat: 49.0069, lng: 8.4037 },
  'Kiel': { lat: 54.3233, lng: 10.1228 },
  'Leipzig': { lat: 51.3397, lng: 12.3731 },
  'Leverkusen': { lat: 51.0458, lng: 6.9742 },
  'Magdeburg': { lat: 52.1205, lng: 11.6276 },
  'Mainz': { lat: 49.9929, lng: 8.2473 },
  'Munich': { lat: 48.1351, lng: 11.5820 },
  'Mönchengladbach': { lat: 51.1805, lng: 6.4428 },
  'Münster': { lat: 51.9607, lng: 7.6261 },
  'Nuremberg': { lat: 49.4521, lng: 11.0767 },
  'Paderborn': { lat: 51.7189, lng: 8.7575 },
  'Regensburg': { lat: 49.0134, lng: 12.1016 },
  'Stuttgart': { lat: 48.7758, lng: 9.1829 },
  'Ulm': { lat: 48.3974, lng: 9.9934 },
  'Wolfsburg': { lat: 52.4227, lng: 10.7865 },
  
  // Italy
  'Avellino': { lat: 40.9146, lng: 14.7907 },
  'Bari': { lat: 41.1171, lng: 16.8719 },
  'Bergamo': { lat: 45.6983, lng: 9.6773 },
  'Bologna': { lat: 44.4949, lng: 11.3426 },
  'Brescia': { lat: 45.5416, lng: 10.2118 },
  'Cagliari': { lat: 39.2238, lng: 9.1217 },
  'Carrara': { lat: 44.0855, lng: 10.0971 },
  'Castellammare di Stabia': { lat: 40.7069, lng: 14.4896 },
  'Catanzaro': { lat: 38.9072, lng: 16.5947 },
  'Cesena': { lat: 44.1391, lng: 12.2431 },
  'Cittadella': { lat: 45.6447, lng: 11.7847 },
  'Como': { lat: 45.8081, lng: 9.0852 },
  'Cosenza': { lat: 39.2986, lng: 16.2542 },
  'Cremona': { lat: 45.1335, lng: 10.0422 },
  'Empoli': { lat: 43.7181, lng: 10.9477 },
  'Florence': { lat: 43.7696, lng: 11.2558 },
  'Frosinone': { lat: 41.6401, lng: 13.3401 },
  'Genoa': { lat: 44.4056, lng: 8.9463 },
  'La Spezia': { lat: 44.1069, lng: 9.8253 },
  'Lecce': { lat: 40.3515, lng: 18.1750 },
  'Mantova': { lat: 45.1564, lng: 10.7914 },
  'Milan': { lat: 45.4642, lng: 9.1900 },
  'Modena': { lat: 44.6477, lng: 10.9252 },
  'Monza': { lat: 45.5845, lng: 9.2744 },
  'Naples': { lat: 40.8518, lng: 14.2681 },
  'Palermo': { lat: 38.1157, lng: 13.3612 },
  'Parma': { lat: 44.8015, lng: 10.3279 },
  'Pisa': { lat: 43.7228, lng: 10.4017 },
  'Reggio Emilia': { lat: 44.6989, lng: 10.6297 },
  'Rome': { lat: 41.9028, lng: 12.4964 },
  'Salerno': { lat: 40.6824, lng: 14.7681 },
  'Sassuolo': { lat: 44.5464, lng: 10.7848 },
  'Turin': { lat: 45.0703, lng: 7.6869 },
  'Udine': { lat: 46.0748, lng: 13.2335 },
  'Venice': { lat: 45.4408, lng: 12.3155 },
  'Verona': { lat: 45.4384, lng: 10.9916 },
  
  // Monaco
  'Monaco': { lat: 43.7384, lng: 7.4246 },
  
  // Portugal
  'Alverca do Ribatejo': { lat: 38.8918, lng: -9.0328 },
  'Amadora': { lat: 38.7538, lng: -9.2305 },
  'Arouca': { lat: 40.9319, lng: -8.2442 },
  'Barcelos': { lat: 41.5388, lng: -8.6151 },
  'Braga': { lat: 41.5518, lng: -8.4229 },
  'Chaves': { lat: 41.7407, lng: -7.4677 },
  'Estoril': { lat: 38.7057, lng: -9.3976 },
  'Famalicão': { lat: 41.4076, lng: -8.5201 },
  'Faro': { lat: 37.0194, lng: -7.9322 },
  'Felgueiras': { lat: 41.3705, lng: -8.1936 },
  'Funchal': { lat: 32.6669, lng: -16.9241 },
  'Guimarães': { lat: 41.4417, lng: -8.2918 },
  'Leiria': { lat: 39.7437, lng: -8.8071 },
  'Lisbon': { lat: 38.7223, lng: -9.1393 },
  'Mafra': { lat: 38.9370, lng: -9.3258 },
  'Matosinhos': { lat: 41.1821, lng: -8.6900 },
  'Moreira de Cónegos': { lat: 41.3689, lng: -8.3447 },
  'Oliveira de Azeméis': { lat: 40.8439, lng: -8.4778 },
  'Penafiel': { lat: 41.2082, lng: -8.2811 },
  'Ponta Delgada': { lat: 37.7412, lng: -25.6756 },
  'Portimão': { lat: 37.1393, lng: -8.5376 },
  'Porto': { lat: 41.1579, lng: -8.6291 },
  'Póvoa de Varzim': { lat: 41.3804, lng: -8.7640 },
  'Santa Maria da Feira': { lat: 40.9267, lng: -8.5482 },
  'Tondela': { lat: 40.5159, lng: -8.0800 },
  'Torres Vedras': { lat: 39.0910, lng: -9.2593 },
  'Vila das Aves': { lat: 41.4076, lng: -8.4201 },
  'Vila do Conde': { lat: 41.3515, lng: -8.7407 },
  'Viseu': { lat: 40.6566, lng: -7.9138 },
  'Vizela': { lat: 41.3889, lng: -8.3000 },
  
  // Spain
  'A Coruña': { lat: 43.3623, lng: -8.4115 },
  'Albacete': { lat: 38.9942, lng: -1.8585 },
  'Almería': { lat: 36.8381, lng: -2.4597 },
  'Barcelona': { lat: 41.3851, lng: 2.1734 },
  'Bilbao': { lat: 43.2627, lng: -2.9253 },
  'Burgos': { lat: 42.3440, lng: -3.6969 },
  'Cartagena': { lat: 37.6063, lng: -0.9863 },
  'Castellón': { lat: 39.9864, lng: -0.0513 },
  'Cádiz': { lat: 36.5297, lng: -6.2920 },
  'Córdoba': { lat: 37.8882, lng: -4.7794 },
  'Eibar': { lat: 43.1847, lng: -2.4719 },
  'Elche': { lat: 38.2622, lng: -0.7011 },
  'Elda': { lat: 38.4783, lng: -0.7908 },
  'Ferrol': { lat: 43.4840, lng: -8.2336 },
  'Getafe': { lat: 40.3117, lng: -3.7327 },
  'Gijón': { lat: 43.5322, lng: -5.6611 },
  'Girona': { lat: 41.9794, lng: 2.8214 },
  'Granada': { lat: 37.1773, lng: -3.5986 },
  'Huesca': { lat: 42.1364, lng: -0.4087 },
  'Las Palmas': { lat: 28.1248, lng: -15.4300 },
  'Leganés': { lat: 40.3261, lng: -3.7633 },
  'Logroño': { lat: 42.4627, lng: -2.4455 },
  'Madrid': { lat: 40.4168, lng: -3.7038 },
  'Miranda de Ebro': { lat: 42.6863, lng: -2.9469 },
  'Málaga': { lat: 36.7213, lng: -4.4214 },
  'Oviedo': { lat: 43.3614, lng: -5.8593 },
  'Palma': { lat: 39.5696, lng: 2.6502 },
  'Pamplona': { lat: 42.8125, lng: -1.6458 },
  'San Sebastián': { lat: 43.3183, lng: -1.9812 },
  'Santa Cruz de Tenerife': { lat: 28.4636, lng: -16.2518 },
  'Santander': { lat: 43.4623, lng: -3.8099 },
  'Seville': { lat: 37.3891, lng: -5.9845 },
  'Valencia': { lat: 39.4699, lng: -0.3763 },
  'Valladolid': { lat: 41.6518, lng: -4.7245 },
  'Vigo': { lat: 42.2406, lng: -8.7207 },
  'Villarreal': { lat: 39.9389, lng: -0.1016 },
  'Vitoria-Gasteiz': { lat: 42.8467, lng: -2.6716 },
  'Zaragoza': { lat: 41.6488, lng: -0.8891 },
  
  // Wales
  'Cardiff': { lat: 51.4816, lng: -3.1791 },
  'Swansea': { lat: 51.6214, lng: -3.9436 },
}

function getCityKey(city: string, country: string): string {
  // Try exact match first
  if (CITY_COORDINATES[city]) {
    return city
  }
  
  // Try some common variations
  const variations = [
    city.replace(/\s+/g, ''),
    city.replace('-', ' '),
    city.replace(' ', '-'),
    city.split(' ')[0], // First word only
  ]
  
  for (const variation of variations) {
    if (CITY_COORDINATES[variation]) {
      return variation
    }
  }
  
  return ''
}

export async function GET(request: NextRequest) {
  try {
    console.log('Cities API: Fetching clubs data for map...')
    
    // Handle build-time environment gracefully
    if (!process.env.DATABASE_URL) {
      console.log('Cities API: No database URL available (build time), returning empty response')
      return NextResponse.json({
        cities: [],
        total: 0,
        unmappable: []
      })
    }
    
    // Get all clubs grouped by city and country
    let clubs = []
    try {
      clubs = await prisma.club.findMany({
        select: {
          id: true,
          name: true,
          city: true,
          country: true,
          logo: true,
        },
        orderBy: [
          { country: 'asc' },
          { city: 'asc' },
          { name: 'asc' }
        ]
      })
    } catch (dbError) {
      console.log('Cities API: Database connection failed (likely build time), returning empty response')
      return NextResponse.json({
        cities: [],
        total: 0,
        unmappable: []
      })
    }
    
    console.log(`Cities API: Found ${clubs.length} clubs in database`)

    // Group clubs by city
    const cityMap = new Map<string, CityWithClubs>()

    // First pass: group clubs and check for existing coordinates
    for (const club of clubs) {
      const key = `${club.city}, ${club.country}`
      
      if (!cityMap.has(key)) {
        const cityKey = getCityKey(club.city, club.country)
        const coordinates = cityKey ? CITY_COORDINATES[cityKey] : undefined
        
        cityMap.set(key, {
          city: club.city,
          country: club.country,
          latitude: coordinates?.lat,
          longitude: coordinates?.lng,
          clubs: []
        })
      }

      cityMap.get(key)!.clubs.push({
        id: club.id,
        name: club.name,
        logo: club.logo || '',
      })
    }

    // Second pass: auto-geocode cities without coordinates (skip during build)
    const citiesArray = Array.from(cityMap.values())
    const citiesNeedingCoordinates = citiesArray.filter(city => !city.latitude || !city.longitude)
    
    // Skip geocoding during build process to avoid timeouts
    // Build time is when we're in production but no runtime environment is available
    const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL && !request.url.includes('localhost')
    
    if (citiesNeedingCoordinates.length > 0 && !isBuildTime) {
      console.log(`Cities API: Auto-geocoding ${citiesNeedingCoordinates.length} cities without coordinates...`)
      
      // Process geocoding requests with a small delay to respect rate limits
      for (const city of citiesNeedingCoordinates) {
        try {
          const coordinates = await getCoordinatesFromGeocoding(city.city, city.country)
          
          if (coordinates) {
            city.latitude = coordinates.lat
            city.longitude = coordinates.lng
            console.log(`Cities API: Successfully geocoded ${city.city}, ${city.country}`)
          } else {
            console.log(`Cities API: Failed to geocode ${city.city}, ${city.country}`)
          }
          
          // Small delay to respect Nominatim rate limits (1 request per second)
          await new Promise(resolve => setTimeout(resolve, 1100))
        } catch (error) {
          console.log(`Cities API: Geocoding error for ${city.city}, ${city.country}:`, error)
        }
      }
    } else if (citiesNeedingCoordinates.length > 0) {
      console.log(`Cities API: Skipping geocoding during build time for ${citiesNeedingCoordinates.length} cities`)
    }

    const cities = Array.from(cityMap.values())
    
    // Only return cities that have coordinates (can be placed on map)
    const mappableCities = cities.filter(city => city.latitude && city.longitude)
    const unmappableCities = cities.filter(city => !city.latitude || !city.longitude)
    
    console.log(`Cities API: Found ${cities.length} total cities, ${mappableCities.length} mappable cities`)
    
    if (unmappableCities.length > 0) {
      console.log('Cities API: Unmappable cities (missing coordinates):')
      unmappableCities.forEach(city => {
        console.log(`  - ${city.city}, ${city.country} (${city.clubs.length} clubs)`)
        city.clubs.forEach(club => {
          console.log(`    • ${club.name}`)
        })
      })
    }

    const totalClubsCount = cities.reduce((sum, city) => sum + city.clubs.length, 0)

    return NextResponse.json({
      cities: mappableCities,
      total: totalClubsCount,
      unmappable: unmappableCities.map(city => ({
        city: city.city,
        country: city.country,
        clubs: city.clubs.length
      }))
    })

  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}