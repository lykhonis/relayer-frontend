import Web3 from 'web3'

export const web3: Web3 = (() => {
  const web3 = new Web3(process.env.NEXT_PUBLIC_NETWORK_RPC_ENDPOINT as string)
  const relayerAccount = web3.eth.accounts.wallet.add(process.env.RELAYER_ACCOUNT as string)
  web3.eth.defaultAccount = relayerAccount.address
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

  // const blocks = await web3.eth.getFeeHistory(1, 'latest', [50])
  // if (blocks) {
  //   try {
  //     const baseFeePerGas = Web3.utils.hexToNumber(blocks.baseFeePerGas[0])
  //     const maxPriorityFeePerGas = Web3.utils.hexToNumber(blocks.reward[0][0])
  //     if (
  //       (maxPriorityFeePerGas && !isNaN(maxPriorityFeePerGas) && baseFeePerGas) ||
  //       !isNaN(baseFeePerGas)
  //     ) {
  //       return {
  //         maxPriorityFeePerGas: Web3.utils.toBN(maxPriorityFeePerGas),
  //         maxFeePerGas: Web3.utils.toBN(baseFeePerGas + maxPriorityFeePerGas)
  //       }
  //     }
  //   } catch (e) {
  //     console.error(e)
  //   }
  // }

  // See: https://eips.ethereum.org/EIPS/eip-1559
  const maxPriorityFeePerGas = Web3.utils.toBN(Web3.utils.toWei('1.5', 'gwei'))
  const maxFeePerGas = Web3.utils
    .toBN(block.baseFeePerGas)
    .mul(Web3.utils.toBN(2))
    .add(maxPriorityFeePerGas)

  return { maxPriorityFeePerGas, maxFeePerGas }
}
