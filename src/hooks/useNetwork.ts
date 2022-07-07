import { useContext } from 'react'
import { NetworkContext } from 'providers/network'

const useNetwork = () => useContext(NetworkContext)

export default useNetwork
