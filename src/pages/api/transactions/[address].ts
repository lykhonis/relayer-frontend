import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { supabase } from 'api/utils/supabase'
import { method } from 'api/middleware/method'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const address = req.query.address as string
    const { data, error } = await supabase
      .from<definitions['tasks']>('tasks')
      .select('status,transaction_hash')
      .eq('key_manager', address?.toLowerCase())
    if (!data || error) {
      console.error(error?.message)
      return res.status(401).json({
        success: false,
        error: 'Invalid task'
      })
    }
    return res.status(200).json({
      success: true,
      transactions: data
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
