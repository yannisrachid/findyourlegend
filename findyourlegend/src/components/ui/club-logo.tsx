'use client'

import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { getLogoUrlsWithProxy, isValidImageUrl } from '@/lib/logo-utils'
import { resolveLogoWithCache } from '@/lib/logo-resolver'
import { ClubWithRelations } from '@/types'

interface ClubLogoProps {
  club: ClubWithRelations | { id: string; name: string; logo: string | null }
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showFallback?: boolean
}

const sizeClasses = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6', 
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-24 w-24'
}

export function ClubLogo({ 
  club, 
  size = 'md', 
  className = '', 
  showFallback = true 
}: ClubLogoProps) {
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [logoUrls, setLogoUrls] = useState<string[]>([])
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null)

  // Get logo URLs when component mounts or club changes
  useEffect(() => {
    const resolveLogo = async () => {
      console.log(`🏗️ Starting logo resolution for "${club.name}" with URL: ${club.logo}`)
      
      if (!club.logo) {
        setLogoUrls([])
        setResolvedUrl(null)
        setImageError(true)
        setIsLoading(false)
        console.log(`❌ No logo URL for "${club.name}"`)
        return
      }

      setIsLoading(true)
      setImageError(false)
      setCurrentUrlIndex(0) // Reset to first URL

      // Try the server-side resolver for Wikipedia URLs
      if (club.logo.includes('wikipedia.org')) {
        try {
          const resolveUrl = `/api/resolve-logo?url=${encodeURIComponent(club.logo)}&name=${encodeURIComponent(club.name)}`
          const response = await fetch(resolveUrl)
          if (response.ok) {
            const resolution = await response.json()
            if (resolution.success && resolution.workingUrl) {
              setResolvedUrl(resolution.workingUrl)
              setLogoUrls([resolution.workingUrl])
              setCurrentUrlIndex(0)
              console.log(`✅ Server resolution for "${club.name}": ${resolution.workingUrl} (${resolution.method})`)
              return
            } else {
              console.log(`❌ Server resolution failed for "${club.name}":`, resolution.error || 'Unknown error')
            }
          }
        } catch (error) {
          console.log(`⚠️ Server resolution error for "${club.name}":`, error)
        }
      }

      // Fallback to original URL generation system + generated logo
      const logoResult = getLogoUrlsWithProxy(club.logo)
      
      // Add generated logo as final fallback
      const generatedLogoUrl = `/api/generate-logo?name=${encodeURIComponent(club.name)}&size=100`
      logoResult.urls.push(generatedLogoUrl)
      
      setLogoUrls(logoResult.urls)
      setCurrentUrlIndex(0)
      setResolvedUrl(null)
      
      console.log(`📋 Fallback URLs for "${club.name}" (${logoResult.urls.length} including generated):`, [
        ...logoResult.urls.slice(0, 2),
        '...',
        generatedLogoUrl
      ])
    }

    resolveLogo()
  }, [club.logo, club.name])

  // Handle image load error - try next URL in the list
  const handleImageError = () => {
    console.log(`Logo failed for ${club.name}, URL ${currentUrlIndex + 1}/${logoUrls.length}:`, logoUrls[currentUrlIndex])
    
    if (currentUrlIndex < logoUrls.length - 1) {
      // Try next URL
      setCurrentUrlIndex(prev => prev + 1)
      setIsLoading(true)
    } else {
      // All URLs failed
      console.log(`All logo URLs failed for ${club.name}`)
      setImageError(true)
      setIsLoading(false)
    }
  }

  const handleImageLoad = () => {
    console.log(`Logo loaded successfully for ${club.name}:`, logoUrls[currentUrlIndex])
    setIsLoading(false)
    setImageError(false)
  }

  // If no valid URLs or all failed, show fallback
  if (!logoUrls.length || imageError) {
    if (!showFallback) return null
    
    return (
      <div className={`${sizeClasses[size]} flex items-center justify-center ${className}`}>
        <Building2 className={`${sizeClasses[size]} text-gray-400`} />
      </div>
    )
  }

  const currentUrl = logoUrls[currentUrlIndex]

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className={`${sizeClasses[size]} rounded bg-gray-200 animate-pulse absolute`} />
      )}
      
      {/* Actual image */}
      <img 
        src={currentUrl}
        alt={`${club.name} logo`}
        className={`${sizeClasses[size]} object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        decoding="async"
        style={{ 
          imageRendering: 'auto',
          backgroundColor: 'transparent'
        }}
      />
      
      {/* Fallback icon (shown when loading if image takes too long) */}
      {isLoading && showFallback && (
        <Building2 className={`${sizeClasses[size]} text-gray-300 absolute`} />
      )}
    </div>
  )
}

// Simplified version for basic usage
export function ClubLogoSimple({ 
  logoUrl, 
  clubName, 
  size = 'md', 
  className = '' 
}: { 
  logoUrl: string | null | undefined
  clubName: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string 
}) {
  return (
    <ClubLogo 
      club={{ id: '', name: clubName, logo: logoUrl }}
      size={size}
      className={className}
    />
  )
}