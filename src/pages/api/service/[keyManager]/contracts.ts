import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { supabase } from 'api/utils/supabase'
import { method } from 'api/middleware/method'
import { sanitize } from 'utils/sanitize'
import Web3 from 'web3'
import { Messages } from 'utils/constants'
import { getProfileAddress } from 'contracts/keyManager'
import { getControllerPermissions } from 'contracts/profile'
import { web3 } from 'api/utils/web3'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyManager = req.query.keyManager as string
    const { salt, signature, contracts } = req.body
    const hash = Web3.utils.sha3(keyManager + JSON.stringify(contracts) + salt) as string
    const controller = web3.eth.accounts.recover(
      Messages.Request.ApproveServiceContract(hash),
      signature
    )
    const profile = await getProfileAddress(web3, keyManager)
    const permissions = await getControllerPermissions(web3, profile, controller)
    if (!permissions.SIGN) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
    console.log(contracts)
    const { data, error } = await supabase
      .from<definitions['services']>('services')
      .upsert(
        {
          key_manager: keyManager.toLowerCase(),
          contracts: JSON.stringify(contracts)
        },
        { onConflict: 'key_manager' }
      )
      .single()
    if (!data || error) {
      console.error(error?.message)
      return res.status(400).json({ error: 'Invalid key' })
    }
    return res.status(200).json(sanitize(data))
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      error: 'Internal'
    })
  }
}

export default method('POST', handler)
