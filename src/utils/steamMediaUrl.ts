const SteamMediaPathPrefixes: Record<string, string> = {
  'steamcdn-a.akamaihd.net': '/steamcommunity/public/images/items/',
  'cdn.akamai.steamstatic.com': '/steamcommunity/public/images/items/',
  'shared.akamai.steamstatic.com': '/community_assets/images/items/',
}
const SteamMediaExtensionRegex = /\.(?:jpe?g|png|webm|mp4)$/i

export function isSupportedSteamMediaUrl(value: string): boolean {
  try {
    const url = new URL(value)
    const pathPrefix = SteamMediaPathPrefixes[url.hostname]

    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      Boolean(pathPrefix) &&
      url.pathname.startsWith(pathPrefix) &&
      SteamMediaExtensionRegex.test(url.pathname)
    )
  } catch {
    return false
  }
}
