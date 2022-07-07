import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import ERC725, { ERC725JSONSchema } from '@erc725/erc725.js'
import LSP3 from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json'
import { useToast } from '@apideck/components'
import { UniversalProfile } from 'types/UniversalProfile'
import { useWeb3 } from 'hooks/useWeb3'
import { Lukso } from 'utils/constants'
import { getItem, removeItem, setItem } from 'utils/localStorage'

export interface ProfileContextProps {
  profile: UniversalProfile
  requestProfile: () => Promise<UniversalProfile | undefined>
  removeProfile: () => Promise<void>
  isLoading: boolean
}

export const ProfileContext = createContext<Partial<ProfileContextProps>>({})

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UniversalProfile>()
  const [isLoading, setLoading] = useState(false)
  const web3 = useWeb3()
  const { addToast } = useToast()

  const getProfile = useCallback(
    async (address: string) => {
      if (!web3) {
        return undefined
      }
      try {
        setLoading(true)
        const erc725 = new ERC725([...LSP3] as ERC725JSONSchema[], address, web3.currentProvider, {
          ipfsGateway: Lukso.ipfs.gateway
        })
        const data = await erc725.fetchData(['LSP3Profile'])
        const entries = Object.fromEntries(data?.map((entry) => [entry.name, entry.value]) ?? [])
        const profile = {
          ...(entries?.LSP3Profile as any)?.LSP3Profile,
          address
        }
        setProfile(profile)
        setItem('profileAddress', address)
        return profile
      } catch (e) {
        console.error(e)
        addToast({
          title: 'Universal Profile not found',
          type: 'warning',
          description:
            'Please make sure you have disabled Metamask and installed the Universal Profile browser extension.'
        })
        removeItem('profileAddress')
      } finally {
        setLoading(false)
      }
    },
    [web3, addToast]
  )

  const requestProfile = useCallback(async () => {
    if (!web3) {
      return undefined
    }
    try {
      setLoading(true)
      const accounts = await web3.eth.requestAccounts()
      return await getProfile(accounts[0])
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }, [web3, getProfile])

  const removeProfile = useCallback(async () => {
    setProfile(undefined)
    removeItem('profileAddress')
  }, [])

  useEffect(() => {
    if (!profile) {
      const address = getItem('profileAddress') as string
      if (address?.length) {
        getProfile(address)
      }
    }
  }, [profile, getProfile])

  const context = useMemo(
    () => ({
      profile,
      requestProfile,
      removeProfile,
      isLoading
    }),
    [profile, isLoading, removeProfile, requestProfile]
  )

  return <ProfileContext.Provider value={context}>{children}</ProfileContext.Provider>
}
