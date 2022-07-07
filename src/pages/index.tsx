import Overview from 'components/Overview'
import Layout from 'components/Layout'
import Navbar from 'components/Navbar'
import { useProfile } from 'hooks/useProfile'
import Landing from 'components/Landing'

const Page = () => {
  const { profile } = useProfile()
  return (
    <Layout className="bg-white">
      <Navbar />
      {profile ? <Overview /> : <Landing />}
    </Layout>
  )
}

export default Page
