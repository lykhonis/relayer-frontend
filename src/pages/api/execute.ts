import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { v4 as uuidv4 } from 'uuid'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'api/types'
import { executeRelayCall, getProfileAddress } from 'api/utils/keyManager'
import { supabase } from 'api/utils/supabase'

type RelayExecuteParameters = {
  keyManagerAddress: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parameters = req.body as RelayExecuteParameters
    // const taskId = '149c1b23-e85b-4f51-a314-34c2bec71770'
    // const transactionHash = '0x060609fc3bf2d56b4fae7081d74615506228ae916f5ca79798e33106e887402e'
    // const profile = '0x506Fb98634903CaaC59E2e02b955E13CaC0E3cBF'
    const taskId = uuidv4()
    const { transactionHash } = await executeRelayCall({
      keyManager: parameters.keyManagerAddress,
      ...parameters.transaction
    })
    const profile = await getProfileAddress(parameters.keyManagerAddress)
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
      return res.status(401).json({
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
