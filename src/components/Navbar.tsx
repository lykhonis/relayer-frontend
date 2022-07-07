import { Fragment, ReactNode, RefObject, useCallback, useRef, useState } from 'react'
import { Button, Chip } from '@apideck/components'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useProfile from 'hooks/useProfile'
import useNetwork from 'hooks/useNetwork'
import { shortenAddress } from 'utils/shortenAddress'
import { findBestProfileImage } from 'utils/profileImage'
import { ipfsToHttp } from 'utils/ipfs'
import { Transition, Popover } from '@headlessui/react'
import { useClipboard } from 'use-clipboard-copy'
import { useToast } from '@apideck/components'

export const Navbar = ({ children }: { children?: ReactNode }) => {
  const navbarNode = useRef() as RefObject<HTMLDivElement>
  const hamburgerNode = useRef() as RefObject<HTMLDivElement>
  const [navbarOpen, setNavbarOpen] = useState(false)
  const router = useRouter()
  const { profile, isLoading, requestProfile, removeProfile } = useProfile()
  const profileImage = findBestProfileImage({
    images: profile?.profileImage,
    minimumWidth: 32,
    minimumHeight: 32
  })
  const { addToast } = useToast()
  const { name: networkName } = useNetwork()
  const clipboard = useClipboard()
  const handleCopyAddress = useCallback(() => {
    if (clipboard && profile?.address) {
      clipboard.copy(profile.address)
      addToast({ title: 'Copied', type: 'success' })
    }
  }, [profile?.address, clipboard, addToast])
  return (
    <nav className={profile || isLoading ? 'bg-white border-b-2 border-gray-100' : 'bg-gray-900'}>
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
                        router.pathname.includes('/deposit') && 'text-primary-700 bg-gray-100'
                      }`}
                    >
                      Deposit
                    </a>
                  </Link>
                  <Link href={`/transactions`}>
                    <a
                      className={`px-3 py-2 mr-4 text-sm font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                        router.pathname.includes('/transactions') && 'text-primary-700 bg-gray-100'
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
                <Chip
                  size="small"
                  label={networkName ?? ''}
                  className="whitespace-nowrap bg-gray-100 text-gray-600"
                  colorClassName="gray"
                />
                {!profile ? (
                  <Button
                    onClick={requestProfile}
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="whitespace-nowrap ml-4"
                  >
                    Sign In
                  </Button>
                ) : (
                  <Popover as="div" className="ml-4 relative flex-shrink-0">
                    <Popover.Button className="mr-8 bg-white rounded-full flex text-sm focus:outline-none">
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
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Popover.Panel className="origin-top-right z-40 absolute right-8 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="relative rounded-lg bg-white p-4 shadow-sm flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full"
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
                              <></>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {profile?.name ?? ''}
                            </p>
                            <div className="flex flex-row">
                              <p className="text-sm text-gray-500 truncate">
                                {shortenAddress(profile?.address ?? '')}
                              </p>
                              <a className="ml-1" onClick={handleCopyAddress}>
                                <svg
                                  className="h-5 w-5 text-gray-500 hover:text-gray-900"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  strokeWidth="2"
                                  stroke="currentColor"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path stroke="none" d="M0 0h24v24H0z" />
                                  <rect x="8" y="8" width="12" height="12" rx="2" />
                                  <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                        <div className="inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="rounded-lg overflow-hidden">
                          <div className="relative grid gap-8 bg-white p-4">
                            <a
                              className="-m-3 p-3 flex items-start cursor-pointer rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                              onClick={() => {
                                router.replace('/')
                                removeProfile?.()
                              }}
                            >
                              Sign Out
                            </a>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                )}
              </div>
            </div>
          </div>
          {profile && (
            <div className="flex -mr-2 sm:hidden" ref={hamburgerNode}>
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
                  router.pathname.includes('/deposit') && 'text-primary-700 bg-gray-100'
                }`}
              >
                Deposit
              </a>
            </Link>
            <Link href={`/transactions`}>
              <a
                className={`block px-3 py-2 mt-1 text-base font-semibold text-gray-900 rounded-md hover:text-primary-700 hover:bg-gray-100 focus:outline-none focus:text-primary-700 focus:bg-gray-100 ${
                  router.pathname.includes('transactions') && 'text-primary-700 bg-gray-100'
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
