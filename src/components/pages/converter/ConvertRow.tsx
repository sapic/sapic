import { createSignal } from 'solid-js'
import type { ImageInfo } from '@/types/image'
import { convertVideo } from './convert'
import './ConvertRow.css'

export interface ConvertRowProps {
  info: ImageInfo
  url: string
  onConverted: (info: ImageInfo) => void
  onCanceled: (info: ImageInfo) => void
}

export default function ConvertRow(props: ConvertRowProps) {
  const [progress, setProgress] = createSignal(0)

  async function convertFile(url: string, info: ImageInfo): Promise<ImageInfo> {
    const data = await convertVideo(url, info, 'mp4', {
      onProgress: (ratio) => {
        setProgress(ratio)
      },
    })

    return { ...info, data }
  }

  // A failed conversion (e.g. a download error) is retried once; if it fails again the row
  // leaves the popup the way Cancel does, so the ZIP is still saved with the other files
  // instead of the popup waiting forever on a row stuck at 0%.
  async function run() {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        props.onConverted(await convertFile(props.url, props.info))
        return
      } catch (e) {
        console.log('convert error', e)
        setProgress(0)
      }
    }
    props.onCanceled(props.info)
  }
  void run()

  function cancel() {
    props.onCanceled(props.info)
  }

  return (
    <div class="row-container">
      <div class="row-header">
        <div class="row-name">{props.info.name}</div>
        <div class="row-cancel" onClick={cancel}>
          ✖
        </div>
      </div>

      <div class="progress-container">
        <div class="progress-indicator" style={{ width: progress() * 100 + '%' }}></div>
      </div>
    </div>
  )
}
