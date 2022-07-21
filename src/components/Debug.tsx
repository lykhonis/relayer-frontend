import { Button, TextInput, useToast } from '@apideck/components'
import { balanceOf as rewardsBalanceOf } from 'contracts/pool/rewardToken'
import useWeb3 from 'hooks/useWeb3'
import { useCallback, useEffect, useState } from 'react'
import { formatLyx } from 'utils/lyx'
import BN from 'bn.js'
import Web3 from 'web3'
import { fee as relayerFee } from 'contracts/relayContractor'
import useProfile from 'hooks/useProfile'
import { getContract as getProfileContract, getKeyManagerAddress } from 'contracts/profile'
import { getContract as getKeyManagerContract } from 'contracts/keyManager'

const DebugProfileDataKey = Web3.utils.keccak256('RelayerService:Profile:DebugData')

type Stats = {
  balance: BN
  rewardsBalance: BN
  fee: number
}

const Debug = () => {
  const web3 = useWeb3()
  const [stats, setStats] = useState<Stats>()
  const { profile } = useProfile()
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const [serviceKey, setServiceKey] = useState<string>()
  const [profileData, setProfileData] = useState<string>()

  useEffect(() => {
    const fetch = async () => {
      if (web3) {
        try {
          const account = process.env.NEXT_PUBLIC_OWNER_ADDRESS as string
          const balance = Web3.utils.toBN(await web3.eth.getBalance(account))
          const rewardsBalance = await rewardsBalanceOf(web3, account)
          const fee = await relayerFee(web3)
          setStats({
            balance,
            rewardsBalance,
            fee
          })
        } catch (e) {
          console.error(e)
        }
      }
    }
    fetch()
  }, [web3])

  useEffect(() => {
    const fetch = async () => {
      if (web3 && profile?.address) {
        const profileContract = getProfileContract(web3, profile.address)
        const data = await profileContract.methods['getData(bytes32)'](DebugProfileDataKey).call()
        setProfileData(data)
      }
    }
    fetch()
  }, [web3, profile?.address])

  const handleUpdateProfileData = useCallback(async () => {
    if (web3 && profile?.address) {
      try {
        setLoading(true)
        let counter = 0
        if (profileData) {
          counter = Web3.utils.hexToNumber(profileData)
        }
        counter++

        const keyManager = await getKeyManagerAddress(web3, profile.address)
        const keyManagerContract = getKeyManagerContract(web3, keyManager)
        const profileContract = getProfileContract(web3, profile.address)

        const abi = profileContract.methods['setData(bytes32,bytes)'](
          DebugProfileDataKey,
          Web3.utils.numberToHex(counter)
        ).encodeABI()

        // const abi = profileContract.methods['execute(uint256,address,uint256,bytes)'](
        //   0,
        //   profile.address,
        //   0,
        //   profileContract.methods['setData(bytes32,bytes)'](
        //     DebugProfileDataKey,
        //     Web3.utils.numberToHex(counter)
        //   ).encodeABI()
        // ).encodeABI()

        const { address: controller } = (await web3.eth.sign(
          'Sign this message to get UP controller',
          profile.address
        )) as any

        const chainId = await web3.eth.getChainId()
        const nonce = await keyManagerContract.methods.getNonce(controller, 0).call()

        const hash = web3.utils.soliditySha3(
          { type: 'uint256', value: chainId.toString(10) },
          { type: 'address', value: keyManager },
          { type: 'uint256', value: nonce },
          { type: 'bytes', value: abi }
        ) as string

        const { signature } = (await web3.eth.sign(hash, profile.address)) as any

        const response = await fetch(serviceKey ? `api/execute/${serviceKey}` : 'api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keyManagerAddress: keyManager,
            transaction: {
              abi,
              nonce,
              signature
            }
          })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data?.error)
        }

        addToast({
          title: 'Profile Data',
          description: `Profile data has been updated to ${counter}. It may take a moment to reflect changes`,
          type: 'success'
        })
      } catch (e: any) {
        console.error(e)
        addToast({
          title: 'Profile Data',
          description: e.message ?? 'Failed to update profile data',
          type: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
  }, [web3, profile?.address, profileData, serviceKey, addToast])

  return (
    <>
      <div className="mt-10 pb-10">
        <div className="relative">
          <div className="absolute inset-0 h-1/2" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Balance (LYX)
                  </dt>
                  <dd className="order-1 text-4xl font-extrabold text-primary-600">
                    {stats ? (
                      formatLyx(stats.balance, {
                        suffix: null,
                        decimals: 8
                      })
                    ) : (
                      <>…</>
                    )}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Paid Out (rLYX)
                  </dt>
                  <dd className="order-1 text-4xl font-extrabold text-primary-600">
                    {stats ? (
                      formatLyx(stats.rewardsBalance, {
                        suffix: null,
                        decimals: 8
                      })
                    ) : (
                      <>…</>
                    )}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                    Platform Fee
                  </dt>
                  <dd className="order-1 text-4xl font-extrabold text-primary-600">
                    {`${stats?.fee ?? '…'}%`}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 my-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="rounded-lg overflow-hidden shadow px-4 py-5 h-full flex flex-col gap-10">
          <div>
            <dt className="text-sm text-gray-500">Service Key</dt>
            <dd className="mt-2">
              <TextInput
                name="serviceKey"
                type="text"
                placeholder="Enter a service key to pay for fees"
                className="max-w-md"
                disabled={loading}
                onChange={(event) => setServiceKey((event.target as any).value)}
              />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">
              Profile Data (Internal Call):{' '}
              <strong>{profileData ? Number(profileData) : 'N/A'}</strong>
            </dt>
            <dd className="mt-2">
              <Button
                variant="outline"
                text="Update"
                onClick={handleUpdateProfileData}
                disabled={loading}
              />
            </dd>
          </div>
        </div>
      </div>
    </>
  )
}

export default Debug
