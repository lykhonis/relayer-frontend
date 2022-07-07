import { useContext } from 'react'
import { PriceContext } from 'providers/price'

const usePrice = () => useContext(PriceContext)

export default usePrice
