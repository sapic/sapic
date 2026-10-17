import { For, Show, createSignal, onCleanup } from 'solid-js'
import { actions, store } from '@/stores'

function getUrl(url: string) {
  if (url.indexOf('http://cdn.akamai.steamstatic.com') !== -1) {
    return url.replace('http://cdn.akamai.steamstatic.com', 'https://steamcdn-a.akamaihd.net')
  } else {
    return url
  }
}

function holderUpdated(holder: HTMLImageElement | HTMLVideoElement) {
  if (holder instanceof HTMLImageElement) {
    actions.setBgSize({
      w: holder.naturalWidth,
      h: holder.naturalHeight,
    })
  } else if (holder instanceof HTMLVideoElement) {
    // The converter downscales videos wider than 1920 (e.g. 4K) before cropping,
    // so treat them as 1920-wide here to keep the preview and crop offsets in sync.
    const maxWidth = 1920
    let w = holder.videoWidth
    let h = holder.videoHeight
    if (w > maxWidth) {
      h = Math.round((h * maxWidth) / w)
      w = maxWidth
    }
    actions.setBgSize({ w, h })
  }
}

export default function BgPrealoader() {
  const [shouldRender, setShouldRender] = createSignal(false)

  const timer = setTimeout(() => {
    setShouldRender(true)
  }, 256)
  onCleanup(() => clearTimeout(timer))

  // Same branching as the Vue v-if/v-else: anything that is not a non-empty
  // non-webm url gets the <video> holder. The condition is a boolean, so the
  // holder element is reused (only its src changes) while the kind stays the same.
  const isImage = () => !!store.background && store.background.indexOf('webm') === -1

  return (
    <Show when={shouldRender()}>
      <div
        class="bgPreloader"
        style={{
          position: 'absolute',
          opacity: 0,
          left: '-9999px',
          top: '-9999px',
        }}
      >
        <For each={store.nextRandomBackgrounds}>
          {(nextBg) => (
            <Show
              when={nextBg.steamUrl.indexOf('webm') === -1}
              fallback={<video src={getUrl(nextBg.steamUrl)} />}
            >
              <img src={getUrl(nextBg.steamUrl)} />
            </Show>
          )}
        </For>

        <Show
          when={isImage()}
          fallback={
            <video src={store.background} onLoadedData={(e) => holderUpdated(e.currentTarget)} />
          }
        >
          <img src={store.background} onLoad={(e) => holderUpdated(e.currentTarget)} />
        </Show>
      </div>
    </Show>
  )
}
