import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { method } from 'api/middleware/method'
import { supabase } from 'api/utils/supabase'
import { web3 } from 'api/utils/web3'
import Web3 from 'web3'
import { getProfileAddress } from 'contracts/keyManager'
import { Messages } from 'utils/constants'
import { sanitize } from 'utils/sanitize'
import { getControllerPermissions } from 'contracts/profile'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const keyManager = req.query.keyManager as string
    const { salt, signature } = req.body
    const hash = Web3.utils.soliditySha3(keyManager, salt) as string
    const controller = web3.eth.accounts.recover(Messages.Request.GenerateKey(hash), signature)
    const profile = await getProfileAddress(web3, keyManager)
    const permissions = await getControllerPermissions(web3, profile, controller)
    if (!permissions.SIGN) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
    const apiKey = Web3.utils.stripHexPrefix(Web3.utils.randomHex(20))
    const { data, error } = await supabase
      .from<definitions['services']>('services')
      .upsert(
        {
          key_manager: keyManager.toLowerCase(),
          api_key: apiKey
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

export default method('PUT', handler)
