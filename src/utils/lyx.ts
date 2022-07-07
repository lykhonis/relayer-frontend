import BN from 'bn.js'
import Web3 from 'web3'

export const formatLyx = (value: string | BN, { suffix = 'LYX' }: { suffix?: string } = {}) => {
  const lyxValue = Web3.utils.fromWei(value, 'ether')
  if (suffix) {
    return `${lyxValue} ${suffix}`
  } else {
    return `${lyxValue}`
  }
}
