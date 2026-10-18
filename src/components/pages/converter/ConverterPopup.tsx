import { For, createSignal } from 'solid-js'
import { actions } from '@/stores'
import type { ImageInfo } from '@/types/image'
import type { ConverterProp } from '@/types/store'
import { preloadZip, saveZip } from '@/utils/saveZip'
import ConvertRow from './ConvertRow'
import './ConverterPopup.css'

export interface ConverterPopupProps {
  save: ConverterProp
}

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

export default function ConverterPopup(props: ConverterPopupProps) {
  // Initial values only (like the Vue ref(props.save...)): the popup works on its own copy
  const url = props.save.info.url || ''
  const [images, setImages] = createSignal<ImageInfo[]>(
    props.save.info.images.map((i) => ({
      ...i,
      name: i.name.replace('.png', '.mp4'),
      enabled: true,
    }))
  )

  // Converted files, zipped when the last one is done
  const files: Array<{ name: string; data: Uint8Array }> = []
  preloadZip()

  let totalConverted = 0
  function handleConverted(info: ImageInfo) {
    console.log('handleConverted', info)
    files.push({ name: info.name, data: info.data })
    totalConverted++
    if (totalConverted === images().length) {
      void finalzeZip()
    }
  }

  function handleRowCancel(info: ImageInfo) {
    setImages((list) => list.filter((img) => img.name !== info.name))

    if (totalConverted === images().length && totalConverted > 0) {
      void finalzeZip()
    } else if (images().length === 0) {
      // every row was cancelled or failed: nothing to save, close the popup
      actions.removeConvertItem(props.save.id)
    }
  }

  async function finalzeZip() {
    const inputString = JSON.stringify(images())
    const inputDigest = await digestMessage(inputString)

    const zipName = `steam.design_${inputDigest.slice(0, 6)}.zip`
    await saveZip(files, zipName)
    actions.removeConvertItem(props.save.id)
  }

  return (
    <div class="converter__container">
      {/* <div>Images:</div> */}
      <div class="images__container">
        <For each={images()}>
          {(image) => (
            <div class="item">
              <ConvertRow
                info={image}
                url={url}
                onConverted={handleConverted}
                onCanceled={handleRowCancel}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  )
}
