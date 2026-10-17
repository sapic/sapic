/**
 * Steam CDNs that serve profile backgrounds, and the path under which each
 * keeps them. Links from backgrounds.gallery and Steam itself use all of
 * these: the old steamcdn/akamai paths, community_assets for animated
 * backgrounds, economy/profilebackground for static ones, and economy/image
 * (market images, full size, no file extension).
 */
const LegacyItems = ['/steamcommunity/public/images/items/']
const SharedItems = ['/community_assets/images/items/']
const CommunityItems = ['/economy/profilebackground/items/', '/economy/image/']
const SteamMediaPathPrefixes: Record<string, string[]> = {
  'steamcdn-a.akamaihd.net': LegacyItems,
  'cdn.akamai.steamstatic.com': LegacyItems,
  'cdn.fastly.steamstatic.com': LegacyItems,
  'cdn.cloudflare.steamstatic.com': LegacyItems,
  'cdn.steamstatic.com': LegacyItems,
  'shared.akamai.steamstatic.com': SharedItems,
  'shared.fastly.steamstatic.com': SharedItems,
  'shared.cloudflare.steamstatic.com': SharedItems,
  'shared.steamstatic.com': SharedItems,
  'community.akamai.steamstatic.com': CommunityItems,
  'community.fastly.steamstatic.com': CommunityItems,
  'community.cloudflare.steamstatic.com': CommunityItems,
  'community.steamstatic.com': CommunityItems,
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

/**
 * "<appid>/<file>" of a media URL: the same picture has the same key on
 * every Steam CDN host and path (steamcdn-a, community.akamai, ...)
 */
export function mediaFile(value: string): string | null {
  let path = value
  try {
    path = new URL(value).pathname
  } catch {
    // not a URL: use as is
  }
  const parts = path.split('/').filter(Boolean)
  if (parts.length < 2) return null
  // The extension is left out: Steam serves the same file with and without it
  const file = parts[parts.length - 1].replace(/\.[a-z0-9]+$/i, '')
  return `${parts[parts.length - 2]}/${file}`.toLowerCase()
}

/** Icon id of a Steam market image URL (/economy/image/<iconUrl>[/<size>]), or null */
export function marketIcon(value: string): string | null {
  try {
    const m = /^\/economy\/image\/([^/]+)/.exec(new URL(value).pathname)
    return m ? decodeURIComponent(m[1]) : null
  } catch {
    return null
  }
}
