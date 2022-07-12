import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { v4 as uuidv4 } from 'uuid'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'api/types'
import { executeRelayCall } from 'api/utils/keyManager'
import { supabase } from 'api/utils/supabase'

type RelayExecuteParameters = {
  keyManagerAddress: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parameters = req.body as RelayExecuteParameters
    const taskId = uuidv4()
    const { transactionHash } = await executeRelayCall({
      keyManager: parameters.keyManagerAddress,
      ...parameters.transaction
    })
    const { error } = await supabase
      .from<definitions['tasks']>('tasks')
      .insert({
        uuid: taskId,
        status: 'pending',
        transaction_hash: transactionHash.toLowerCase(),
        key_manager: parameters.keyManagerAddress.toLowerCase()
      })
      .single()
    if (error) {
      console.error(error?.message)
      return res.status(401).json({
        success: false,
        error: error.message
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
