import Web3 from 'web3'

export const shortenAddress = (address: string, charsLength = 6) => {
  const value = Web3.utils.stripHexPrefix(address)
  if (!value?.length || value.length < charsLength * 2) {
    return address
  }
  return value.slice(0, charsLength) + '…' + value.slice(-charsLength)
}
