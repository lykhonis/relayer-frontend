import Footer from 'components/Footer'
import Layout from 'components/Layout'
import Loading from 'components/Loading'
import Navbar from 'components/Navbar'
import Transactions from 'components/Transactions'
import useProfile from 'hooks/useProfile'

const Page = () => {
  const { profile, isLoading } = useProfile()
  return (
    <Layout className="bg-white">
      <Navbar />
      {profile ? <Transactions /> : isLoading ? <Loading /> : <></>}
      <Footer />
    </Layout>
  )
}

export default Page
