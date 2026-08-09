/**
 * Headless check for the cross-origin isolation setup.
 *
 * The multithreaded ffmpeg.wasm core needs SharedArrayBuffer, which requires a
 * cross-origin isolated document. Both pages convert - the index page opens a
 * converter popup inline for video backgrounds - so both must be isolated.
 *
 * Isolation also applies COEP to every subresource, and the index page embeds
 * Steam CDN images that send neither CORP nor CORS headers. COEP: credentialless
 * is what keeps those loading while still isolating; this asserts both halves of
 * that at once, on both pages:
 *   index     - isolated, SharedArrayBuffer present, Steam images still load
 *   converter - isolated, SharedArrayBuffer present, ffmpeg core loads
 *
 * Usage: node scripts/check-coi.mjs [--url http://localhost:5173] [--headful]
 */
import puppeteer from 'puppeteer'

const args = process.argv.slice(2)
const getArg = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}

const BASE = (getArg('url', process.env.BASE_URL || 'http://localhost:5173')).replace(/\/$/, '')
const HEADFUL = args.includes('--headful')
const FFMPEG_TIMEOUT = Number(getArg('timeout', 90000))

const STEAM_HOST = /steamstatic|akamaihd|steamcdn/

const pass = (m) => console.log(`  \x1b[32mPASS\x1b[0m ${m}`)
const fail = (m) => console.log(`  \x1b[31mFAIL\x1b[0m ${m}`)
const info = (m) => console.log(`  \x1b[90m${m}\x1b[0m`)

const failures = []
const check = (ok, label, detail = '') => {
  if (ok) pass(label)
  else {
    fail(`${label}${detail ? ` - ${detail}` : ''}`)
    failures.push(label)
  }
}

/** Collect console errors, page errors and blocked/failed requests for a page. */
function instrument(page) {
  const errors = []
  const blocked = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => {
    blocked.push({ url: r.url(), reason: r.failure()?.errorText ?? 'unknown' })
  })
  return { errors, blocked }
}

const headersFor = (res) => {
  const h = res.headers()
  return {
    coep: h['cross-origin-embedder-policy'] ?? null,
    coop: h['cross-origin-opener-policy'] ?? null,
  }
}

async function checkIndex(browser) {
  console.log('\n\x1b[1mindex (/)\x1b[0m')
  const page = await browser.newPage()
  const { errors, blocked } = instrument(page)

  const res = await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 })
  const { coep, coop } = headersFor(res)
  info(`COEP: ${coep ?? '(none)'}  COOP: ${coop ?? '(none)'}`)

  check(coep === 'credentialless', 'COEP is credentialless', `got "${coep}"`)
  check(coop === 'same-origin', 'COOP is same-origin', `got "${coop}"`)

  // The index page converts inline (video background -> converter popup), so it
  // needs SharedArrayBuffer just like /converter.
  const env = await page.evaluate(() => ({
    isolated: crossOriginIsolated,
    sab: typeof SharedArrayBuffer,
  }))
  check(env.isolated === true, 'index is cross-origin isolated')
  check(env.sab === 'function', 'SharedArrayBuffer available on index', `typeof=${env.sab}`)

  // Wait for at least one Steam image to be requested before judging the result.
  await page
    .waitForFunction(
      () => [...document.querySelectorAll('img')].some((i) => /steamstatic|akamaihd|steamcdn/.test(i.src)),
      { timeout: 20000 }
    )
    .catch(() => info('no Steam images appeared (inventory may be empty)'))

  const imgs = await page.evaluate(() => {
    const list = [...document.querySelectorAll('img')].filter((i) =>
      /steamstatic|akamaihd|steamcdn/.test(i.src)
    )
    return {
      total: list.length,
      loaded: list.filter((i) => i.complete && i.naturalWidth > 0).length,
      broken: list.filter((i) => i.complete && i.naturalWidth === 0).length,
    }
  })
  info(`Steam images: ${imgs.total} total, ${imgs.loaded} loaded, ${imgs.broken} broken`)

  check(imgs.total > 0, 'Steam images present on page')
  check(imgs.broken === 0, 'no broken Steam images', `${imgs.broken} broken`)

  const corpBlocked = blocked.filter((b) => STEAM_HOST.test(b.url))
  check(corpBlocked.length === 0, 'no Steam requests blocked', corpBlocked[0]?.reason)
  for (const b of corpBlocked.slice(0, 3)) info(`blocked: ${b.reason} ${b.url.slice(0, 90)}`)

  const corpErrors = errors.filter((e) => /Cross-Origin-Resource-Policy|ERR_BLOCKED/i.test(e))
  check(corpErrors.length === 0, 'no CORP console errors', corpErrors[0])

  await page.close()
}

