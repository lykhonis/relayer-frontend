import { useContext } from 'react'
import { Web3Context } from 'providers/web3'

const useWeb3 = () => useContext(Web3Context)

export default useWeb3
