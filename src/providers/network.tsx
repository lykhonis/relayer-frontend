import useWeb3 from 'hooks/useWeb3'
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import { getNetworkName } from 'utils/networkName'

export interface NetworkContextProps {
  name: string
  chainId: number
}

export const NetworkContext = createContext<Partial<NetworkContextProps>>({})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const web3 = useWeb3()
  const [name, setName] = useState<string>()
  const [chainId, setChainId] = useState<number>()

  useEffect(() => {
    const fetch = async () => {
      if (web3) {
        const chainId = await web3.eth.getChainId()
        const name = getNetworkName(chainId)
        return { name, chainId }
      }
    }
    fetch().then((info) => {
      setName(info?.name)
      setChainId(info?.chainId)
    })
  }, [web3])

  const context = useMemo(
    () => ({
      name,
      chainId
    }),
    [name, chainId]
  )

  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>
}
