import Overview from 'components/Overview'
import Layout from 'components/Layout'
import Navbar from 'components/Navbar'
import useProfile from 'hooks/useProfile'
import Landing from 'components/Landing'
import Footer from 'components/Footer'
import Loading from 'components/Loading'

const Page = () => {
  const { profile, isLoading } = useProfile()
  return (
    <Layout className="bg-white">
      <Navbar />
      {profile ? <Overview /> : isLoading ? <Loading /> : <Landing />}
      <Footer />
    </Layout>
  )
}

export default Page
