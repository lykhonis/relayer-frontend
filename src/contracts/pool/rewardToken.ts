import Web3 from 'web3'
import BN from 'bn.js'
import RewardToken from '../abi/pool/RewardToken.json'
import { adjustGasEstimate, getFeeData } from 'api/utils/web3'

const getContract = (web3: Web3) =>
  new web3.eth.Contract(RewardToken.abi as any, process.env.NEXT_PUBLIC_CONTRACT_REWARD_TOKEN)

export const balanceOf = async (web3: Web3, profile: string) => {
  const balanace = await getContract(web3).methods.balanceOf(profile).call()
  return Web3.utils.toBN(balanace)
}

export const rate = async (web3: Web3) => {
  const rate = await getContract(web3).methods.rewardsRate().call()
  return Number(rate) / 1_000
}

export const approve = async (
  web3: Web3,
  profile: string,
  spender: string,
  amount: string | BN
) => {
  const method = await getContract(web3).methods.approve(spender, amount)
  const gas = adjustGasEstimate(await method.estimateGas({ from: profile }))
  const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(web3)
  return await method.send({
    from: profile,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas
  })
}
