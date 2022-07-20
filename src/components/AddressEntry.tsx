import { useForm } from 'react-hook-form'
import { TextInput } from '@apideck/components'
import Web3 from 'web3'
import { useEffect } from 'react'
import classNames from 'classnames'

interface FormEntries {
  address: string
}

const AddressEntry = ({
  onSubmit,
  disabled
}: {
  onSubmit?: ({ address, clear }: { address: string; clear: () => void }) => void
  disabled?: boolean
} = {}) => {
  const defaultValues = {}
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    getValues,
    trigger,
    setError,
    clearErrors,
    reset
  } = useForm<FormEntries>({ defaultValues })

  const address = watch('address')

  useEffect(() => {
    if (address?.length > 0 && !Web3.utils.isAddress(address)) {
      setError('address', { type: 'validate' })
    } else {
      clearErrors('address')
    }
  }, [address, clearErrors, setError])

  return (
    <form
      onSubmit={handleSubmit((entries) => {
        if (onSubmit) {
          onSubmit({ ...entries, clear: reset })
        }
      })}
    >
      <div className="flex flex-row items-center gap-2">
        <TextInput
          className="w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter contract address 0x…"
          disabled={disabled}
          {...register('address', { required: true })}
        />
        <i
          className={classNames(
            'cursor-pointer fill-current',
            disabled ? 'text-primary-200' : 'text-primary-400 hover:text-primary-600'
          )}
          onClick={async () => {
            if (!disabled && onSubmit) {
              const result = await trigger('address')
              if (result) {
                onSubmit({ ...getValues(), clear: reset })
              }
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </i>
      </div>
      {Object.keys(errors).length ? (
        <div className="text-xs mt-2 text-red-600">
          {errors.address && <span>Specify correct contract address</span>}
        </div>
      ) : (
        <></>
      )}
    </form>
  )
}

export default AddressEntry
