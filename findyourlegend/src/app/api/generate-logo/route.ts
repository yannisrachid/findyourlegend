import { NextRequest, NextResponse } from 'next/server'

/**
 * Generate a simple SVG logo for clubs when no logo is available
 */
function generateClubLogo(clubName: string, options: {
  size?: number
  backgroundColor?: string
  textColor?: string
} = {}): string {
  const { size = 100, backgroundColor = '#1f2937', textColor = '#ffffff' } = options
  
  // Get initials from club name (max 3 characters)
  const words = clubName.split(/\s+/)
  let initials = ''
  
  if (words.length === 1) {
    // Single word - take first 2-3 characters
    initials = words[0].substring(0, 3).toUpperCase()
  } else if (words.length === 2) {
    // Two words - first letter of each
    initials = (words[0][0] + words[1][0]).toUpperCase()
  } else {
    // Multiple words - first letter of first 3 words
    initials = words.slice(0, 3).map(w => w[0]).join('').toUpperCase()
  }
  
  // Calculate font size based on initials length
  const fontSize = initials.length === 1 ? size * 0.5 : 
                   initials.length === 2 ? size * 0.35 : 
                   size * 0.25

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${backgroundColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(backgroundColor, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#bg)" stroke="${textColor}" stroke-width="2"/>
  <text x="${size/2}" y="${size/2 + fontSize/3}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="${textColor}">
    ${initials}
  </text>
</svg>`

  return svg
}

/**
 * Adjust color brightness
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1)
}

/**
 * Get a color based on club name (for consistency)
 */
function getClubColor(clubName: string): string {
  const colors = [
    '#1f2937', // Gray
    '#1e40af', // Blue
    '#dc2626', // Red
    '#059669', // Green
    '#7c2d12', // Brown
    '#6b21a8', // Purple
    '#be185d', // Pink
    '#ea580c', // Orange
    '#0f766e', // Teal
    '#4338ca', // Indigo
  ]
  
  // Simple hash function to get consistent color for club name
  let hash = 0
  for (let i = 0; i < clubName.length; i++) {
    const char = clubName.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return colors[Math.abs(hash) % colors.length]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clubName = searchParams.get('name')
    const size = parseInt(searchParams.get('size') || '100')
    const format = searchParams.get('format') || 'svg'
    
    if (!clubName) {
      return NextResponse.json({ error: 'Club name is required' }, { status: 400 })
    }

    const backgroundColor = getClubColor(clubName)
    const svg = generateClubLogo(clubName, { size, backgroundColor })
    
    if (format === 'svg') {
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      })
    } else if (format === 'data-url') {
      const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
      return NextResponse.json({
        success: true,
        dataUrl,
        svg
      })
    } else {
      return NextResponse.json({ error: 'Invalid format. Use "svg" or "data-url"' }, { status: 400 })
    }

  } catch (error) {
    console.error('Logo generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate logo' },
      { status: 500 }
    )
  }
}