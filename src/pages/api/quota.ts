import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from 'api/middleware/method'
import Web3 from 'web3'
import { web3 } from 'api/utils/web3'
import { getControllerPermissions } from 'contracts/profile'
import { requestUserQuota } from 'api/common/users'
import { quota } from 'contracts/relayContractor'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const profile = req.body.address as string
    const timestamp = Number(req.body.timestamp)
    const signature = req.body.signature as string

    if (!profile || !signature || Number.isNaN(timestamp)) {
      return res.status(400).json({ error: 'Invalid request' })
    }

    if (Math.abs(new Date().getTime() - timestamp) > 5000) {
      return res.status(400).json({ error: 'Invalid request' })
    }

    const hash = Web3.utils.sha3(profile + timestamp) as string
    const controller = web3.eth.accounts.recover(hash, signature)

    const permissions = await getControllerPermissions(web3, profile, controller)
    if (!permissions.SIGN) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    // poll quota rewards based
    {
      const { used: usedQuota, remaining: remainingQuota } = await quota(web3, profile)
      if (!remainingQuota.isZero()) {
        return res.status(200).json({
          quota: Web3.utils.fromWei(remainingQuota),
          unit: 'lyx',
          totalQuota: Web3.utils.fromWei(remainingQuota.add(usedQuota))
        })
      }
    }

    // poll user's quota
    {
      const { quota, totalQuota, resetDate } = await requestUserQuota(profile)
      return res.status(200).json({
        quota,
        unit: 'transactionCount',
        totalQuota,
        resetDate
      })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: 'Internal' })
  }
}

export default method('POST', handler)
