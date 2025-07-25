import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test the two Paris clubs to ensure they get different logos
    const clubs = [
      {
        name: 'Paris Saint-Germain',
        url: 'https://en.wikipedia.org/wiki/File:Paris_Saint-Germain_F.C..svg'
      },
      {
        name: 'Paris FC',
        url: 'https://en.wikipedia.org/wiki/File:Paris_FC_logo.svg'
      }
    ]

    const results = []

    for (const club of clubs) {
      try {
        const resolveUrl = `/api/resolve-logo?url=${encodeURIComponent(club.url)}&name=${encodeURIComponent(club.name)}`
        const response = await fetch(`http://localhost:3000${resolveUrl}`)
        
        if (response.ok) {
          const data = await response.json()
          results.push({
            clubName: club.name,
            originalUrl: club.url,
            success: data.success,
            resolvedUrl: data.workingUrl,
            method: data.method
          })
        } else {
          results.push({
            clubName: club.name,
            originalUrl: club.url,
            success: false,
            error: 'Resolution failed'
          })
        }
      } catch (error) {
        results.push({
          clubName: club.name,
          originalUrl: club.url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    // Check if the resolved URLs are different
    const psgResult = results.find(r => r.clubName === 'Paris Saint-Germain')
    const parisFcResult = results.find(r => r.clubName === 'Paris FC')

    const areUrlsDifferent = psgResult?.resolvedUrl !== parisFcResult?.resolvedUrl

    return NextResponse.json({
      success: true,
      results,
      areUrlsDifferent,
      summary: {
        psg: psgResult?.resolvedUrl,
        parisFC: parisFcResult?.resolvedUrl,
        different: areUrlsDifferent
      }
    })

  } catch (error) {
    console.error('Logo test error:', error)
    return NextResponse.json(
      { error: 'Failed to test logos' },
      { status: 500 }
    )
  }
}