import RelayContractor from './abi/RelayContractor.json'
import { Contract } from 'web3-eth-contract'
import { adjustGasEstimate, getFeeData } from 'api/utils/web3'
import { RelayTransactionParameters } from 'types/common'
import Web3 from 'web3'

export const address = process.env.NEXT_PUBLIC_CONTRACT_RELAY_CONTRACTOR as string

const getContract = (web3: Web3) => new web3.eth.Contract(RelayContractor.abi as any, address)

export const quota = async (web3: Web3, profile: string) => {
  const { used, remaining } = await getContract(web3).methods.quota(profile).call()
  return {
    used: Web3.utils.toBN(used),
    remaining: Web3.utils.toBN(remaining)
  }
}

export const fee = async (web3: Web3) => {
  const fee = await getContract(web3).methods.fee().call()
  return Number(fee) / 1_000
}

export const executeRelayCall = async ({
  web3,
  keyManager,
  abi,
  nonce,
  signature
}: {
  web3: Web3
  keyManager: string | Contract
} & RelayTransactionParameters) => {
  const { maxFeePerGas, maxPriorityFeePerGas, gasPrice } = await getFeeData(web3)
  const method = getContract(web3).methods.executeRelayCall(
    keyManager,
    gasPrice,
    signature,
    nonce,
    abi
  )
  const gas = adjustGasEstimate(await method.estimateGas())
  return await method.send({ gas, maxFeePerGas, maxPriorityFeePerGas })
}
