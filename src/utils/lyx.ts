import BN from 'bn.js'
import Web3 from 'web3'

export const formatLyx = (
  value: string | BN,
  { suffix = 'LYX', decimals }: { suffix?: string | null; decimals?: number | null } = {}
) => {
  const lyxValue = Number(Web3.utils.fromWei(value, 'ether')).toFixed(decimals ?? 4)
  if (suffix) {
    return `${lyxValue} ${suffix}`
  } else {
    return `${lyxValue}`
  }
}
