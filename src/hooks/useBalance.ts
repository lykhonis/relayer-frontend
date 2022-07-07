import { useEffect, useState } from 'react'
import useProfile from './useProfile'
import useWeb3 from './useWeb3'

const useBalance = ({ address }: { address?: string | undefined } = {}) => {
  const web3 = useWeb3()
  const { profile } = useProfile()
  const [balance, setBalance] = useState<string>()
  useEffect(() => {
    const profileAddress = address ?? profile?.address
    if (web3 && profileAddress) {
      web3.eth.getBalance(profileAddress).then((balance) => setBalance(balance))
    }
  }, [web3, address, profile?.address])
  return balance
}

export default useBalance
