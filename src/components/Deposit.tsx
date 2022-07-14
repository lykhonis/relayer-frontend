import { Button, TextInput, useToast } from '@apideck/components'
import { stake } from 'contracts/pool/stakedToken'
import useDeposit from 'hooks/useDeposit'
import useProfile from 'hooks/useProfile'
import useWeb3 from 'hooks/useWeb3'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Web3 from 'web3'
import Relayer from './Relayer'

interface FormEntries {
  amount: string
}

const Deposit = () => {
  const [loading, setLoading] = useState(false)
  const web3 = useWeb3()
  const { profile } = useProfile()
  const { addToast } = useToast()
  const { refresh } = useDeposit()

  const defaultValues = {}
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit: onSubmit,
    setError,
    clearErrors,
    reset
  } = useForm<FormEntries>({ defaultValues })

  const amount = watch('amount')

  useEffect(() => {
    if (amount?.length > 0) {
      try {
        Web3.utils.toWei(amount, 'ether')
        clearErrors('amount')
      } catch {
        setError('amount', { type: 'validate' })
      }
    } else {
      clearErrors('amount')
    }
  }, [amount, clearErrors, setError])

  const handleSubmit = useCallback(
    async (values: FormEntries) => {
      if (web3 && profile?.address && addToast && reset && refresh) {
        try {
          setLoading(true)
          const amount = Web3.utils.toWei(values.amount, 'ether')
          await stake(web3, profile?.address, amount)
          reset()
          refresh()
          addToast({
            type: 'success',
            title: 'Deposit',
            description: 'Deposit has been made. It may take some time for rewards to appear'
          })
        } catch (e) {
          console.error(e)
          addToast({
            type: 'error',
            title: 'Deposit',
            description: 'Failed to make a deposit. Please try again'
          })
        } finally {
          setLoading(false)
        }
      }
    },
    [setLoading, reset, addToast, web3, profile?.address, refresh]
  )

  return (
    <div className="justify-center flex rounded-lg bg-white overflow-hidden shadow px-4 py-10">
      <form className="py-5" onSubmit={onSubmit(handleSubmit)}>
        <div className="text-center">
          <div className="mx-auto" style={{ width: '250px', height: '250px' }}>
            <Relayer />
          </div>
          <h3 className="text-lg mt-8 leading-6 font-medium text-gray-900">
            Deposit LYX to Pay for Fees
          </h3>
        </div>
        <div className="mt-6 flex flex-row max-w-md gap-4 mx-auto">
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
          <div className="max-w-md mx-auto text-xs mt-2 text-red-600">
            {errors.amount && <span>Specify correct amount of LYX to deposit</span>}
          </div>
        ) : (
          <></>
        )}
        <p className="mt-6 text-xs text-gray-500">
          start earning staking rewards rLYX to redeem for LYX or use to pay transaction fees
        </p>
      </form>
    </div>
  )
}

export default Deposit
