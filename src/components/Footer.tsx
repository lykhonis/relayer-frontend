import { Chip } from '@apideck/components'
import { balanceOf as rewardsBalanceOf } from 'contracts/pool/rewardToken'
import useWeb3 from 'hooks/useWeb3'
import { useEffect, useState } from 'react'
import { formatLyx } from 'utils/lyx'
import Web3 from 'web3'

const Footer = () => {
  const web3 = useWeb3()
  const [balance, setBalance] = useState<string>()

  useEffect(() => {
    const fetchBalance = async () => {
      if (web3) {
        try {
          const account = process.env.NEXT_PUBLIC_OWNER_ADDRESS as string
          const balance = Web3.utils.toBN(await web3.eth.getBalance(account))
          const rewardsBalance = await rewardsBalanceOf(web3, account)
          setBalance(formatLyx(balance.add(rewardsBalance), { decimals: 8 }))
        } catch (e) {
          console.error(e)
        }
      }
    }
    fetchBalance()
  }, [web3])

  return (
    <footer className="bg-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-md mx-auto sm:pt-12 px-4 sm:max-w-7xl sm:px-6 lg:pt-16 lg:px-8">
        <div className="border-t border-gray-200">
          {balance && (
            <div className="mt-2 flex flex-row gap-2 items-center">
              <p className="text-xs text-gray-600">relayer balance</p>
              <Chip
                size="small"
                label={balance ?? ''}
                className="whitespace-nowrap bg-green-100 text-green-600"
                colorClassName="gray"
              />
            </div>
          )}
          <div className="my-10">
            <p className="text-sm text-gray-400 xl:text-center">
              &copy; 2022 Relayer Service. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
