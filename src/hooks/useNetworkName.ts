import { useEffect, useState } from 'react'
import { getNetworkName } from 'utils/networkName'
import { useWeb3 } from './useWeb3'

const useNetworkName = () => {
  const web3 = useWeb3()
  const [name, setName] = useState<string>()
  useEffect(() => {
    if (web3) {
      getNetworkName(web3).then((name) => {
        if (name) {
          setName(name)
        }
      })
    }
  }, [web3])
  return name
}

export default useNetworkName
