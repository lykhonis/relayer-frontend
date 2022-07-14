import ProfileDetails from './ProfileDetails'
import ProfileQuota from './ProfileQuota'
import ProfileStats from './ProfileStats'

const Overview = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 my-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <ProfileDetails />
        <ProfileQuota />
      </div>
      <div className="mt-4">
        <ProfileStats />
      </div>
    </div>
  )
}

export default Overview
