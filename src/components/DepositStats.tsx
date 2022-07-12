import { Tooltip } from '@apideck/components'
import usePrice from 'hooks/usePrice'
import { formatLyx } from 'utils/lyx'

const DepositStats = () => {
  const { price, currencySymbol, formatPrice } = usePrice()
  const stats = [
    {
      name: 'Staking',
      value:
        price && formatPrice ? (
          <Tooltip text={formatPrice('0', price, currencySymbol)}>
            {formatLyx('0', { suffix: 'sLYX' })}
          </Tooltip>
        ) : (
          formatLyx('0', { suffix: 'sLYX' })
        )
    },
    {
      name: 'Rewards',
      value:
        price && formatPrice ? (
          <Tooltip text={formatPrice('0', price, currencySymbol)}>
            {formatLyx('0', { suffix: 'rLYX' })}
          </Tooltip>
        ) : (
          formatLyx('0', { suffix: 'rLYX' })
        )
    },
    {
      name: 'Staking APR',
      value: '8.05 %'
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
