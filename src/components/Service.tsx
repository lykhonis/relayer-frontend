import { Button, useToast } from '@apideck/components'
import { getKeyManagerAddress } from 'contracts/profile'
import useProfile from 'hooks/useProfile'
import useWeb3 from 'hooks/useWeb3'
import { useCallback, useState } from 'react'
import useSWR from 'swr'
import { useClipboard } from 'use-clipboard-copy'
import { Messages } from 'utils/constants'
import { shorten } from 'utils/shorten'
import Web3 from 'web3'
import ActionModal from './ActionModal'
import AddressEntry from './AddressEntry'
import Relayer from './Relayer'

interface ServiceContract {
  address: string
}

interface Service {
  apiKey: string
  contracts: ServiceContract[]
}

const Service = () => {
  const [pendingRemoval, setPendingRemoval] = useState<ServiceContract>()
  const { profile } = useProfile()
  const web3 = useWeb3()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const clipboard = useClipboard()

  const { data, mutate } = useSWR<Service | undefined>(
    web3 && profile?.address ? profile.address : null,
    async (profile) => {
      if (web3) {
        const keyManager = await getKeyManagerAddress(web3, profile)
        const response = await fetch(`/api/service?keyManager=${keyManager}`, {
          method: 'get',
          headers: { 'Accept-Type': 'application/json' }
        })
        if (response.ok) {
          const data = await response.json()
          return {
            apiKey: data.apiKey,
            contracts: JSON.parse(data.contracts)
          }
        }
      }
    }
  )

  const handleGenerateKey = useCallback(async () => {
    try {
      if (web3 && profile?.address) {
        setLoading(true)
        const keyManager = await getKeyManagerAddress(web3, profile.address)
        const salt = Web3.utils.randomHex(32)
        const hash = Web3.utils.soliditySha3(keyManager, salt) as string
        const { signature } = (await web3.eth.sign(
          Messages.Request.GenerateKey(hash),
          profile.address
        )) as any
        const response = await fetch(`/api/service/${keyManager}`, {
          method: 'put',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Type': 'application/json'
          },
          body: JSON.stringify({ salt, signature })
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error)
        }
        await mutate({
          apiKey: data.apiKey,
          contracts: JSON.parse(data.contracts)
        })
        addToast({
          type: 'success',
          title: 'API Key',
          description: 'New API key has been generated'
        })
      }
    } catch (e: any) {
      console.error(e)
      addToast({
        type: 'error',
        title: 'API Key',
        description: e?.message ?? 'Failed to generate key'
      })
    } finally {
      setLoading(false)
    }
  }, [web3, profile?.address, addToast, mutate])

  const updateContracts = useCallback(
    async (newContracts) => {
      try {
        if (web3 && profile?.address) {
          setLoading(true)
          const keyManager = await getKeyManagerAddress(web3, profile.address)
          const salt = Web3.utils.randomHex(32)
          const hash = Web3.utils.soliditySha3(
            keyManager,
            JSON.stringify(newContracts),
            salt
          ) as string
          const { signature } = (await web3.eth.sign(
            Messages.Request.ApproveServiceContract(hash),
            profile.address
          )) as any
          const response = await fetch(`/api/service/${keyManager}/contracts`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
              'Accept-Type': 'application/json'
            },
            body: JSON.stringify({
              salt,
              signature,
              contracts: newContracts
            })
          })
          const { apiKey, contracts, error } = await response.json()
          if (!response.ok) {
            throw new Error(error)
          }
          addToast({
            type: 'success',
            title: 'Approved Address',
            description: 'Contracts have been updated'
          })
          return {
            apiKey,
            contracts: JSON.parse(contracts)
          }
        }
      } catch (e: any) {
        console.error(e)
        addToast({
          type: 'error',
          title: 'Approved Address',
          description: e?.message ?? 'Failed to update contracts'
        })
      } finally {
        setLoading(false)
      }
    },
    [web3, profile?.address, addToast]
  )

  const handleAddApproval = useCallback(
    async ({ address, clear }) => {
      const newContract = {
        address: address.toLowerCase()
      }
      const newContracts = [...(data?.contracts ?? [])]
      if (
        !newContracts.find(
          (contract) => contract.address.toLowerCase() === newContract.address.toLowerCase()
        )
      ) {
        newContracts.push(newContract)
      }
      const result = await updateContracts(newContracts)
      if (result) {
        mutate({
          apiKey: result.apiKey,
          contracts: result.contracts
        })
        clear()
      }
    },
    [data?.contracts, mutate, updateContracts]
  )

  const handlePendingRemoveApproval = useCallback(async () => {
    if (pendingRemoval) {
      setPendingRemoval(undefined)
      const newContracts = (data?.contracts ?? []).filter((contract) => contract !== pendingRemoval)
      const result = await updateContracts(newContracts)
      if (result) {
        mutate({
          apiKey: result.apiKey,
          contracts: result.contracts
        })
      }
    }
  }, [pendingRemoval, data?.contracts, mutate, updateContracts])

  const url = data?.apiKey
    ? `${window.location.origin}/api/delegate/${data.apiKey}/execute`
    : undefined

  const handleCopyUrl = useCallback(() => {
    if (clipboard && url) {
      clipboard.copy(url)
      addToast({ title: 'Copied', type: 'success' })
    }
  }, [url, clipboard, addToast])

  return (
    <div className="max-w-3xl mx-auto px-4 my-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="rounded-lg overflow-hidden shadow px-4 py-5 h-full">
        <div className="px-4 py-5 sm:py-0 flex flex-row items-center">
          <div style={{ width: '200px', height: '200px' }}>
            <Relayer />
          </div>
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Relay Url</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Eenable customers to use Lukso blockchain for free. Transaction fee is deducted from
                your Universal Profile staking rewards balance.
              </p>
            </div>
            {url && (
              <div className="mt-4 flex flex-row items-center">
                <p className="text-sm text-gray-600">{shorten(url, 15)}</p>
                <i className="ml-1 cursor-pointer" onClick={handleCopyUrl}>
                  <svg
                    className="h-5 w-5 text-gray-500 hover:text-gray-900"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />
                    <rect x="8" y="8" width="12" height="12" rx="2" />
                    <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>
                </i>
              </div>
            )}
            <div className="mt-5">
              <Button isLoading={loading} disabled={loading} onClick={handleGenerateKey}>
                Generate
              </Button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">Approved Contracts</span>
          </div>
        </div>

        {data?.contracts && (
          <ul role="list" className="mt-6 overflow-hidden space-y-2">
            {data?.contracts.map((contract) => (
              <li key={contract.address}>
                <div className="border-gray-100 border-solid border rounded-lg p-2 flex flex-row justify-between">
                  <div className="text-sm text-gray-600 truncate">
                    <p>{contract.address}</p>
                  </div>
                  <i
                    className="cursor-pointer fill-current text-gray-300 hover:text-red-600"
                    onClick={() => setPendingRemoval(contract)}
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
        )}

        <div className="mt-2 mr-2">
          <AddressEntry onSubmit={handleAddApproval} disabled={loading} />
        </div>
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
