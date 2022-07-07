import { Fragment, ReactNode, RefObject, useRef, useState } from 'react'
import { Button, Chip } from '@apideck/components'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useProfile } from 'hooks/useProfile'
import { shortenAddress } from 'utils/shortenAddress'
import { findBestProfileImage } from 'utils/profileImage'
import { ipfsToHttp } from 'utils/ipfs'
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames'

export const Navbar = ({ children }: { children?: ReactNode }) => {
  const navbarNode = useRef() as RefObject<HTMLDivElement>
  const hamburgerNode = useRef() as RefObject<HTMLDivElement>
  const [navbarOpen, setNavbarOpen] = useState(false)
  const { pathname } = useRouter()
  const { profile, isLoading, requestProfile, removeProfile } = useProfile()
  const profileImage = findBestProfileImage({
    images: profile?.profileImage,
    minimumWidth: 32,
    minimumHeight: 32
  })
  return (
    <nav className={profile ? 'bg-white border-b-2 border-gray-100' : 'bg-gray-900'}>
      <div className="px-4 sm:px-6 lg:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-0">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <Link href="/">
                <a className="flex items-center mr-6">
                  <Image src="/img/logo.png" width={32} height={32} alt="logo" />
                </a>
              </Link>
            </div>
            {profile && (
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
            )}
          </div>
          <div>
            <div className="hidden sm:block">
              <div className="flex items-center ml-4 md:ml-6">
                {children}
                <Chip size="small" label={`Testnet L16`} className="whitespace-nowrap" />
                {!profile ? (
                  <Button
                    onClick={requestProfile}
                    isLoading={isLoading}
                    className="whitespace-nowrap ml-4"
                  >
                    Sign In
                  </Button>
                ) : (
                  <>
                    <Menu as="div" className="ml-4 relative flex-shrink-0">
                      <div>
                        <Menu.Button className="bg-white rounded-full flex text-sm ring-2 ring-white ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                          <span className="sr-only">Open user menu</span>
                          {profileImage ? (
                            <img
                              className="w-8 h-8 rounded-full"
                              src={ipfsToHttp(profileImage.url)}
                              alt=""
                            />
                          ) : profile.name ? (
                            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-500">
                              <span className="text-sm font-medium leading-none text-white">
                                {profile.name.slice(0, 1).toUpperCase()}
                              </span>
                            </span>
                          ) : (
                            <div className="whitespace-nowrap ml-4 text-sm font-medium">
                              {shortenAddress(profile.address ?? '')}
                            </div>
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right z-40 absolute -right-2 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item key="sign-out">
                            {({ active }) => (
                              <a
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={removeProfile}
                              >
                                Sign Out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                )}
              </div>
            </div>
          </div>
          {profile && (
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
          )}
        </div>
      </div>
      {profile && navbarOpen && (
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
