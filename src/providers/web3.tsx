import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'

export const Web3Context = createContext<Web3 | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [web3, setWeb3] = useState<Web3>()

  useEffect(() => {
    const getWeb3 = async () => {
      const web3 = new Web3((window as any).ethereum)
      return web3
    }

    getWeb3().then((web3) => setWeb3(web3))
  }, [])

  const context = useMemo(() => web3, [web3])

  return <Web3Context.Provider value={context}>{children}</Web3Context.Provider>
}
