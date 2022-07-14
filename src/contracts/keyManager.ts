import LSP6KeyManager from '@lukso/lsp-smart-contracts/artifacts/LSP6KeyManager.json'
import { Contract } from 'web3-eth-contract'
import { adjustGasEstimate, getFeeData } from 'api/utils/web3'
import { RelayTransactionParameters } from 'types/common'
import Web3 from 'web3'

const getContract = (web3: Web3, keyManager: string | Contract) => {
  if (typeof keyManager === 'string') {
    return new web3.eth.Contract(LSP6KeyManager.abi as any, keyManager)
  }
  return keyManager
}

export const executeRelayCall = async ({
  web3,
  keyManager,
  abi,
  nonce,
  signature
}: { web3: Web3; keyManager: string | Contract } & RelayTransactionParameters) => {
  const contract = getContract(web3, keyManager)
  const method = contract.methods.executeRelayCall(nonce, abi, signature)
  const gas = adjustGasEstimate(await method.estimateGas())
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  return await method.send({
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas
  })
}

export const getProfileAddress = async (web3: Web3, keyManager: string | Contract) => {
  const contract = getContract(web3, keyManager)
  return (await contract.methods.target().call()) as string
}
