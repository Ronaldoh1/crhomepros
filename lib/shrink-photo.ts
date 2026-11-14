/** Shrink a phone photo so it uploads fast on a weak signal (longest side 1600px, JPEG) */
export async function shrinkPhoto(file: File): Promise<Blob> {
  const MAX = 1600
  let source: ImageBitmap | HTMLImageElement
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions)
  } catch {
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('This photo could not be read.'))
      img.src = URL.createObjectURL(file)
    })
  }
  const scale = Math.min(1, MAX / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(source.width * scale)
  canvas.height = Math.round(source.height * scale)
  canvas.getContext('2d')!.drawImage(source, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error('This photo could not be prepared.'))), 'image/jpeg', 0.82))
}

