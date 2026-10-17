/**
 * Steam CDNs that serve profile backgrounds, and the path under which each
 * keeps them. Links from backgrounds.gallery and Steam itself use all of
 * these: the old steamcdn/akamai paths, community_assets for animated
 * backgrounds, economy/profilebackground for static ones, and economy/image
 * (market images, full size, no file extension).
 */
const SteamMediaPathPrefixes: Record<string, string[]> = {
  'steamcdn-a.akamaihd.net': ['/steamcommunity/public/images/items/'],
  'cdn.akamai.steamstatic.com': ['/steamcommunity/public/images/items/'],
  'shared.akamai.steamstatic.com': ['/community_assets/images/items/'],
  'community.akamai.steamstatic.com': ['/economy/profilebackground/items/', '/economy/image/'],
  'community.fastly.steamstatic.com': ['/economy/profilebackground/items/', '/economy/image/'],
  'community.cloudflare.steamstatic.com': ['/economy/profilebackground/items/', '/economy/image/'],
  'community.steamstatic.com': ['/economy/profilebackground/items/', '/economy/image/'],
}
/** A known media extension, or none at all (Steam serves some images without one) */
const SteamMediaFileRegex = /\/[^/.]+(?:\.(?:jpe?g|png|webm|mp4))?$/i

export function isSupportedSteamMediaUrl(value: string): boolean {
  try {
    const url = new URL(value)
    const prefixes = SteamMediaPathPrefixes[url.hostname]

    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      !!prefixes &&
      prefixes.some((p) => url.pathname.startsWith(p) && url.pathname.length > p.length) &&
      SteamMediaFileRegex.test(url.pathname)
    )
  } catch {
    return false
  }
}

/** Store format of a media URL: webm/mp4 are videos, everything else an image */
export function mediaFormat(value: string): 'jpg' | 'mp4' | 'webm' {
  let path = value
  try {
    path = new URL(value).pathname
  } catch {
    // not a URL: use as is
  }
  const ext = (path.split('/').pop() || '').split('.').slice(1).pop()?.toLowerCase()
  return ext === 'webm' || ext === 'mp4' ? ext : 'jpg'
}
