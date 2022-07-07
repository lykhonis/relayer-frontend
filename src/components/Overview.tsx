import { useProfile } from 'hooks/useProfile'
import { findBestProfileImage } from 'utils/profileImage'
import { ipfsToHttp } from 'utils/ipfs'
import { Button } from '@apideck/components'
import { useCallback } from 'react'
import { useRouter } from 'next/router'

const Deposit = () => {
  const router = useRouter()
  const { profile } = useProfile()
  const profileImage = findBestProfileImage({
    images: profile?.profileImage,
    minimumWidth: 120,
    minimumHeight: 120
  })
  const coverImage = findBestProfileImage({
    images: profile?.backgroundImage,
    minimumWidth: 250,
    minimumHeight: 250
  })
  const handleDeposit = useCallback(() => router.push('/deposit'), [router])
  return (
    <div className="max-w-3xl mx-auto px-4 mt-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <section aria-labelledby="section-1-title">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <div className="pb-6">
                <div>
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
                      <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                        <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                          <h1 className="text-2xl font-bold text-gray-900 truncate">
                            {profile?.name ?? ''}
                          </h1>
                        </div>
                        <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                          <Button className="whitespace-nowrap" onClick={handleDeposit}>
                            Deposit
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 truncate">
                        {profile?.name ?? ''}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <section aria-labelledby="section-2-title">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <div className="p-6"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Deposit
