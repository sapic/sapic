// Cropping runs entirely in the browser using WebCodecs: the browser natively
// decodes the source video (AV1 / VP9 / VP8), we crop each frame on an
// OffscreenCanvas, re-encode to H.264, and mux to mp4. No ffmpeg.wasm.
import { Muxer, ArrayBufferTarget } from 'mp4-muxer'
import { demuxWebM } from './webmDemux'

// WebCodecs globals aren't in the default TS lib; treat them loosely.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare const VideoDecoder: any
declare const VideoEncoder: any
declare const EncodedVideoChunk: any
declare const VideoFrame: any

onmessage = async (event) => {
  if (event.data.type === 'convert') {
    await convert(event.data)
  }
}

function pickCodecString(codecId: string | null): string[] {
  if (codecId === 'V_AV1') return ['av01.0.08M.08', 'av01.0.04M.08', 'av01.0.05M.08']
  if (codecId === 'V_VP9') return ['vp09.00.10.08', 'vp09.00.41.08', 'vp09.00.31.08', 'vp09.02.10.08']
  if (codecId === 'V_VP8') return ['vp8']
  return []
}

async function firstSupported(candidates: string[], extra: any): Promise<string | null> {
  for (const c of candidates) {
    try {
      const r = await VideoDecoder.isConfigSupported({ codec: c, ...extra })
      if (r.supported) return c
    } catch (e) {
      /* try next */
    }
  }
  return null
}

async function convert(data: any) {
  const info = JSON.parse(data.options)
  if (!info.enabled) {
    console.log('Skip because disabled')
    return
  }

  try {
    if (typeof VideoDecoder === 'undefined' || typeof VideoEncoder === 'undefined') {
      postMessage({ type: 'error', ...info, reason: 'webcodecs-unsupported' })
      return
    }

    const buf = new Uint8Array(await (await fetch(data.url)).arrayBuffer())
    const { track, frames } = demuxWebM(buf)
    if (!frames.length || !track.width || !track.height) {
      postMessage({ type: 'error', ...info, reason: 'demux-failed' })
      return
    }

    const decCodec = await firstSupported(pickCodecString(track.codecId), {
      codedWidth: track.width,
      codedHeight: track.height,
    })
    if (!decCodec) {
      // e.g. AV1 on a browser without native AV1 decode (Safari)
      postMessage({ type: 'error', ...info, reason: 'no-decoder:' + track.codecId })
      return
    }

    // Match the old ffmpeg crop: crop=w:min(ih-y,h):x:y. H.264/yuv420p needs even dims.
    const outW = info.w - (info.w % 2)
    const cropH = Math.min(track.height - info.y, info.h)
    const outH = cropH - (cropH % 2)
    if (outW <= 0 || outH <= 0) {
      postMessage({ type: 'error', ...info, reason: 'bad-crop' })
      return
    }

    // Derive fps from timestamps; scale bitrate by area so small crops stay small.
    let fps = 30
    if (frames.length > 1) {
      const durUs = frames[frames.length - 1].timestampUs - frames[0].timestampUs
      if (durUs > 0) fps = Math.round((frames.length - 1) / (durUs / 1e6))
    }
    fps = Math.min(Math.max(fps, 1), 120)
    const bitrate = Math.max(300000, Math.round(outW * outH * fps * 0.12))
    const frameDurUs = Math.round(1e6 / fps)

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: { codec: 'avc', width: outW, height: outH },
      fastStart: 'in-memory',
    })

    let failed: string | null = null
    const encoder = new VideoEncoder({
      output: (chunk: any, meta: any) => {
        // Use addVideoChunkRaw with an explicit duration: Firefox leaves
        // EncodedVideoChunk.duration null, which addVideoChunk() rejects.
        const data = new Uint8Array(chunk.byteLength)
        chunk.copyTo(data)
        muxer.addVideoChunkRaw(data, chunk.type, chunk.timestamp, chunk.duration || frameDurUs, meta)
      },
      error: (e: any) => {
        failed = 'encoder:' + (e && e.message)
      },
    })
    encoder.configure({
      codec: 'avc1.640028',
      width: outW,
      height: outH,
      bitrate,
      bitrateMode: 'variable',
      framerate: fps,
      latencyMode: 'quality',
    })

    const canvas = new OffscreenCanvas(outW, outH)
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true }) as any
    const total = frames.length
    let cropped = 0

    const decoder = new VideoDecoder({
      output: (frame: any) => {
        try {
          ctx.drawImage(frame, info.x, info.y, outW, outH, 0, 0, outW, outH)
          const vf = new VideoFrame(canvas, {
            timestamp: frame.timestamp,
            duration: frame.duration || 0,
          })
          encoder.encode(vf, { keyFrame: cropped % (fps * 2) === 0 })
          vf.close()
          cropped++
          if (cropped % 10 === 0) {
            postMessage({ type: 'progress', data: { ratio: cropped / total } })
          }
        } finally {
          frame.close()
        }
      },
      error: (e: any) => {
        failed = 'decoder:' + (e && e.message)
      },
    })
    decoder.configure({ codec: decCodec, codedWidth: track.width, codedHeight: track.height })

    for (const f of frames) {
      decoder.decode(
        new EncodedVideoChunk({
          type: f.key ? 'key' : 'delta',
          timestamp: f.timestampUs,
          data: f.data,
        })
      )
      if (decoder.decodeQueueSize > 30) {
        while (decoder.decodeQueueSize > 10) await new Promise((r) => setTimeout(r, 0))
      }
    }

    await decoder.flush()
    await encoder.flush()
    muxer.finalize()
    decoder.close()
    encoder.close()

    if (failed) {
      postMessage({ type: 'error', ...info, reason: failed })
      return
    }

    const out = new Uint8Array(muxer.target.buffer)
    if (!out.length) {
      postMessage({ type: 'error', ...info, reason: 'empty-output' })
      return
    }

    postMessage({ type: 'done', ...info, data: out })
  } catch (e: any) {
    postMessage({ type: 'error', ...info, reason: String((e && e.message) || e) })
  }
}
