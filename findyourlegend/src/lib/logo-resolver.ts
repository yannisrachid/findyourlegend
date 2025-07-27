/**
 * Advanced logo resolution system
 * Tries multiple strategies to find working logo URLs
 */

interface LogoResolutionResult {
  success: boolean
  workingUrl?: string
  testedUrls: string[]
  method?: string
}

/**
 * Try to resolve a Wikipedia logo URL using multiple strategies
 */
export async function resolveWikipediaLogo(originalUrl: string): Promise<LogoResolutionResult> {
  const result: LogoResolutionResult = {
    success: false,
    testedUrls: []
  }

  if (!originalUrl || !originalUrl.includes('wikipedia.org')) {
    return result
  }

  // Extract filename
  let filename = ''
  if (originalUrl.includes('/wiki/File:')) {
    filename = originalUrl.split('/wiki/File:')[1]
  } else {
    return result
  }

  filename = decodeURIComponent(filename.split('#')[0].split('?')[0])
  
  // Strategy 1: Try Wikipedia API first
  try {
    const apiResponse = await fetch(`/api/wikipedia-image?url=${encodeURIComponent(originalUrl)}`)
    if (apiResponse.ok) {
      const data = await apiResponse.json()
      if (data.success && data.resolvedUrl) {
        result.success = true
        result.workingUrl = data.resolvedUrl
        result.method = 'Wikipedia API'
        result.testedUrls.push(data.resolvedUrl)
        return result
      }
    }
  } catch (_error) {
    console.log('Wikipedia API failed:', _error)
  }

  // Strategy 2: Try direct Wikimedia Commons URLs
  const commonUrls = [
    `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`,
    `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=200`,
    `https://upload.wikimedia.org/wikipedia/commons/${filename}`,
  ]

  for (const url of commonUrls) {
    result.testedUrls.push(url)
    try {
      const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
      if (response.ok) {
        result.success = true
        result.workingUrl = url
        result.method = 'Direct Commons'
        return result
      }
    } catch {
      // Continue to next URL
    }
  }

  // Strategy 3: Try different filename variations
  const filenameVariations = [
    filename,
    filename.replace(/_/g, ' '),
    filename.replace(/ /g, '_'),
    filename.replace('logo', 'Logo'),
    filename.replace('Logo', 'logo'),
  ]

  for (const variation of filenameVariations) {
    const testUrls = [
      `https://commons.wikimedia.org/wiki/Special:FilePath/${variation}`,
      `https://upload.wikimedia.org/wikipedia/en/${variation}`,
    ]

    for (const url of testUrls) {
      result.testedUrls.push(url)
      try {
        const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
        if (response.ok) {
          result.success = true
          result.workingUrl = url
          result.method = 'Filename variation'
          return result
        }
      } catch (_) {
        // Continue to next URL
      }
    }
  }

  // Strategy 4: Try our proxy service
  try {
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(originalUrl)}`
    result.testedUrls.push(proxyUrl)
    const response = await fetch(proxyUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
    if (response.ok) {
      result.success = true
      result.workingUrl = proxyUrl
      result.method = 'Proxy service'
      return result
    }
  } catch (_) {
    // Proxy failed
  }

  return result
}

/**
 * Cache for resolved logos to avoid repeated API calls
 */
const logoCache = new Map<string, LogoResolutionResult>()

/**
 * Resolve logo with caching
 */
export async function resolveLogoWithCache(originalUrl: string): Promise<LogoResolutionResult> {
  if (logoCache.has(originalUrl)) {
    return logoCache.get(originalUrl)!
  }

  const result = await resolveWikipediaLogo(originalUrl)
  logoCache.set(originalUrl, result)
  
  // Log for debugging
  console.log(`Logo resolution for "${originalUrl}":`, {
    success: result.success,
    workingUrl: result.workingUrl,
    method: result.method,
    testedCount: result.testedUrls.length
  })

  return result
}