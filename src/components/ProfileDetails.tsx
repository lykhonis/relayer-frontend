import useProfile from 'hooks/useProfile'
import { findBestProfileImage } from 'utils/profileImage'
import { ipfsToHttp } from 'utils/ipfs'
import { Button } from '@apideck/components'
import { useRouter } from 'next/router'
import { shortenHex } from 'utils/shortenHex'
import { useClipboard } from 'use-clipboard-copy'
import { useToast } from '@apideck/components'
import { useCallback } from 'react'

const ProfileDetails = () => {
  const router = useRouter()
  const { profile } = useProfile()
  const profileImage = findBestProfileImage({
    images: profile?.profileImage,
    minimumWidth: 120
  })
  const coverImage = findBestProfileImage({
    images: profile?.backgroundImage,
    minimumWidth: 250
  })
  const { addToast } = useToast()
  const clipboard = useClipboard()
  const handleCopyAddress = useCallback(() => {
    if (clipboard && profile?.address) {
      clipboard.copy(profile.address)
      addToast({ title: 'Copied', type: 'success' })
    }
  }, [profile?.address, clipboard, addToast])
  return (
    <div className="pb-4">
      <div>
        <img
          className="h-32 w-full object-cover lg:h-48"
          src={ipfsToHttp(coverImage?.url ?? '')}
          alt=""
        />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img
              className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
              src={ipfsToHttp(profileImage?.url ?? '')}
              alt=""
            />
          </div>
          {profile?.address && (
            <div className="flex text-md text-gray-500 items-center gap-1 mt-4 md:text-xl md:mt-0">
              {shortenHex(profile?.address, 8)}
              <a className="ml-1 cursor-pointer" onClick={handleCopyAddress}>
                <svg
                  className="h-5 w-5 md:h-6 md:w-6 text-gray-500 hover:text-gray-900"
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
          )}
          <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{profile?.name ?? ''}</h1>
            </div>
            <div className="mt-4 sm:mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button className="whitespace-nowrap" onClick={() => router.push('/deposit')}>
                Increase Quota
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 truncate">{profile?.name ?? ''}</h1>
          <p className="text-gray-500 truncate">{profile?.description ?? ''}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileDetails
