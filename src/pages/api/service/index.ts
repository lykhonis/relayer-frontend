import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { supabase } from 'api/utils/supabase'
import { method } from 'api/middleware/method'
import { sanitize } from 'utils/sanitize'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyManager = req.query.keyManager as string
    const { data, error } = await supabase
      .from<definitions['services']>('services')
      .select('*')
      .eq('key_manager', keyManager.toLowerCase())
      .single()
    if (!data || error) {
      console.error(error?.message)
      return res.status(404).json({ error: 'Invalid request' })
    }
    return res.status(200).json(sanitize(data))
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      error: 'Internal'
    })
  }
}

export default method('GET', handler)
