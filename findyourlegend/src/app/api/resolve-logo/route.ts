import { NextRequest, NextResponse } from 'next/server'

interface LogoResolutionResult {
  success: boolean
  workingUrl?: string
  testedUrls: string[]
  method?: string
  error?: string
}

/**
 * Server-side logo resolution that tries multiple strategies
 */
async function resolveWikipediaLogo(originalUrl: string): Promise<LogoResolutionResult> {
  const result: LogoResolutionResult = {
    success: false,
    testedUrls: []
  }

  if (!originalUrl || !originalUrl.includes('wikipedia.org')) {
    result.error = 'Not a Wikipedia URL'
    return result
  }

  // Extract filename
  let filename = ''
  if (originalUrl.includes('/wiki/File:')) {
    filename = originalUrl.split('/wiki/File:')[1]
  } else {
    result.error = 'Invalid Wikipedia File URL format'
    return result
  }

  filename = decodeURIComponent(filename.split('#')[0].split('?')[0])
  console.log(`🔍 Resolving logo for filename: ${filename}`)

  // Strategy 1: Try Wikipedia API first
  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`
    console.log(`📡 Trying Commons API: ${apiUrl}`)
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'FindYourLegend/1.0 (https://findyourlegend.com)',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      const data = await response.json()
      const pages = data.query?.pages
      
      if (pages) {
        const pageIds = Object.keys(pages)
        const firstPage = pages[pageIds[0]]
        
        if (firstPage?.imageinfo && firstPage.imageinfo.length > 0) {
          const imageInfo = firstPage.imageinfo[0]
          const imageUrl = imageInfo.url
          
          if (imageUrl) {
            // Test if the URL actually works
            try {
              const testResponse = await fetch(imageUrl, { 
                method: 'HEAD', 
                signal: AbortSignal.timeout(5000),
                headers: {
                  'User-Agent': 'FindYourLegend/1.0'
                }
              })
              
              if (testResponse.ok) {
                console.log(`✅ Commons API success: ${imageUrl}`)
                result.success = true
                result.workingUrl = imageUrl
                result.method = 'Wikimedia Commons API'
                result.testedUrls.push(imageUrl)
                return result
              } else {
                console.log(`❌ Commons API URL test failed: ${testResponse.status}`)
              }
            } catch (testError) {
              console.log(`❌ Commons API URL test error:`, testError)
            }
          }
        }
      }
    }
    console.log(`❌ Commons API failed or no results`)
  } catch (error) {
    console.log('❌ Commons API error:', error)
  }

  // Strategy 2: Try English Wikipedia API
  try {
    const enApiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`
    console.log(`📡 Trying English Wikipedia API: ${enApiUrl}`)
    
    const response = await fetch(enApiUrl, {
      headers: {
        'User-Agent': 'FindYourLegend/1.0 (https://findyourlegend.com)',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      const data = await response.json()
      const pages = data.query?.pages
      
      if (pages) {
        const pageIds = Object.keys(pages)
        const firstPage = pages[pageIds[0]]
        
        if (firstPage?.imageinfo && firstPage.imageinfo.length > 0) {
          const imageInfo = firstPage.imageinfo[0]
          const imageUrl = imageInfo.url
          
          if (imageUrl) {
            try {
              const testResponse = await fetch(imageUrl, { 
                method: 'HEAD', 
                signal: AbortSignal.timeout(5000),
                headers: {
                  'User-Agent': 'FindYourLegend/1.0'
                }
              })
              
              if (testResponse.ok) {
                console.log(`✅ English Wikipedia API success: ${imageUrl}`)
                result.success = true
                result.workingUrl = imageUrl
                result.method = 'English Wikipedia API'
                result.testedUrls.push(imageUrl)
                return result
              }
            } catch (testError) {
              console.log(`❌ English Wikipedia URL test error:`, testError)
            }
          }
        }
      }
    }
  } catch (error) {
    console.log('❌ English Wikipedia API error:', error)
  }

  // Strategy 3: Try direct URL patterns
  const directUrls = [
    `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`,
    `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=200`,
    `https://en.wikipedia.org/wiki/Special:FilePath/${filename}`,
    `https://upload.wikimedia.org/wikipedia/commons/${filename}`,
    `https://upload.wikimedia.org/wikipedia/en/${filename}`,
  ]

  for (const url of directUrls) {
    console.log(`🔗 Testing direct URL: ${url}`)
    result.testedUrls.push(url)
    
    try {
      const response = await fetch(url, { 
        method: 'HEAD', 
        signal: AbortSignal.timeout(5000),
        headers: {
          'User-Agent': 'FindYourLegend/1.0',
          'Accept': 'image/*'
        }
      })
      
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        console.log(`✅ Direct URL success: ${url}`)
        result.success = true
        result.workingUrl = url
        result.method = 'Direct URL'
        return result
      } else {
        console.log(`❌ Direct URL failed: ${response.status} - ${response.headers.get('content-type')}`)
      }
    } catch (error) {
      console.log(`❌ Direct URL error for ${url}:`, error)
    }
  }

  console.log(`❌ All strategies failed for ${filename}`)
  result.error = 'All resolution strategies failed'
  return result
}

// Simple in-memory cache for resolved logos
const logoCache = new Map<string, { result: LogoResolutionResult; timestamp: number }>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const logoUrl = searchParams.get('url')
    const clubName = searchParams.get('name') // Optional club name for generated logos
    
    if (!logoUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    // Create unique cache key including club name to prevent cross-contamination
    const cacheKey = `${logoUrl}|${clubName || 'unknown'}`
    
    // Check cache first
    const cached = logoCache.get(cacheKey)
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log(`📋 Cache hit for: ${logoUrl} (${clubName})`)
      return NextResponse.json(cached.result)
    }

    console.log(`🔍 Resolving logo: ${logoUrl}`)
    const result = await resolveWikipediaLogo(logoUrl)
    
    // If resolution failed and we have a club name, offer generated logo as fallback
    if (!result.success && clubName) {
      console.log(`🎨 Generating fallback logo for: ${clubName}`)
      
      const generatedUrl = `/api/generate-logo?name=${encodeURIComponent(clubName)}&size=100`
      result.success = true
      result.workingUrl = generatedUrl
      result.method = 'Generated Logo'
      result.testedUrls.push(generatedUrl)
      result.error = undefined
    }
    
    // Cache the result with unique key
    logoCache.set(cacheKey, {
      result,
      timestamp: Date.now()
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Logo resolution error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to resolve logo URL',
        testedUrls: []
      },
      { status: 500 }
    )
  }
}