import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from 'api/middleware/method'
import { requestUserQuota } from 'api/common/users'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const profile = req.query.address as string
    if (!profile) {
      return res.status(400).json({ error: 'Invalid request' })
    }
    const { quota, totalQuota } = await requestUserQuota(profile)
    return res.status(200).json({
      remaining: (100 * quota) / totalQuota,
      used: (100 * (totalQuota - quota)) / totalQuota
    })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: 'Internal' })
  }
}

export default method('GET', handler)
