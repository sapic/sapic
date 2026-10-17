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

  async function run() {
    try {
      props.onConverted(await convertFile(props.url, props.info))
    } catch (e) {
      console.log('convert error', e)
    }
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