async function checkConverter(browser) {
  console.log('\n\x1b[1mconverter (/converter)\x1b[0m')
  const page = await browser.newPage()
  const { errors, blocked } = instrument(page)

  // index.vue logs 'got ffmpeg' once ffmpeg.load() resolves. Watching for that
  // is unambiguous - scraping button text would report success on any page that
  // simply has not rendered the loading state yet.
  let resolveLoaded
  const loadedSignal = new Promise((r) => (resolveLoaded = r))
  page.on('console', (m) => {
    if (m.text().includes('got ffmpeg')) resolveLoaded(true)
  })
  const timeout = new Promise((r) => setTimeout(() => r(false), FFMPEG_TIMEOUT))

  const started = Date.now()
  const res = await page.goto(`${BASE}/converter`, { waitUntil: 'domcontentloaded', timeout: 60000 })
  const { coep, coop } = headersFor(res)
  info(`COEP: ${coep ?? '(none)'}  COOP: ${coop ?? '(none)'}`)

  check(!!coep, 'COEP set on converter document')
  check(coop === 'same-origin', 'COOP is same-origin', `got "${coop}"`)

  const env = await page.evaluate(() => ({
    isolated: crossOriginIsolated,
    sab: typeof SharedArrayBuffer,
  }))
  check(env.isolated === true, 'converter is cross-origin isolated')
  check(env.sab === 'function', 'SharedArrayBuffer available', `typeof=${env.sab}`)

  const ok = await Promise.race([loadedSignal, timeout])
  check(ok, 'ffmpeg core finished loading', `timed out after ${FFMPEG_TIMEOUT}ms`)
  if (ok) info(`ffmpeg ready in ${((Date.now() - started) / 1000).toFixed(1)}s`)

  // Workers actually spawning is what proves the multithreaded core is live:
  // the core worker plus one blob worker per pthread in the pool.
  const workers = page.workers().map((w) => w.url())
  const pthreads = workers.filter((u) => u.startsWith('blob:')).length
  info(`workers: ${workers.length} total (${pthreads} pthread blob workers)`)
  check(workers.length > 0, 'ffmpeg spawned workers')
  check(pthreads > 0, 'pthread pool created (multithreading live)')

  if (!ok) {
    for (const e of errors.slice(0, 8)) info(`error: ${e}`)
    for (const b of blocked.slice(0, 8)) info(`failed: ${b.reason} ${b.url.slice(0, 90)}`)
  }

  await page.close()
}

/**
 * The index page accepts a media URL in the hash (/#https://...). A video there
 * opens a converter popup that runs ffmpeg on the index page itself, which is
 * what makes site-wide isolation necessary. A hash never reaches the server, so
 * this cannot be covered by a per-route header rule.
 */
async function checkHashConvert(browser) {
  console.log('\n\x1b[1mindex with media hash (/#<url>)\x1b[0m')
  const page = await browser.newPage()
  const { errors } = instrument(page)

  const media =
    'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/205610/4a431bc8d519029fd9dee5310eeb2cb4c05e4fb1.png'
  await page.goto(`${BASE}/#${media}`, { waitUntil: 'networkidle2', timeout: 60000 })

  const env = await page.evaluate(() => ({
    isolated: crossOriginIsolated,
    sab: typeof SharedArrayBuffer,
  }))
  check(env.isolated === true, 'hash route is cross-origin isolated')
  check(env.sab === 'function', 'SharedArrayBuffer available', `typeof=${env.sab}`)

  // This is the error the user hit: the converter popup mounts and throws.
  const sabError = errors.filter((e) => /SharedArrayBuffer is not defined/.test(e))
  check(sabError.length === 0, 'no "SharedArrayBuffer is not defined" error', sabError[0])

  await page.close()
}

const browser = await puppeteer.launch({
  headless: !HEADFUL,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

console.log(`\x1b[1mchecking ${BASE}\x1b[0m`)

try {
  await checkIndex(browser)
  await checkHashConvert(browser)
  await checkConverter(browser)
} finally {
  await browser.close()
}

if (failures.length) {
  console.log(`\n\x1b[31m${failures.length} check(s) failed:\x1b[0m`)
  for (const f of failures) console.log(`  - ${f}`)
  process.exit(1)
}

console.log('\n\x1b[32mall checks passed\x1b[0m')
