import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { method } from 'api/middleware/method'
import { supabase } from 'api/utils/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const taskId = req.query.taskId as string
    const { data, error } = await supabase
      .from<definitions['tasks']>('tasks')
      .select('id,status,transaction_hash')
      .single()
    if (!data || error) {
      console.error(error?.message)
      return res.status(401).json({
        success: false,
        error: 'Invalid task'
      })
    }
    // TODO: oracles will observe pending tasks and update status
    // if (data.status === 'pending') {
    //   const receipt = await web3.eth.getTransactionReceipt(data.transaction_hash)
    //   if (receipt) {
    //     const { error } = await supabase
    //       .from<definitions['tasks']>('tasks')
    //       .update({ status: receipt.status ? 'completed' : 'failed' })
    //       .eq('id', data.id)
    //       .single()
    //     if (error) {
    //       console.error(error?.message)
    //       return res.status(400).json({
    //         success: false,
    //         error: 'Internal'
    //       })
    //     }
    //     return res.status(200).json({
    //       success: true,
    //       taskId,
    //       status: receipt.status ? 'COMPLETED' : 'FAILED'
    //     })
    //   }
    // }
    return res.status(200).json({
      success: true,
      taskId,
      status:
        data.status === 'failed'
          ? 'FAILED'
          : data.status === 'pending'
          ? 'PENDING'
          : data.status === 'completed'
          ? 'COMPLETED'
          : 'UNKNOWN'
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
