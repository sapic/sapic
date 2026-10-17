import { Show, createEffect, createSignal, on, onCleanup, onMount } from 'solid-js'
import ImagePreview from './ImagePreview'
import Inventory from './InventoryContainer'
import MenuWindow from './MenuWindow'
import BgPreloader from './BgPrealoader'
import Scripts from '../../Scripts'
import RightMenu from './RightMenu'
import MobileHeader from './MobileHeader'
import ConvertersContainer from './ConvertersContainer'
import { store } from '@/stores'
import './IndexPage.css'

const easeOutQuad = (t: number) => t * (2 - t)

export default function IndexPage() {
  const [animatedScale, setAnimatedScale] = createSignal(store.previewScale)
  const scalePercent = () => animatedScale() / 100
  const isMobile = window.screen.width < 560

  let previewWindow: HTMLDivElement | undefined
  let resizeObserver: ResizeObserver | null = null
  let disposed = false

  // When the zoomed profile is wider than the window, keep the profile column
  // in the middle of the view (the window scrolls sideways from there)
  const centerPreview = () => {
    // Runs after the pending DOM update (Vue's $nextTick)
    queueMicrotask(() => {
      const el = previewWindow
      if (!el) return
      // At 100% or less nothing scrolls (overflow-x hidden): a leftover offset
      // would shift the whole preview sideways
      el.scrollLeft = scalePercent() > 1 ? (el.scrollWidth - el.clientWidth) / 2 : 0
    })
  }

  onMount(() => {
    centerPreview()
    // The midpoint depends on the window width: re-centre when it changes
    resizeObserver = new ResizeObserver(() => centerPreview())
    resizeObserver.observe(previewWindow!)
  })

  onCleanup(() => {
    disposed = true
    resizeObserver?.disconnect()
  })

  createEffect(
    on(
      () => store.previewScale,
      (newValue) => {
        const start = Date.now()
        const end = start + 375
        let shouldEnd = false
        const fromValue = animatedScale()
        const valueDiff = newValue - fromValue

        const animate = () => {
          if (disposed) return
          const progress = easeOutQuad(Math.min((Date.now() - start) / 375, 1))
          const change = valueDiff * progress
          setAnimatedScale(fromValue + change)
          centerPreview()

          if (!shouldEnd) {
            requestAnimationFrame(animate)
          }

          if (Date.now() > end) {
            shouldEnd = true
          }
        }

        animate()
      },
      { defer: true }
    )
  )

  // A string (cssText) rather than a style object: `!important` only works there,
  // Solid's style object passes values to setProperty without a priority
  const zoomStyle = () => {
    const scale = scalePercent()
    return (
      `transform: scale(${scale}); ` +
      `width: calc(100% / ${scale}) !important; ` +
      `height: calc(100% * ${scale}) !important;`
    )
  }

  return (
    <div class="wrapper">
      <section class="body__wrapper">
        <MenuWindow />
        {/* The converter popups sit on this wrapper, not on the scrolled window,
            so they stay in the visible corner when the zoomed preview scrolls */}
        <div class="preview__frame">
          <ConvertersContainer />
          <div
            ref={(el) => (previewWindow = el)}
            class="preview__window"
            style={{ 'overflow-x': scalePercent() > 1 ? 'auto' : 'hidden' }}
          >
            <div class="zoom_out" style={zoomStyle()}>
              <ImagePreview />
              <BgPreloader />
            </div>
          </div>
        </div>
        <Show when={!isMobile} fallback={<MobileHeader />}>
          <RightMenu />
          <Inventory />
        </Show>
        <Scripts />
      </section>
    </div>
  )
}
