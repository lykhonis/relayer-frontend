import { createContext, ReactNode, useEffect, useMemo, useState } from 'react'
import BN from 'bn.js'
import Web3 from 'web3'

export interface PriceContextProps {
  price: string
  currency: string
  currencySymbol: string
  formatPrice: (wei: string | BN, price: string | number, currencySymbol?: string) => string
}

const formatPrice = (wei: string | BN, price: string | number, currencySymbol?: string) => {
  const amount = Number(Web3.utils.fromWei(wei, 'ether'))
  const priceCents = Math.trunc(Number(price) * 100)
  const full = Math.trunc((amount * priceCents) / 100)
  const cents = Math.trunc((amount * priceCents) % 100)
  const formatted = cents === 0 ? `${full}` : `${full}.${cents < 10 ? '0' : ''}${cents}`
  if (currencySymbol) {
    return `${currencySymbol}${formatted}`
  } else {
    return formatted
  }
}

export const PriceContext = createContext<Partial<PriceContextProps>>({})

export function PriceProvider({ children }: { children: ReactNode }) {
  const [price, setPrice] = useState<string>()

  useEffect(() => {
    const fetchPrice = async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=lukso-token&vs_currencies=usd',
        {
          method: 'GET',
          headers: {
            'Accept-Content': 'application/json'
          }
        }
      )
      if (response.ok) {
        const data = await response.json()
        const price = data?.['lukso-token']?.usd
        return price
      }
    }
    if (!price) {
      fetchPrice().then((price) => setPrice(price))
    }
  }, [price])

  const context = useMemo(
    () => ({
      price,
      currency: 'usd',
      currencySymbol: '$',
      formatPrice
    }),
    [price]
  )

  return <PriceContext.Provider value={context}>{children}</PriceContext.Provider>
}
