import { NextRequest, NextResponse } from 'next/server'

interface WikipediaApiResponse {
  query?: {
    pages?: {
      [key: string]: {
        title?: string
        imageinfo?: Array<{
          url: string
          thumburl?: string
        }>
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const wikipediaUrl = searchParams.get('url')
    
    if (!wikipediaUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    // Extract filename from Wikipedia URL
    let filename = ''
    if (wikipediaUrl.includes('/wiki/File:')) {
      filename = wikipediaUrl.split('/wiki/File:')[1]
    } else if (wikipediaUrl.includes('File:')) {
      filename = wikipediaUrl.split('File:')[1]
    } else {
      return NextResponse.json({ error: 'Invalid Wikipedia File URL' }, { status: 400 })
    }

    // Clean up filename
    filename = decodeURIComponent(filename.split('#')[0].split('?')[0])
    
    console.log(`Resolving Wikipedia file: ${filename}`)

    // Use Wikipedia API to get the actual file URL
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json&origin=*`
    
    console.log(`Wikipedia API URL: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'FindYourLegend/1.0',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      throw new Error(`Wikipedia API returned ${response.status}`)
    }

    const data: WikipediaApiResponse = await response.json()
    console.log('Wikipedia API response:', JSON.stringify(data, null, 2))

    // Extract the image URL from the API response
    const pages = data.query?.pages
    if (!pages) {
      return NextResponse.json({ error: 'No pages found in API response' }, { status: 404 })
    }

    const pageIds = Object.keys(pages)
    const firstPage = pages[pageIds[0]]
    
    if (!firstPage?.imageinfo || firstPage.imageinfo.length === 0) {
      return NextResponse.json({ error: 'No image info found for this file' }, { status: 404 })
    }

    const imageInfo = firstPage.imageinfo[0]
    const imageUrl = imageInfo.thumburl || imageInfo.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL found' }, { status: 404 })
    }

    console.log(`Resolved image URL: ${imageUrl}`)

    // Return the resolved URL
    return NextResponse.json({
      success: true,
      originalUrl: wikipediaUrl,
      filename: filename,
      resolvedUrl: imageUrl,
      directUrl: imageInfo.url,
      thumbnailUrl: imageInfo.thumburl
    })

  } catch (error) {
    console.error('Wikipedia image resolution error:', error)
    return NextResponse.json(
      { error: 'Failed to resolve Wikipedia image URL' },
      { status: 500 }
    )
  }
}