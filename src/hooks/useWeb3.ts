import { useContext } from 'react'
import Web3 from 'web3'
import { Web3Context } from 'providers/web3'

export const useWeb3 = () => useContext(Web3Context) as Web3 | undefined
