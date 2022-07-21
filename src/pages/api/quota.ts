import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from 'api/middleware/method'
import Web3 from 'web3'
import { web3 } from 'api/utils/web3'
import { getControllerPermissions } from 'contracts/profile'
import { quota } from 'contracts/relayContractor'

// https://lukso.notion.site/lukso/Transaction-Relay-Service-API-Standard-2bda58f4f47f4497bb3381654acda8c3
// - Send UP address
// - Do not send message (hash)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authorization = new Map(
      (req.headers.authorization?.split(',')?.map((value) =>
        value
          .trim()
          .split('=')
          .map((value) => value.trim())
      ) ?? []) as Array<[string, string]>
    )

    const profile = authorization.get('address')
    const timestamp = Number(authorization.get('timestamp'))
    const signature = authorization.get('signature')

    if (!profile || !signature || Number.isNaN(timestamp)) {
      return res.status(400).json({ error: 'Invalid request' })
    }

    if (Math.abs(new Date().getTime() - timestamp) > 5000) {
      return res.status(401).json({ error: 'Request is too old' })
    }

    const hash = Web3.utils.sha3(profile + timestamp) as string
    const controller = web3.eth.accounts.recover(hash, signature)

    const permissions = await getControllerPermissions(web3, profile, controller)
    if (!permissions.SIGN) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const { used: usedQuota, remaining: remainingQuota } = await quota(web3, profile)

    return res.status(200).json({
      quota: Web3.utils.fromWei(remainingQuota),
      unit: 'lyx',
      totalQuota: Web3.utils.fromWei(remainingQuota.add(usedQuota))
      // resetDate
    })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: 'Internal' })
  }
}

export default method('GET', handler)
