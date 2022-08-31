import { ImageInfo } from './image'

export interface ConverterProp {
  id: string
  info: {
    url: string
    images: ImageInfo[]
  }
}

export interface Background {
  steamUrl: string
  url: string
  iconUrl: string
}
