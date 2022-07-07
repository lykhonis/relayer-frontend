import { ReactNode, RefObject, useRef, useState } from 'react'
import { Button, Chip } from '@apideck/components'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useProfile } from 'hooks/useProfile'
import { shortenAddress } from 'utils/shortenAddress'

export const Navbar = ({ children }: { children?: ReactNode }) => {
  const navbarNode = useRef() as RefObject<HTMLDivElement>
  const hamburgerNode = useRef() as RefObject<HTMLDivElement>
  const [navbarOpen, setNavbarOpen] = useState(false)
  const { pathname } = useRouter()
  const { profile, isLoading, requestProfile } = useProfile()
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <Link href="/">
                <a className="flex items-center mr-6">
                  <Image src="/img/logo.png" width={32} height={32} alt="logo" />
                </a>
              </Link>
            </div>
            <div className="hidden md:flex w-full justify-between">
              <div className="flex items-baseline">
                <Link href={`/deposit`}>
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname.includes('/deposit') && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Deposit
                  </a>
                </Link>
                <Link href={`/transactions`}>
                  <a
                    className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                      pathname.includes('/transactions') && 'text-primary-700 bg-gray-100'
                    }`}
                  >
                    Transactions
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <div className="hidden md:block">
              <div className="flex items-center ml-4 md:ml-6">
                {children}
                <Chip size="small" label={`Testnet L16`} className="whitespace-nowrap" />
                {profile ? (
                  <div className="whitespace-nowrap ml-4 text-sm font-medium">
                    {profile.name ?? shortenAddress(profile.address ?? '')}
                  </div>
                ) : (
                  <Button
                    onClick={requestProfile}
                    isLoading={isLoading}
                    className="whitespace-nowrap ml-4"
                  >
                    Connect Profile
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="flex -mr-2 md:hidden" ref={hamburgerNode}>
            <button
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-primary-700 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-primary-700"
            >
              <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {navbarOpen ? (
                  <path
                    className="inline-flex"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    className="inline-flex"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {navbarOpen && (
        <div className="block border-b border-gray-200 md:hidden" ref={navbarNode}>
          <div className="px-2 py-3 sm:px-3">
            <Link href={`/deposit`}>
              <a
                className={`block px-3 py-2 mt-1 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  pathname.includes('/deposit') && 'text-primary-700 bg-gray-100'
                }`}
              >
                Deposit
              </a>
            </Link>
            <Link href={`/transactions`}>
              <a
                className={`block px-3 py-2 mt-1 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  pathname.includes('transactions') && 'text-primary-700 bg-gray-100'
                }`}
              >
                Transactions
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
