import Web3 from 'web3'

export const shortenHex = (hex: string, charsLength = 2, prefix = true) => {
  const value = Web3.utils.stripHexPrefix(hex)
  if (!value?.length || value.length < charsLength * 2) {
    return hex
  }
  const shorten = value.slice(0, charsLength) + '…' + value.slice(-charsLength)
  if (prefix) {
    return `0x${shorten}`
  }
  return shorten
}
