import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { method } from 'api/middleware/method'
import { supabase } from 'api/utils/supabase'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const taskId = req.query.taskId as string
    const { data, error } = await supabase
      .from<definitions['tasks']>('tasks')
      .select('id,status')
      .eq('uuid', taskId)
      .single()
    if (!data || error) {
      console.error(error?.message)
      return res.status(401).json({
        success: false,
        error: 'Invalid task'
      })
    }
    return res.status(200).json({
      success: true,
      taskId,
      status: data.status.toUpperCase()
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
