import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { method } from './middleware/method'
import { RelayTransactionParameters } from './types'

type RelayExecuteParameters = {
  keyManagerAddress: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body as RelayExecuteParameters
    const taskId = uuidv4()

    return res.status(200).json({
      success: true,
      taskId,
      ...data
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
