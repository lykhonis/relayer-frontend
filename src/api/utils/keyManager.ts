import LSP6KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json'
import { Contract } from 'web3-eth-contract'
import { adjustGasEstimate, getFeeData, web3 } from './web3'
import { RelayTransactionParameters } from '../types'

export const getKeyManagerContract = (address: string) =>
  new web3.eth.Contract(LSP6KeyManager.abi as any, address)

export const executeRelayCall = async ({
  keyManager,
  abi,
  nonce,
  signature
}: { keyManager: string | Contract } & RelayTransactionParameters) => {
  let contract = keyManager
  if (typeof keyManager === 'string') {
    contract = getKeyManagerContract(keyManager)
  }
  const method = (contract as Contract).methods.executeRelayCall(nonce, abi, signature)
  const gas = adjustGasEstimate(await method.estimateGas())
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  return await method.send({ gas, maxFeePerGas, maxPriorityFeePerGas })
}
