import { ImageMetadata } from '@lukso/lsp-factory.js'

export const findBestProfileImage = ({
  images,
  minimumWidth,
  minimumHeight
}: {
  images: ImageMetadata[] | undefined
  minimumWidth: number | undefined
  minimumHeight: number | undefined
}) => {
  if (!images?.length) {
    return null
  }
  let image: ImageMetadata | undefined
  images.forEach((entry) => {
    if (
      (minimumWidth && entry.width < minimumWidth) ||
      (minimumHeight && entry.height < minimumHeight)
    ) {
      return
    }
    if (!image || image.width > entry.width || image.height > entry.height) {
      image = entry
    }
  })
  return image ?? images[0]
}
