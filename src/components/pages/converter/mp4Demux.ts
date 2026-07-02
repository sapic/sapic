// Minimal MP4 -> EncodedVideoChunk demuxer built on mp4box.js, matching the
// shape of webmDemux so the worker can treat both containers the same way.
// mp4/h264 needs the avcC (or hvcC/av01C) "description" for VideoDecoder.configure.
import MP4Box from 'mp4box'
import type { DemuxedFrame } from './webmDemux'

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DemuxResult {
  codec: string
  width: number
  height: number
  description?: Uint8Array
  frames: DemuxedFrame[]
}

function getDescription(file: any, trackId: number): Uint8Array | undefined {
  const trak = file.getTrackById(trackId)
  for (const entry of trak.mdia.minf.stbl.stsd.entries) {
    const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C
    if (box) {
      const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN)
      box.write(stream)
      return new Uint8Array(stream.buffer, 8) // strip the 8-byte box header
    }
  }
  return undefined
}

export function demuxMp4(uint8: Uint8Array): Promise<DemuxResult> {
  return new Promise((resolve, reject) => {
    const file = MP4Box.createFile()
    const frames: DemuxedFrame[] = []
    let result: Omit<DemuxResult, 'frames'> | null = null

    file.onError = (e: any) => reject(new Error('mp4box: ' + e))

    file.onReady = (info: any) => {
      const vtrack = info.videoTracks && info.videoTracks[0]
      if (!vtrack) {
        reject(new Error('mp4: no video track'))
        return
      }
      result = {
        codec: vtrack.codec,
        width: vtrack.video ? vtrack.video.width : vtrack.track_width,
        height: vtrack.video ? vtrack.video.height : vtrack.track_height,
        description: getDescription(file, vtrack.id),
      }
      file.setExtractionOptions(vtrack.id, null, { nbSamples: Number.MAX_SAFE_INTEGER })
      file.start()
    }

    file.onSamples = (_id: number, _user: any, samples: any[]) => {
      for (const s of samples) {
        frames.push({
          data: s.data,
          timestampUs: Math.round((s.cts * 1e6) / s.timescale),
          key: !!s.is_sync,
        })
      }
    }

    const ab = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength) as any
    ab.fileStart = 0
    file.appendBuffer(ab)
    file.flush()

    if (!result) {
      reject(new Error('mp4: could not parse'))
      return
    }
    resolve({ ...result, frames })
  })
}
