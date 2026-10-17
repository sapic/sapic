import { createMemo } from 'solid-js'
import { store } from '@/stores'
import Overlay from './preview/Overlay'
import './ImagePreview.css'

// Only an absolute URL is worth asking the browser for: a missing or "undefined"
// value used to become url('undefined'), i.e. a request to /undefined (404).
const isLoadableUrl = (value: unknown): value is string =>
  typeof value === 'string' && /^(https?:|blob:|data:)/i.test(value)

export default function ImagePreview() {
  const shouldRepeatBackground = createMemo(() => {
    // Check if the background is a square image smaller than 700x700 pixels
    const { w, h } = store.bgSize
    return w > 0 && h > 0 && w === h && w < 700 && h < 700
  })

  const previewStyle = createMemo(() => ({
    'background-image': isLoadableUrl(store.background) ? `url('${store.background}')` : 'none',
    'background-repeat': shouldRepeatBackground() ? 'repeat' : 'no-repeat',
    'background-position': '49.999% 0',
  }))

  return (
    <div class="profile__preview" style={previewStyle()}>
      <div class="profile__preview-bg">
        <video
          src={store.background || ''}
          muted
          autoplay
          loop
          style={{
            width: `${store.bgSize.w}px`,
            height: `${store.bgSize.h}px`,
          }}
        />
      </div>
      <div class="profile__preview-container">
        <Overlay imageHeight={shouldRepeatBackground() ? 950 : store.bgSize.h} />
      </div>
    </div>
  )
}
