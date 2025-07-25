import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      )
    }

    // Only allow Wikipedia/Wikimedia URLs for security
    if (!url.includes('wikipedia.org') && !url.includes('wikimedia.org')) {
      return NextResponse.json(
        { error: 'Only Wikipedia/Wikimedia URLs are allowed' },
        { status: 403 }
      )
    }

    // Convert Wikipedia file URL to direct Wikimedia Commons URL
    let imageUrl = url
    if (url.includes('wikipedia.org/wiki/File:')) {
      const filename = url.split('File:')[1]
      if (filename) {
        const encodedFilename = encodeURIComponent(filename.replace(/\s+/g, '_'))
        imageUrl = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodedFilename}?width=64`
      }
    }

    console.log('Proxying image request:', url, '->', imageUrl)

    // Fetch the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'FindYourLegend/1.0 (https://example.com)',
      },
    })

    if (!response.ok) {
      console.log('Failed to fetch image:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type') || 'image/svg+xml'
    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    })

  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}