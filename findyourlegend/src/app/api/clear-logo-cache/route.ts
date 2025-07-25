import { NextRequest, NextResponse } from 'next/server'

// Import the cache from the resolve-logo module (we'll need to make it accessible)
// For now, we'll just return a success message as the cache will be cleared on server restart

export async function POST(request: NextRequest) {
  try {
    // In a production environment, you might want to clear Redis or another persistent cache
    // For now, since we're using in-memory cache, we can just return success
    // The cache will be cleared when the server restarts
    
    console.log('🧹 Logo cache clear requested')
    
    return NextResponse.json({
      success: true,
      message: 'Logo cache will be cleared on next server restart, or you can restart the server now'
    })

  } catch (error) {
    console.error('Cache clear error:', error)
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    )
  }
}