import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'types/common'
import { quota } from 'contracts/relayContractor'
import { web3 } from 'api/utils/web3'
import { executeTransaction } from 'api/common/execute'
import { getKeyManagerAddress } from 'contracts/profile'
import { requestUserQuota, updateUserQuota } from 'api/common/users'

type RelayExecuteParameters = {
  address: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parameters = req.body as RelayExecuteParameters
    const profile = parameters.address
    const keyManager = await getKeyManagerAddress(web3, profile)

    // staking user
    {
      const { remaining: remainingQuota } = await quota(web3, profile)
      if (!remainingQuota.isZero()) {
        const { transactionHash } = await executeTransaction({
          profile,
          payeeProfile: profile,
          keyManager,
          ...parameters.transaction
        })
        return res.status(200).json({ transactionHash })
      }
    }

    // monthly free user
    {
      const { quota, totalQuota } = await requestUserQuota(profile)
      if (quota > 0) {
        await updateUserQuota(profile, totalQuota - (quota - 1))
        const { transactionHash } = await executeTransaction({
          profile,
          keyManager,
          ...parameters.transaction
        })
        return res.status(200).json({ transactionHash })
      }
    }

    return res.status(401).json({ error: 'Insufficient quota' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: 'Internal' })
  }
}

export default method('POST', handler)
