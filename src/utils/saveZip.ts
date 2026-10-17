/**
 * Pack files into a .zip and save it. jszip (~95 KB) and file-saver are only
 * needed when a converted video is downloaded, so they are loaded here, on
 * first use, instead of in the main bundle every visitor downloads.
 */
export async function saveZip(
  files: Array<{ name: string; data: Uint8Array | Blob | string }>,
  zipName: string
): Promise<void> {
  const [{ default: JSZip }, { saveAs }] = await Promise.all([
    import('jszip'),
    import('file-saver'),
  ])
  const zip = new JSZip()
  for (const f of files) zip.file(f.name, f.data)
  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, zipName)
}

/** Start loading the zip code early (e.g. when a conversion starts) */
export function preloadZip(): void {
  void import('jszip')
  void import('file-saver')
}
