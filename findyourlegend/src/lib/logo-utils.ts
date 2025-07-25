/**
 * Comprehensive logo URL handling utility
 * Converts various logo URL formats to working image URLs with multiple fallbacks
 */

export interface LogoUrlResult {
  urls: string[]
  isWikipedia: boolean
}

/**
 * Convert Wikipedia File URLs to direct image URLs with multiple fallback strategies
 */
function processWikipediaUrl(url: string): string[] {
  const urls: string[] = []
  
  try {
    // Extract filename from Wikipedia URL
    let filename = ''
    
    if (url.includes('/wiki/File:')) {
      filename = url.split('/wiki/File:')[1]
    } else if (url.includes('File:')) {
      filename = url.split('File:')[1]
    }
    
    if (!filename) return urls
    
    // Clean up filename
    filename = decodeURIComponent(filename.split('#')[0].split('?')[0])
    
    // Strategy 1: Wikimedia Commons direct URL (most reliable)
    const encodedFilename = encodeURIComponent(filename)
    urls.push(`https://commons.wikimedia.org/wiki/Special:FilePath/${encodedFilename}`)
    urls.push(`https://commons.wikimedia.org/wiki/Special:FilePath/${encodedFilename}?width=200`)
    
    // Strategy 2: Direct Wikimedia file path (most common structure)
    // Calculate MD5-based directory structure
    const generateMD5Path = (filename: string) => {
      // This is a simplified approach - Wikipedia uses actual MD5 hashing
      // but we can try common patterns
      const normalized = filename.replace(/\s/g, '_')
      const firstChar = normalized.charAt(0).toLowerCase()
      const secondChar = normalized.charAt(1).toLowerCase()
      return `${firstChar}/${firstChar}${secondChar}`
    }
    
    const mdPath = generateMD5Path(filename)
    
    // Try different size variations and paths
    const sizes = ['200px', '150px', '120px', '100px', '80px', '64px']
    sizes.forEach(size => {
      // Thumbnail versions
      urls.push(`https://upload.wikimedia.org/wikipedia/commons/thumb/${mdPath}/${filename}/${size}-${filename}`)
      urls.push(`https://upload.wikimedia.org/wikipedia/en/thumb/${mdPath}/${filename}/${size}-${filename}`)
      
      // Try without size prefix
      urls.push(`https://upload.wikimedia.org/wikipedia/commons/thumb/${mdPath}/${filename}/${filename}`)
    })
    
    // Direct file URLs (no thumbnail)
    urls.push(`https://upload.wikimedia.org/wikipedia/commons/${mdPath}/${filename}`)
    urls.push(`https://upload.wikimedia.org/wikipedia/en/${mdPath}/${filename}`)
    
    // Strategy 3: Try different commons URLs
    urls.push(`https://upload.wikimedia.org/wikipedia/commons/${filename}`)
    urls.push(`https://commons.wikimedia.org/w/thumb.php?f=${encodedFilename}&w=200`)
    
    // Strategy 4: Try en.wikipedia.org variations
    urls.push(`https://upload.wikimedia.org/wikipedia/en/thumb/${firstChar}/${firstChar}${secondChar}/${filename}/200px-${filename}`)
    urls.push(`https://upload.wikimedia.org/wikipedia/en/${firstChar}/${firstChar}${secondChar}/${filename}`)
    
    // Strategy 5: Generic fallbacks
    urls.push(`https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodedFilename}&width=200`)
    
  } catch (error) {
    console.warn('Error processing Wikipedia URL:', url, error)
  }
  
  return urls
}

/**
 * Get multiple logo URLs with fallbacks for any given URL
 */
export function getLogoUrls(originalUrl: string | null | undefined): LogoUrlResult {
  const result: LogoUrlResult = {
    urls: [],
    isWikipedia: false
  }
  
  if (!originalUrl || typeof originalUrl !== 'string') {
    return result
  }
  
  const url = originalUrl.trim()
  if (!url) return result
  
  // Check if it's a Wikipedia URL
  const isWikipedia = url.includes('wikipedia.org') || url.includes('wikimedia.org')
  result.isWikipedia = isWikipedia
  
  if (isWikipedia) {
    // Process Wikipedia URLs with multiple fallback strategies
    result.urls = processWikipediaUrl(url)
    
    // Also try the original URL as a last resort
    result.urls.push(url)
  } else {
    // For non-Wikipedia URLs, use as-is but add some common variations
    result.urls.push(url)
    
    // If it's an HTTP URL, try HTTPS version
    if (url.startsWith('http://')) {
      result.urls.push(url.replace('http://', 'https://'))
    }
    
    // If it's missing protocol, try adding https
    if (!url.startsWith('http')) {
      result.urls.push(`https://${url}`)
      result.urls.push(`http://${url}`)
    }
  }
  
  return result
}

/**
 * Get the first working logo URL (to be used with image onLoad/onError)
 */
export function getFirstLogoUrl(originalUrl: string | null | undefined): string {
  const result = getLogoUrls(originalUrl)
  return result.urls.length > 0 ? result.urls[0] : ''
}

/**
 * Check if a URL is likely to be a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  
  const cleanUrl = url.toLowerCase().trim()
  
  // Check for common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp', '.bmp']
  const hasImageExtension = imageExtensions.some(ext => cleanUrl.includes(ext))
  
  // Check for image-related domains or paths
  const imageIndicators = [
    'wikimedia.org',
    'wikipedia.org',
    '/images/',
    '/img/',
    '/logos/',
    '/static/',
    'cloudinary.com',
    'imgur.com',
    'upload.'
  ]
  const hasImageIndicator = imageIndicators.some(indicator => cleanUrl.includes(indicator))
  
  return hasImageExtension || hasImageIndicator
}

/**
 * Create a proxy URL for images that might have CORS issues
 */
export function createProxyUrl(originalUrl: string): string {
  if (!originalUrl) return ''
  
  // Use our own proxy endpoint for Wikipedia/Wikimedia images
  const isWikipediaUrl = originalUrl.includes('wikipedia.org') || originalUrl.includes('wikimedia.org')
  
  if (isWikipediaUrl) {
    return `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`
  }
  
  return originalUrl
}

/**
 * Enhanced version that includes proxy URLs in the fallback chain
 */
export function getLogoUrlsWithProxy(originalUrl: string | null | undefined): LogoUrlResult {
  const result = getLogoUrls(originalUrl)
  
  if (result.isWikipedia && result.urls.length > 0) {
    // Add proxy versions of the first few URLs
    const proxyUrls = result.urls.slice(0, 3).map(url => createProxyUrl(url))
    
    // Insert proxy URLs near the beginning of the array for faster fallback
    result.urls = [
      result.urls[0], // Try direct first
      proxyUrls[0],   // Then proxy of best URL
      ...result.urls.slice(1, 5), // Then other direct URLs
      ...proxyUrls.slice(1), // Then remaining proxy URLs
      ...result.urls.slice(5) // Then remaining direct URLs
    ].filter(Boolean)
  }
  
  return result
}