import RelayContractor from './abi/RelayContractor.json'
import { adjustGasEstimate, getFeeData } from 'api/utils/web3'
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

export const execute = async (web3: Web3, profile: string, transaction: string) => {
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  const contract = getContract(web3)
  const method = contract.methods.execute(profile, transaction)
  const account = web3.eth.defaultAccount as string
  const gas = adjustGasEstimate(await method.estimateGas({ from: account }))
  return await method.send({
    from: account,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas
  })
}
