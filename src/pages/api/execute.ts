import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'types/common'
import { quota } from 'contracts/relayContractor'
import { web3 } from 'api/utils/web3'
import { executeTransaction } from 'api/common/execute'
import { getKeyManagerAddress } from 'contracts/profile'

type RelayExecuteParameters = {
  address: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parameters = req.body as RelayExecuteParameters
    const profile = parameters.address
    const keyManager = await getKeyManagerAddress(web3, profile)
    const { remaining: remainingQuota } = await quota(web3, profile)
    if (remainingQuota.isZero()) {
      return res.status(401).json({ error: 'Insufficient funds' })
    }

    const { transactionHash } = await executeTransaction({
      profile,
      payeeProfile: profile,
      keyManager,
      ...parameters.transaction
    })

    return res.status(200).json({ transactionHash })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: 'Internal' })
  }
}

export default method('POST', handler)
