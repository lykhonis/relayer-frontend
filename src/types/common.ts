import { ImageMetadata } from '@lukso/lsp-factory.js'

export interface UniversalProfile {
  name: string
  description?: string
  profileImage?: ImageMetadata[]
  backgroundImage?: ImageMetadata[]
  links?: { title: string; url: string }[]
  tags?: string[]
  address?: string
}

export interface RelayTransactionParameters {
  abi: string
  signature: string
  nonce: number
}
