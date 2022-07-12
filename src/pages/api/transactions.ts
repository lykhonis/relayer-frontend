import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from 'web3'
import { definitions } from 'types/supabase'
import { supabase } from 'api/utils/supabase'
import { method } from 'api/middleware/method'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyManager = req.query.keyManager as string
    const profile = req.query.profile as string
    const needCount = req.query.count === 'true'
    const query = supabase
      .from<definitions['tasks']>('tasks')
      .select('created_at,updated_at,status,transaction_hash,key_manager,profile', {
        count: needCount ? 'exact' : undefined
      })
    if (profile) {
      if (!Web3.utils.isAddress(profile)) {
        return res.status(400).json({ error: 'Invalid profile' })
      }
      query.eq('profile', profile.toLowerCase())
    } else if (keyManager) {
      if (!Web3.utils.isAddress(keyManager)) {
        return res.status(400).json({ error: 'Invalid keyManager' })
      }
      query.eq('key_manager', keyManager.toLowerCase())
    } else {
      return res.status(400).json({ error: 'Invalid request' })
    }
    const { data: transactions, error, count } = await query
    if (!transactions || error) {
      console.error(error?.message)
      return res.status(400).json({
        success: false,
        error: 'Invalid task'
      })
    }
    if (count) {
      return res.status(200).json({ count })
    } else {
      return res.status(200).json({ transactions })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      error: 'Internal'
    })
  }
}

export default method('GET', handler)
