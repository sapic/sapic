import { onCleanup } from 'solid-js'
import videoSrc from '@/assets/images/tradeit.mp4'
import './Tradeit.css'

export default function Tradeit() {
  let videoRef: HTMLVideoElement | undefined
  // As in the Vue version: defer loading the ad video, assign its src 128 ms after setup.
  const timer = setTimeout(() => {
    queueMicrotask(() => {
      if (videoRef) {
        videoRef.src = videoSrc
      }
    })
  }, 128)
  onCleanup(() => clearTimeout(timer))

  return (
    <a
      class="profile_video"
      href="https://tradeit.gg/?aff=steamdesign"
      target="_blank"
      rel="noreferrer noopener"
    >
      <video ref={(el) => (videoRef = el)} autoplay muted playsinline loop />
    </a>
  )
}
