import { Tooltip } from '@apideck/components'
import useDeposit from 'hooks/useDeposit'
import usePrice from 'hooks/usePrice'
import { formatLyx } from 'utils/lyx'

const DepositStats = () => {
  const { price, currencySymbol, formatPrice } = usePrice()
  const deposit = useDeposit()

  const stats = [
    {
      name: 'Staking',
      value:
        price && formatPrice && deposit?.balances?.staked ? (
          <Tooltip text={formatPrice(deposit.balances.staked, price, currencySymbol)}>
            {formatLyx(deposit.balances.staked, { suffix: 'sLYX' })}
          </Tooltip>
        ) : (
          <>&#8230; sLYX</>
        )
    },
    {
      name: 'Rewards',
      value:
        price && formatPrice && deposit?.balances?.rewards ? (
          <Tooltip text={formatPrice(deposit.balances.rewards, price, currencySymbol)}>
            {formatLyx(deposit.balances.rewards, { suffix: 'rLYX' })}
          </Tooltip>
        ) : (
          <>&#8230; rLYX</>
        )
    },
    {
      name: 'Staking APR',
      value:
        deposit?.feePercent && deposit?.ratePercent ? (
          <Tooltip text={`Includes platform fee of ${deposit.feePercent}%`}>
            {Math.trunc(deposit.ratePercent * (100 - deposit.feePercent)) / 100} %
          </Tooltip>
        ) : (
          <>&#8230; %</>
        )
    }
  ]
  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats?.map((item) => (
          <div key={item.name} className="px-4 py-5 bg-white shadow rounded-lg sm:p-6">
            <dt className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl text-gray-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default DepositStats
