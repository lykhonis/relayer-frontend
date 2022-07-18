import { Button } from '@apideck/components'
import { useCallback, useState } from 'react'
import ActionModal from './ActionModal'
import Relayer from './Relayer'

type Approval = {
  address: string
}

const approvals: Approval[] = [
  {
    address: '0x254bfE7E25184f72df435B5A9DA39Db6089dCaf5'
  },
  {
    address: '0x254bfE7E25184f72df435B5A9DA39Db6089dCaf6'
  },
  {
    address: '0x254bfE7E25184f72df435B5A9DA39Db6089dCaf7'
  },
  {
    address: '0x254bfE7E25184f72df435B5A9DA39Db6089dCaf8'
  },
  {
    address: '0x254bfE7E25184f72df435B5A9DA39Db6089dCaf9'
  }
]

const Service = () => {
  const [pendingRemoval, setPendingRemoval] = useState<Approval>()

  const handleGenerateKey = useCallback(async () => {
    // noop
  }, [])

  const handlePendingRemoveApproval = useCallback(async () => {
    if (pendingRemoval) {
      setPendingRemoval(undefined)
    }
  }, [pendingRemoval])

  return (
    <div className="max-w-3xl mx-auto px-4 my-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="rounded-lg overflow-hidden shadow px-4 py-5 h-full">
        <div className="px-4 py-5 sm:py-0 flex flex-row items-center">
          <div style={{ width: '200px', height: '200px' }}>
            <Relayer />
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">API Key</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Eenable customers to use Lukso blockchain for free. Transaction fee is deducted from
                your Universal Profile staking rewwards balance.
              </p>
            </div>
            <div className="mt-5">
              <Button onClick={handleGenerateKey}>Generate Key</Button>
            </div>
          </div>
        </div>

        {!approvals?.length ? (
          <></>
        ) : (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">Approved Contracts</span>
              </div>
            </div>
            <ul role="list" className="mt-6 overflow-hidden space-y-2">
              {approvals.map((approval) => (
                <li key={approval.address}>
                  <div className="border-gray-100 border-solid border rounded-lg p-2 flex flex-row justify-between">
                    <div className="text-sm text-gray-600 truncate">
                      <p>{approval.address}</p>
                    </div>
                    <i
                      className="cursor-pointer fill-current text-gray-300 hover:text-gray-600"
                      onClick={() => setPendingRemoval(approval)}
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
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </i>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <ActionModal
        variant="info"
        isOpened={pendingRemoval !== undefined}
        subject="Remove Approved Address"
        content={
          <>
            <p>
              Removing approved address (<b>{pendingRemoval?.address}</b>) will prevent users
              interracting with it.
            </p>
            <p className="mt-2">Would you like to remove the address?</p>
          </>
        }
        negativeAction={() => setPendingRemoval(undefined)}
        positiveTitle="Remove"
        positiveAction={handlePendingRemoveApproval}
      />
    </div>
  )
}

export default Service
