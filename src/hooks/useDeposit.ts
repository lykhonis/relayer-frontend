import { useContext } from 'react'
import { DepositContext } from 'providers/deposit'

const useDeposit = () => useContext(DepositContext)

export default useDeposit
