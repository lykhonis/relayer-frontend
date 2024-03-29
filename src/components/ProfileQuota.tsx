import { Button, useToast } from '@apideck/components'
import useProfile from 'hooks/useProfile'
import useWeb3 from 'hooks/useWeb3'
import { useCallback, useEffect, useState } from 'react'
import { quota as relayQuota, address as relayAddress } from 'contracts/relayContractor'
import {
  approve as approveRewardSpending,
  balanceOf as rewardBalanceOf
} from 'contracts/pool/rewardToken'
import BN from 'bn.js'
import { formatLyx } from 'utils/lyx'

type Quota = {
  used: number
  remaining: number
  needIncrease: boolean
}

const ProfileQuota = () => {
  const [quota, setQuota] = useState<Quota>()
  const web3 = useWeb3()
  const { profile } = useProfile()
  const { addToast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        if (web3 && profile?.address) {
          const { remaining, used } = await relayQuota(web3, profile?.address)
          const balance = await rewardBalanceOf(web3, profile?.address)
          if (remaining.isZero() && balance.isZero()) {
            const response = await fetch(`api/quota/${profile.address}`, {
              method: 'get',
              headers: { 'Accept-Type': 'application/json' }
            })
            if (response.ok) {
              const data = await response.json()
              setQuota(data)
              return
            }
          }
          const y = new BN(1e10)
          const yUsed = used.div(y).toNumber()
          const yRemaining = remaining.div(y).toNumber()
          const total = yUsed + yRemaining
          setQuota({
            used: total === 0 ? 0 : (100 * yUsed) / total,
            remaining: total === 0 ? 0 : (100 * yRemaining) / total,
            needIncrease: balance.gt(remaining)
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchQuota()
  }, [web3, profile?.address])

  const handleIncreaseQuota = useCallback(async () => {
    try {
      if (web3 && profile?.address) {
        setLoading(true)
        const { remaining } = await relayQuota(web3, profile.address)
        const balance = await rewardBalanceOf(web3, profile.address)
        await approveRewardSpending(web3, profile.address, relayAddress, balance)
        addToast({
          type: 'success',
          title: 'Increase Quota',
          description: `Quota was increased by ${formatLyx(balance.sub(remaining))}`
        })
      }
    } catch (e) {
      console.error(e)
      addToast({
        type: 'error',
        title: 'Increase Quota',
        description: 'Failed to increase a quota. Please try again'
      })
    } finally {
      setLoading(false)
    }
  }, [web3, profile?.address, addToast])

  return (
    <div className="p-6 w-full">
      <div className="mx-auto max-w-5xl flex flex-col overflow-hidden">
        <div className="pb-4 flex flex-row justify-between items-start">
          <div>
            <h3 className="text-md leading-6 text-gray-800">Transaction Fees Quota</h3>
            <p className="text-xs text-gray-500">
              The quota reflect usage of the relay service and amount of rewards (rLYX) available
              for Your account.
            </p>
          </div>
          {quota?.needIncrease && (
            <Button
              className="whitespace-nowrap"
              variant="primary"
              size="small"
              onClick={handleIncreaseQuota}
              isLoading={loading}
              disabled={loading}
            >
              Increase Quota
            </Button>
          )}
        </div>
        <div className="h-4 flex flex-row rounded-full overflow-hidden">
          {quota?.remaining || quota?.used ? (
            <>
              <span
                className="bg-primary-400 rounded-l-full"
                style={{ width: `${quota.used}%` }}
              ></span>
              <span
                className="bg-green-400 rounded-r-full"
                style={{ width: `${quota.remaining}%` }}
              ></span>
            </>
          ) : (
            <span className="bg-gray-100 w-full"></span>
          )}
        </div>
        <div className="flex flex-row gap-2 text-xs text-gray-500">
          <div className="p-2 flex flex-row items-baseline gap-1">
            <div className="w-2 h-2 rounded-full bg-primary-400"></div>
            <div>{`Used ${quota?.used?.toFixed(2) ?? 0}%`}</div>
          </div>
          <div className="py-2 flex flex-row items-baseline gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <div>{`Remaining ${quota?.remaining?.toFixed(2) ?? 0}%`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileQuota
