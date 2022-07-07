import { Button, TextInput } from '@apideck/components'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { formatLyx } from 'utils/lyx'
import Web3 from 'web3'

interface FormEntries {
  amount: string
}

const Deposit = () => {
  const [receivedTokens, setReceivedTokens] = useState<string>()
  const [loading, setLoading] = useState(false)

  const stats = [
    {
      name: 'Staking',
      value: '0 sLYX',
      meta: '$0.00'
    },
    {
      name: 'Rewards',
      value: '0 rLYX',
      meta: '$0.00'
    },
    {
      name: 'Staking APR',
      value: '8.05 %'
    }
  ]
  const deposit = [
    {
      name: 'Recipient',
      value: '0x0000...0000'
    },
    {
      name: 'Received Tokens',
      value: formatLyx(receivedTokens ?? '0')
    },
    {
      name: 'Activation Time',
      value: 'Immidiate'
    }
  ]

  const defaultValues = {}
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit: onSubmit,
    setError,
    clearErrors
  } = useForm<FormEntries>({ defaultValues })

  const amount = watch('amount')

  useEffect(() => {
    if (amount?.length > 0) {
      try {
        const amountWei = Web3.utils.toWei(amount, 'ether')
        setReceivedTokens(amountWei)
        clearErrors('amount')
      } catch {
        setError('amount', { type: 'validate' })
        setReceivedTokens(undefined)
      }
    } else {
      clearErrors('amount')
      setReceivedTokens(undefined)
    }
  }, [amount, clearErrors, setError, setReceivedTokens])

  const handleSubmit = useCallback(
    async (values: FormEntries) => {
      try {
        setLoading(true)
        const amountWei = Web3.utils.toWei(values.amount, 'ether')
        console.log(amountWei)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    },
    [setLoading]
  )

  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 grid-rows-1 lg:grid-cols-3 lg:grid-rows-3 gap-5">
        <div className="col-span-1 row-span-1 lg:row-span-3 lg:col-span-2">
          <div className="h-full rounded-lg bg-white overflow-hidden shadow px-4 py-5">
            <div className="mx-auto" style={{ width: '200px', height: '200px' }}>
              <Image src="/img/logo_large.png" width={200} height={200} alt="logo" />
            </div>
            <form onSubmit={onSubmit(handleSubmit)}>
              <div className="px-4 py-5 sm:px-6 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Deposit LYX to Pay for Fees
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  start earning staking rewards rLYX to redeem for LYX or use to pay transaction
                  fees
                </p>
              </div>
              <div className="flex flex-row max-w-md gap-4 mx-auto">
                <TextInput
                  placeholder="Enter amount"
                  className="w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                  disabled={loading}
                  {...register('amount', { required: true })}
                />
                <Button
                  type="submit"
                  text="Confirm"
                  size="large"
                  disabled={loading || Object.keys(errors).length > 0}
                  isLoading={loading}
                />
              </div>
              {Object.keys(errors).length ? (
                <div className="max-w-md mx-auto text-sm mt-1 text-red-600">
                  {errors.amount && <span>Specify correct amount of LYX to deposit</span>}
                </div>
              ) : (
                <></>
              )}
            </form>
            <div className="mt-4 sm:mt-5">
              <dl className="sm:divide-y sm:divide-gray-200">
                {deposit?.map((item) => (
                  <div
                    key={item.name}
                    className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt className="text-sm font-medium text-gray-500">{item.name}</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <div className="row-span-3">
          <dl className="grid grid-cols-1 gap-5">
            {stats?.map((item) => (
              <div key={item.name} className="px-4 py-5 bg-white shadow rounded-lg sm:p-6">
                <dt className="text-sm font-medium text-gray-500 whitespace-nowrap truncate">
                  {item.name}
                </dt>
                <dd className="mt-1">
                  <div className="text-3xl text-gray-900">{item.value}</div>
                  {item.meta && <div className="mt-1 text-md text-gray-500">{item.meta}</div>}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Deposit