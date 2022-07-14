import BN from 'bn.js'
import Web3 from 'web3'

export const formatLyx = (
  value: string | BN,
  { suffix = 'LYX', decimals = 4 }: { suffix?: string; decimals?: number } = {}
) => {
  const lyxValue = Number(Web3.utils.fromWei(value, 'ether')).toFixed(decimals)
  if (suffix) {
    return `${lyxValue} ${suffix}`
  } else {
    return `${lyxValue}`
  }
}
