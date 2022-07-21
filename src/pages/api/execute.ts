import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'types/common'
import { getProfileAddress } from 'contracts/keyManager'
import { quota } from 'contracts/relayContractor'
import { web3 } from 'api/utils/web3'
import { executeTransaction } from 'api/common/execute'

type RelayExecuteParameters = {
  keyManagerAddress: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parameters = req.body as RelayExecuteParameters
    const taskId = uuidv4()

    const profile = await getProfileAddress(web3, parameters.keyManagerAddress)
    const { remaining: remainingQuota } = await quota(web3, profile)
    if (remainingQuota.isZero()) {
      return res.status(401).json({
        success: false,
        error: 'Insufficient funds'
      })
    }

    await executeTransaction({
      taskId,
      profile,
      payeeProfile: profile,
      keyManager: parameters.keyManagerAddress,
      ...parameters.transaction
    })

    return res.status(200).json({
      success: true,
      taskId,
      ...parameters
    })
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      success: false,
      error: 'Internal'
    })
  }
}

export default method('POST', handler)
