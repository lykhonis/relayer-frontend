import Deposit from './Deposit'
import DepositStats from './DepositStats'

const Deposits = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 my-8 sm:px-6 lg:max-w-7xl lg:px-8">
      <Deposit />
      <div className="mt-4">
        <DepositStats />
      </div>
    </div>
  )
}

export default Deposits
