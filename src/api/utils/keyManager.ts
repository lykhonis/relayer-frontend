import LSP6KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json'
import { Contract } from 'web3-eth-contract'
import { adjustGasEstimate, getFeeData, web3 } from './web3'
import { RelayTransactionParameters } from '../types'

export const getKeyManagerContract = (address: string) =>
  new web3.eth.Contract(LSP6KeyManager.abi as any, address)

const getKeyManager = (keyManager: string | Contract) => {
  if (typeof keyManager === 'string') {
    return getKeyManagerContract(keyManager)
  }
  return keyManager
}

export const executeRelayCall = async ({
  keyManager,
  abi,
  nonce,
  signature
}: { keyManager: string | Contract } & RelayTransactionParameters) => {
  const contract = getKeyManager(keyManager)
  const method = contract.methods.executeRelayCall(nonce, abi, signature)
  const gas = adjustGasEstimate(await method.estimateGas())
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  return await method.send({ gas, maxFeePerGas, maxPriorityFeePerGas })
}

export const getProfileAddress = async (keyManager: string | Contract) => {
  const contract = getKeyManager(keyManager)
  return (await contract.methods.target().call()) as string
}
