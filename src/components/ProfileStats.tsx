import { Tooltip } from '@apideck/components'
import usePrice from 'hooks/usePrice'
import { useProfile } from 'hooks/useProfile'
import { useWeb3 } from 'hooks/useWeb3'
import { ReactNode, useEffect, useState } from 'react'
import { formatLyx } from 'utils/lyx'

enum Stats {
  BALANCE = 'Balance',
  TRANSACTION_COUNT = 'Transaction Count',
  ACTIVE_DAYS = 'Active Days'
}

const ProfileStats = () => {
  const web3 = useWeb3()
  const { profile } = useProfile()
  const { price, currencySymbol, formatPrice } = usePrice()
  const [stats, setStats] = useState<{ name: string; value: string | ReactNode }[]>([
    {
      name: Stats.BALANCE,
      value: '…'
    },
    {
      name: Stats.TRANSACTION_COUNT,
      value: '…'
    },
    {
      name: Stats.ACTIVE_DAYS,
      value: '…'
    }
  ])

  useEffect(() => {
    const fetchStats = async () => {
      if (web3 && profile?.address) {
        const transactionCount = await web3.eth.getTransactionCount(profile.address)
        const balance = await web3.eth.getBalance(profile.address)
        const balanceTotal = price ? formatPrice(balance, price, currencySymbol) : undefined
        const stats = [
          {
            name: Stats.BALANCE,
            value: balanceTotal ? (
              <Tooltip text={balanceTotal}>{formatLyx(balance)}</Tooltip>
            ) : (
              formatLyx(balance)
            )
          },
          {
            name: Stats.TRANSACTION_COUNT,
            value: transactionCount.toString()
          }
        ]
        const currentBlockNumber = await web3.eth.getBlockNumber()
        const chunks = 100_000
        for (let i = 0; i < currentBlockNumber; i += chunks) {
          const logs = await web3.eth.getPastLogs({
            address: profile.address,
            fromBlock: i,
            toBlock: i + chunks - 1
          })
          if (logs.length) {
            const blockNumber = logs[0].blockNumber
            const block = await web3.eth.getBlock(blockNumber)
            stats.push({
              name: Stats.ACTIVE_DAYS,
              value: (
                <Tooltip text={new Date(Number(block.timestamp) * 1000).toLocaleDateString()}>
                  {Math.ceil(
                    (new Date().getTime() / 1000 - Number(block.timestamp)) / (60 * 60 * 24)
                  ).toString()}
                </Tooltip>
              )
            })
            break
          }
        }
        setStats(stats)
      }
    }
    fetchStats()
  }, [web3, profile?.address, currencySymbol, price, formatPrice])

  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats?.map((item) => (
          <div key={item.name} className="px-4 py-5 bg-white shadow rounded-lg sm:p-6">
            <dt className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ProfileStats

{
  /* <div className="border-t border-gray-200">
      <dl className="sm:divide-y sm:divide-gray-200">
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500">Full name</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Margot Foster</dd>
        </div>
        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500">Application for</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Backend Developer</dd>
        </div>
      </dl>
    </div> */
}
