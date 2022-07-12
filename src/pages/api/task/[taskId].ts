import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from '../middleware/method'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const taskId = req.query.taskId as string
    return res.status(200).json({
      success: true,
      taskId,
      status: 'COMPLETE'
    })
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      success: false,
      error: 'Internal'
    })
  }
}

export default method('GET', handler)
