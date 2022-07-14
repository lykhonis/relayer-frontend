import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { v4 as uuidv4 } from 'uuid'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'types/common'
import { getProfileAddress } from 'contracts/keyManager'
import { supabase } from 'api/utils/supabase'
import { executeRelayCall, quota } from 'contracts/relayContractor'
import { web3 } from 'api/utils/web3'

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
    const { transactionHash } = await executeRelayCall({
      web3,
      keyManager: parameters.keyManagerAddress,
      ...parameters.transaction
    })
    const { error } = await supabase
      .from<definitions['tasks']>('tasks')
      .insert({
        uuid: taskId,
        status: 'pending',
        transaction_hash: transactionHash.toLowerCase(),
        key_manager: parameters.keyManagerAddress.toLowerCase(),
        profile: profile.toLowerCase()
      })
      .single()
    if (error) {
      console.error(error?.message)
      return res.status(400).json({
        success: false,
        error: 'Internal'
      })
    } else {
      return res.status(200).json({
        success: true,
        taskId,
        ...parameters
      })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      success: false,
      error: 'Internal'
    })
  }
}

export default method('POST', handler)
