import type { NextApiRequest, NextApiResponse } from 'next'
import { method } from 'api/middleware/method'
import Web3 from 'web3'
import { web3 } from 'api/utils/web3'
import { getControllerPermissions } from 'contracts/profile'
import { quota } from 'contracts/relayContractor'
import { supabase } from 'api/utils/supabase'
import { definitions } from 'types/supabase'
import { getProfileAddress } from 'contracts/keyManager'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apiKey = req.query.apiKey as string
    const profile = req.body.address
    const timestamp = Number(req.body.timestamp)
    const signature = req.body.signature

    if (!profile || !signature || Number.isNaN(timestamp)) {
      return res.status(400).json({ error: 'Invalid request' })
    }

    if (Math.abs(new Date().getTime() - timestamp) > 5000) {
      return res.status(401).json({ error: 'Request is too old' })
    }

    const { data: payee, error: payeeError } = await supabase
      .from<definitions['services']>('services')
      .select('key_manager')
      .eq('api_key', apiKey)
      .single()
    if (!payee || payeeError) {
      console.error(payeeError?.message)
      return res.status(404).json({ error: 'Invalid request' })
    }

    const payeeKeyManager = payee.key_manager
    const payeeProfile = await getProfileAddress(web3, payeeKeyManager)

    const hash = Web3.utils.sha3(profile + timestamp) as string
    const controller = web3.eth.accounts.recover(hash, signature)

    const permissions = await getControllerPermissions(web3, profile, controller)
    if (!permissions.SIGN) {
      return res.status(401).json({ error: 'Invalid signature' })
    }

    const { used: usedQuota, remaining: remainingQuota } = await quota(web3, payeeProfile)

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

export default method('POST', handler)
