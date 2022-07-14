import Web3 from 'web3'
import BN from 'bn.js'
import StakedToken from '../abi/pool/StakedToken.json'
import { adjustGasEstimate, getFeeData } from 'api/utils/web3'

const getContract = (web3: Web3) =>
  new web3.eth.Contract(StakedToken.abi as any, process.env.NEXT_PUBLIC_CONTRACT_STAKED_TOKEN)

export const balanceOf = async (web3: Web3, profile: string) => {
  const balanace = await getContract(web3).methods.balanceOf(profile).call()
  return Web3.utils.toBN(balanace)
}

export const stake = async (web3: Web3, profile: string, amount: string | BN) => {
  const method = await getContract(web3).methods.stake()
  const gas = adjustGasEstimate(await method.estimateGas({ from: profile, value: amount }))
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  return await method.send({
    from: profile,
    value: amount,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas
  })
}
