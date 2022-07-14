import BN from 'bn.js'
import useWeb3 from 'hooks/useWeb3'
import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { balanceOf as rewardBalanceOf, rate as rewardRate } from 'contracts/pool/rewardToken'
import { balanceOf as stakedBalanceOf } from 'contracts/pool/stakedToken'
import { fee as relayFee } from 'contracts/relayContractor'
import useProfile from 'hooks/useProfile'

export interface DepositContextProps {
  balances: {
    rewards?: BN
    staked?: BN
  }
  ratePercent: number
  feePercent: number
  refresh: () => Promise<void>
}

export const DepositContext = createContext<Partial<DepositContextProps>>({})

export function DepositProvider({ children }: { children: ReactNode }) {
  const web3 = useWeb3()
  const { profile } = useProfile()
  const [rewards, setRewards] = useState<BN>()
  const [staked, setStaked] = useState<BN>()
  const [ratePercent, setRatePercent] = useState<number>()
  const [feePercent, setFeePercent] = useState<number>()

  const refresh = useCallback(async () => {
    if (web3 && profile?.address) {
      try {
        setRewards(await rewardBalanceOf(web3, profile.address))
        setStaked(await stakedBalanceOf(web3, profile?.address))
        setRatePercent(await rewardRate(web3))
        setFeePercent(await relayFee(web3))
      } catch (e) {
        console.error(e)
      }
    } else {
      setRewards(undefined)
      setStaked(undefined)
      setRatePercent(undefined)
      setFeePercent(undefined)
    }
  }, [web3, profile?.address])

  useEffect(() => {
    refresh()
  }, [refresh])

  const context = useMemo(
    () => ({
      balances: {
        rewards,
        staked
      },
      ratePercent,
      feePercent,
      refresh
    }),
    [rewards, staked, ratePercent, feePercent, refresh]
  )

  return <DepositContext.Provider value={context}>{children}</DepositContext.Provider>
}
