export const useBlob64 = (str: string) => {
  const pos = str.indexOf(';base64,')
  const type = str.substring(5, pos)
  const b64 = str.substring(pos + 8)

  const imageContent = atob(b64)

  const buffer = new ArrayBuffer(imageContent.length)
  const view = new Uint8Array(buffer)

  for (let n = 0; n < imageContent.length; n++) {
    view[n] = imageContent.charCodeAt(n)
  }

  const blob = new Blob([buffer], { type: type })

  return blob
}