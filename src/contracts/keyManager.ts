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
  signature,
  accountNonce
}: {
  web3: Web3
  keyManager: string | Contract
  accountNonce?: number
} & RelayTransactionParameters) => {
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  const contract = getContract(web3, keyManager)
  const method = contract.methods.executeRelayCall(signature, nonce, abi)
  const account = web3.eth.defaultAccount as string
  const gas = adjustGasEstimate(await method.estimateGas({ from: account }))
  const txNonce = accountNonce ?? (await web3.eth.getTransactionCount(account, 'latest'))
  const data = await web3.eth.accounts.signTransaction(
    {
      to: contract.options.address,
      nonce: txNonce,
      gas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      data: method.encodeABI()
    },
    process.env.RELAYER_ACCOUNT as string
  )
  return {
    transactionHash: data.transactionHash as string,
    send: () => web3.eth.sendSignedTransaction(data.rawTransaction as string)
  }
}

export const getProfileAddress = async (web3: Web3, keyManager: string | Contract) => {
  const contract = getContract(web3, keyManager)
  return (await contract.methods.target().call()) as string
}
