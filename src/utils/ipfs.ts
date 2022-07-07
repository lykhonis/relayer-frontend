import { Lukso } from './constants'

export const ipfsToHttp = (uri: string) => {
  if (uri.startsWith('ipfs://')) {
    return Lukso.ipfs.gateway + uri.slice(7)
  }
  return uri
}
