// Minimal pure-JS WebM / Matroska demuxer -> EncodedVideoChunk inputs.
// Zero dependencies. Handles Segment>Tracks + Cluster>SimpleBlock/BlockGroup.
// Enough for Steam animated backgrounds (single video track, no lacing typical).

const ID = {
  Segment: 0x18538067,
  Info: 0x1549a966,
  TimecodeScale: 0x2ad7b1,
  Tracks: 0x1654ae6b,
  TrackEntry: 0xae,
  TrackNumber: 0xd7,
  TrackType: 0x83,
  CodecID: 0x86,
  CodecPrivate: 0x63a2,
  Video: 0xe0,
  PixelWidth: 0xb0,
  PixelHeight: 0xba,
  Cluster: 0x1f43b675,
  ClusterTimestamp: 0xe7,
  SimpleBlock: 0xa3,
  BlockGroup: 0xa0,
  Block: 0xa1,
  ReferenceBlock: 0xfb,
};

// Read an EBML element ID (marker bits kept).
function readId(buf, p) {
  const first = buf[p];
  let len = 0;
  for (let mask = 0x80; mask; mask >>= 1) { len++; if (first & mask) break; }
  let id = 0;
  for (let i = 0; i < len; i++) id = id * 256 + buf[p + i];
  return { id, size: len };
}

// Read an EBML VINT size (marker bit stripped).
function readVint(buf, p) {
  const first = buf[p];
  let len = 0, mask = 0x80;
  for (; mask; mask >>= 1) { len++; if (first & mask) break; }
  let value = first & (0xff >> len);
  for (let i = 1; i < len; i++) value = value * 256 + buf[p + i];
  return { value, size: len };
}

function readUint(buf, p, n) {
  let v = 0;
  for (let i = 0; i < n; i++) v = v * 256 + buf[p + i];
  return v;
}

// Walk children of a container spanning [start,end); invoke cb(id,dataStart,dataEnd).
function walk(buf, start, end, cb) {
  let p = start;
  while (p < end) {
    const idr = readId(buf, p); p += idr.size;
    const sz = readVint(buf, p); p += sz.size;
    let dataEnd;
    // "unknown size" (all ones) -> element runs to end of parent (common for Segment/Cluster streaming)
    const allOnes = (1 << (7 * sz.size)) - 1; // approx; treat huge as unknown
    if (sz.value >= allOnes && sz.value > 0x00ffffff) dataEnd = end;
    else dataEnd = p + sz.value;
    if (dataEnd > end) dataEnd = end;
    cb(idr.id, p, dataEnd);
    p = dataEnd;
  }
}

export interface DemuxedFrame {
  data: Uint8Array;
  timestampUs: number;
  key: boolean;
}

export function demuxWebM(uint8: Uint8Array) {
  const buf = uint8;
  let timecodeScale = 1000000; // ns per tick (default 1ms)
  const track = {
    number: 1,
    codecId: null as string | null,
    width: 0,
    height: 0,
    codecPrivate: null as Uint8Array | null,
  };
  const frames: DemuxedFrame[] = [];

  // top-level: find Segment
  walk(buf, 0, buf.length, (id, s, e) => {
    if (id !== ID.Segment) return;
    let clusterTs = 0;
    walk(buf, s, e, (id2, s2, e2) => {
      if (id2 === ID.Info) {
        walk(buf, s2, e2, (id3, s3, e3) => {
          if (id3 === ID.TimecodeScale) timecodeScale = readUint(buf, s3, e3 - s3);
        });
      } else if (id2 === ID.Tracks) {
        walk(buf, s2, e2, (id3, s3, e3) => {
          if (id3 !== ID.TrackEntry) return;
          walk(buf, s3, e3, (id4, s4, e4) => {
            if (id4 === ID.TrackNumber) track.number = readUint(buf, s4, e4 - s4);
            else if (id4 === ID.CodecID) track.codecId = new TextDecoder().decode(buf.subarray(s4, e4));
            else if (id4 === ID.CodecPrivate) track.codecPrivate = buf.slice(s4, e4);
            else if (id4 === ID.Video) {
              walk(buf, s4, e4, (id5, s5, e5) => {
                if (id5 === ID.PixelWidth) track.width = readUint(buf, s5, e5 - s5);
                else if (id5 === ID.PixelHeight) track.height = readUint(buf, s5, e5 - s5);
              });
            }
          });
        });
      } else if (id2 === ID.Cluster) {
        clusterTs = 0;
        walk(buf, s2, e2, (id3, s3, e3) => {
          if (id3 === ID.ClusterTimestamp) {
            clusterTs = readUint(buf, s3, e3 - s3);
          } else if (id3 === ID.SimpleBlock) {
            parseBlock(buf, s3, e3, clusterTs, true, false);
          } else if (id3 === ID.BlockGroup) {
            let hasRef = false, blkS = -1, blkE = -1;
            walk(buf, s3, e3, (id4, s4, e4) => {
              if (id4 === ID.ReferenceBlock) hasRef = true;
              else if (id4 === ID.Block) { blkS = s4; blkE = e4; }
            });
            if (blkS >= 0) parseBlock(buf, blkS, blkE, clusterTs, false, hasRef);
          }
        });
      }
    });
  });

  function parseBlock(buf, s, e, clusterTs, isSimple, hasRef) {
    let p = s;
    const tn = readVint(buf, p); p += tn.size; // track number
    if (tn.value !== track.number) return;
    const rel = (buf[p] << 8) | buf[p + 1]; // signed int16
    const relTs = rel > 0x7fff ? rel - 0x10000 : rel;
    p += 2;
    const flags = buf[p]; p += 1;
    const lacing = (flags >> 1) & 0x03;
    let key;
    if (isSimple) key = (flags & 0x80) !== 0;
    else key = !hasRef;
    if (lacing !== 0) {
      // Lacing present: rare for these files. Fall back: emit whole payload as one frame.
      // (Proper lacing handling omitted for brevity.)
    }
    const data = buf.slice(p, e);
    const tsUs = Math.round((clusterTs + relTs) * timecodeScale / 1000);
    frames.push({ data, timestampUs: tsUs, key });
  }

  frames.sort((a, b) => a.timestampUs - b.timestampUs);
  return { track, timecodeScale, frames };
}
