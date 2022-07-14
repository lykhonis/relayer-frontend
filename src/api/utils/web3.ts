import Web3 from 'web3'

export const web3: Web3 = (() => {
  const web3 = new Web3(process.env.NEXT_PUBLIC_NETWORK_RPC_ENDPOINT as string)
  if (process.env.RELAYER_ACCOUNT) {
    const relayerAccount = web3.eth.accounts.wallet.add(process.env.RELAYER_ACCOUNT as string)
    web3.eth.defaultAccount = relayerAccount.address
  }
  return web3
})()

export const adjustGasEstimate = (estimate: number) => {
  const minimumGasRequired = 24_000
  const adjusted = Math.trunc(estimate * 1.1)
  return Math.max(minimumGasRequired, adjusted)
}

export const getFeeData = async (web3: Web3) => {
  const block = await web3.eth.getBlock('latest')
  if (!block || !block.baseFeePerGas) {
    console.error('Network does not support EIP-1559')
    return {}
  }
  const gasPrice = await web3.eth.getGasPrice()
  const maxPriorityFeePerGas = Web3.utils.toBN(Web3.utils.toWei('1.5', 'gwei'))
  const maxFeePerGas = Web3.utils
    .toBN(block.baseFeePerGas)
    .mul(Web3.utils.toBN(2))
    .add(maxPriorityFeePerGas)
  return { gasPrice, maxPriorityFeePerGas, maxFeePerGas }
}
