import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    // Validate that it's a reasonable image URL
    const url = new URL(imageUrl)
    const allowedDomains = [
      'upload.wikimedia.org',
      'commons.wikimedia.org',
      'wikipedia.org',
      // Add other trusted domains as needed
    ]
    
    const isDomainAllowed = allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith('.' + domain)
    )
    
    if (!isDomainAllowed) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
    }

    // Fetch the image with multiple strategies
    let response: Response
    
    // Strategy 1: Try with full headers
    try {
      response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FindYourLegend/1.0)',
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'image',
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'cross-site',
          'Referer': 'https://en.wikipedia.org/',
          'Cache-Control': 'max-age=0',
        },
        // Set a reasonable timeout
        signal: AbortSignal.timeout(15000), // 15 seconds
      })
    } catch (error) {
      // Strategy 2: Try with minimal headers if first attempt fails
      console.log('First fetch attempt failed, trying with minimal headers:', error)
      response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'FindYourLegend/1.0',
          'Accept': 'image/*',
        },
        signal: AbortSignal.timeout(10000), // 10 seconds
      })
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.status}` }, 
        { status: response.status }
      )
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    )
  }
}