import type { NextApiRequest, NextApiResponse } from 'next'
import Web3 from 'web3'
import { definitions } from 'types/supabase'
import { supabase } from 'api/utils/supabase'
import { method } from 'api/middleware/method'
import { sanitize } from 'utils/sanitize'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyManager = req.query.keyManager as string
    const profile = req.query.profile as string
    const needCount = req.query.count === 'true'
    const page = Number(req.query.page ?? 0)
    const pageCount = 10
    const query = supabase
      .from<definitions['tasks']>('tasks')
      .select('created_at,updated_at,status,transaction_hash,key_manager,profile', {
        count: needCount ? 'exact' : undefined
      })
      .order('created_at', { ascending: false })
    if (!needCount) {
      query.range(page * pageCount, Math.max(0, (page + 1) * pageCount - 1))
    }
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
    if (needCount) {
      return res.status(200).json({ count })
    } else {
      return res.status(200).json({
        page,
        pageCount,
        transactions: sanitize(transactions)
      })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      error: 'Internal'
    })
  }
}

export default method('GET', handler)
