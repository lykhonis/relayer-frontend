import Debug from 'components/Debug'
import Footer from 'components/Footer'
import Layout from 'components/Layout'
import Navbar from 'components/Navbar'

const Page = () => {
  return (
    <Layout className="bg-white">
      <Navbar />
      <Debug />
      <Footer />
    </Layout>
  )
}

export default Page
