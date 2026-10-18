import { createEffect, createSignal, For, Match, on, Switch } from 'solid-js'
import { createStore } from 'solid-js/store'
import { useParams } from '@solidjs/router'
import { fetchFile } from '@ffmpeg/util'
import type { FFmpeg } from '@ffmpeg/ffmpeg'
import type { ImageInfo } from '@/types/image'
import { preloadZip, saveZip } from '@/utils/saveZip'
import { buildConvertArgs, createFfmpeg } from './convert'
import './Converter.css'

type NumericField = 'w' | 'h' | 'x' | 'y'

/** A crop field as a number; while the box is empty or mid-edit, keep the last good value */
function toNumber(value: string, fallback: number): number {
  const n = parseFloat(value)
  return isNaN(n) ? fallback : n
}

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message) // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8) // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)) // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}

export default function Converter() {
  const params = useParams()

  const [url, setUrl] = createSignal<string>('')
  const [images, setImages] = createStore<ImageInfo[]>([])
  const [logs, setLogs] = createSignal('')
  const [outputFormat, setOutputFormat] = createSignal('mp4')
  const [file, setFile] = createSignal<File | null>(null)
  const [downloadStarted, setDownloadStarted] = createSignal(false)
  const [itemsTotal, setItemsTotal] = createSignal(0)
  const [itemsDone, setItemsDone] = createSignal(0)
  const [progress, setProgress] = createSignal(0)
  const [ffmpeg, setFfmpeg] = createSignal<FFmpeg | null>(null)

  let logsRef: HTMLParagraphElement | undefined

  console.log('route raw', params)
  if (params.raw && typeof params.raw === 'string') {
    const decoded64 = atob(params.raw)
    const decodedObj = JSON.parse(decoded64)

    if (decodedObj) {
      setUrl(decodedObj.url)
      setImages(
        decodedObj.images.map((i: ImageInfo) => ({
          ...i,
          name: i.name.replace('.png', '.mp4'),
          enabled: true,
        }))
      )
    }
  }

  // Keep the logs box scrolled to the bottom. User effects run after the DOM text is updated.
  createEffect(
    on(
      logs,
      () => {
        if (logsRef) {
          logsRef.scrollTop = logsRef.scrollHeight
        }
      },
      { defer: true }
    )
  )

  // Not deferred: a deferred `on` does not record the previous value on its skipped first
  // run, so the first format change would have no `from` to replace.
  createEffect(
    on(outputFormat, (to, from) => {
      if (from === undefined) return
      setImages({}, 'name', (name) => name.replace(from, to))
    })
  )

  function onUploadFiles(e: Event & { currentTarget: HTMLInputElement }) {
    const input = e.currentTarget
    if (input.files && input.files.length > 0) {
      setFile(input.files[0])
    } else {
      setFile(null)
    }
  }

  async function loadFfmpeg() {
    const instance = await createFfmpeg({
      onLog: (message) => {
        setLogs((l) => l + message + '\n')
      },
      onProgress: (ratio) => {
        if (itemsTotal() < 2) {
          setProgress(ratio)
          return
        }

        const relativeRatio = ratio / itemsTotal()
        const completedRatio = itemsDone() / itemsTotal()
        setProgress(relativeRatio + completedRatio)
      },
    })
    setFfmpeg(() => instance)
    console.log('got ffmpeg', instance)
  }
  void loadFfmpeg()

  async function downloadClick() {
    const ff = ffmpeg()
    if (!ff) {
      return console.log('no ffmpeg')
    }

    const files: Array<{ name: string; data: Uint8Array | string }> = []
    preloadZip()

    setDownloadStarted(true)

    let fileData
    try {
      const f = file()
      fileData = f ? await fetchFile(f) : await fetchFile(url())
    } catch {
      setLogs(
        (l) =>
          l +
          `
================================
================================
================================
================================
File download error, try uploading it manually
================================
================================
================================
================================
        `
      )
      return
    }

    await ff.writeFile('inputfile', fileData)

    for (const info of images) {
      if (info.enabled) {
        setItemsTotal((n) => n + 1)
      }
    }

    for (const info of images) {
      if (!info.enabled) {
        console.log('Skip because disabled')
        continue
      }
      const outputName = 'test.' + outputFormat()
      const convertArgs = buildConvertArgs(info, 'inputfile', outputName, outputFormat())

      await ff.exec(convertArgs)
      const res = await ff.readFile(outputName)
      files.push({ name: info.name, data: res })

      setItemsDone((n) => n + 1)
    }

    const inputString = JSON.stringify(images)
    const inputDigest = await digestMessage(inputString)

    const zipName = `steam.design_${inputDigest.slice(0, 6)}.zip`
    await saveZip(files, zipName)
  }

  const numberInput = (index: () => number, image: ImageInfo, field: NumericField) => (
    <input
      type="number"
      value={image[field]}
      onInput={(e) => setImages(index(), field, (old) => toNumber(e.currentTarget.value, old))}
    />
  )

  return (
    <div class="converter__container">
      <div class="url__container">
        <label for="urlInput"> Image URL:</label>
        <input
          id="urlInput"
          type="text"
          value={url()}
          onInput={(e) => setUrl(e.currentTarget.value)}
        />
      </div>

      <div class="url__container">
        <label for="fileInput">Image Input:</label>
        <input id="fileInput" type="file" onChange={onUploadFiles} />
      </div>

      <div class="format__container">
        <div>Format:</div>
        <div class="inputs">
          <div class="input__container">
            <label for="formatMp4">MP4</label>
            <input
              id="formatMp4"
              type="radio"
              checked={outputFormat() === 'mp4'}
              name="formatRadio"
              onChange={() => setOutputFormat('mp4')}
            />
          </div>

          <div class="input__container">
            <label for="formatWebm">WEBM</label>
            <input
              id="formatWebm"
              type="radio"
              checked={outputFormat() === 'webm'}
              name="formatRadio"
              onChange={() => setOutputFormat('webm')}
            />
          </div>

          <div class="input__container">
            <label for="formatGif">GIF</label>
            <input
              id="formatGif"
              type="radio"
              checked={outputFormat() === 'gif'}
              name="formatRadio"
              onChange={() => setOutputFormat('gif')}
            />
          </div>
        </div>

        <div>Formats description:</div>
        <div>MP4 - fastest</div>
        <div>WEBM - very slow, but may be better and smaller</div>
        <div>GIF - looks like shit, but maybe you need it, I won't judge</div>

        <br />

        <div>Images:</div>
        <div class="images__container">
          <For each={images}>
            {(image, index) => (
              <div class="item">
                <div class="item__title">
                  <input
                    type="checkbox"
                    class="item__checkbox"
                    checked={image.enabled}
                    onChange={(e) => setImages(index(), 'enabled', e.currentTarget.checked)}
                  />
                  <div class="item__name">{image.name}</div>
                </div>

                <div class="item__input">
                  <label for="wInput">Width:</label>
                  {numberInput(index, image, 'w')}
                </div>

                <div class="item__input">
                  <label for="hInput">Height:</label>
                  {numberInput(index, image, 'h')}
                </div>

                <div class="item__input">
                  <label for="hInput">OffsetX:</label>
                  {numberInput(index, image, 'x')}
                </div>

                <div class="item__input">
                  <label for="hInput">OffsetY:</label>
                  {numberInput(index, image, 'y')}
                </div>
              </div>
            )}
          </For>
        </div>

        <br />

        <Switch>
          <Match when={!ffmpeg()}>
            <button class="download__button" disabled>
              Loading...
            </button>
          </Match>
          <Match when={!downloadStarted()}>
            <button class="download__button" onClick={downloadClick}>
              Download
            </button>
          </Match>
          <Match when={true}>
            <div>
              Progress {Math.floor(progress() * 100)}%({itemsDone()}/{itemsTotal()} images):
              <div class="progress_container">
                <div class="progress_foreground" style={{ width: `${200 * progress()}px` }} />
              </div>
            </div>
          </Match>
        </Switch>

        <div>
          logs:
          <p ref={(el) => (logsRef = el)} class="logs_container">
            {logs()}
          </p>
        </div>
      </div>
    </div>
  )
}
