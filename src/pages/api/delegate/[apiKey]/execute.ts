import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'types/common'
import { getProfileAddress } from 'contracts/keyManager'
import { supabase } from 'api/utils/supabase'
import { quota } from 'contracts/relayContractor'
import { web3 } from 'api/utils/web3'
import { executeTransaction } from 'api/common/execute'
import { getKeyManagerAddress } from 'contracts/profile'

type ServiceContract = {
  address: string
}

type RelayExecuteParameters = {
  address: string
  transaction: RelayTransactionParameters
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apiKey = req.query.apiKey as string
    const parameters = req.body as RelayExecuteParameters
    const profile = parameters.address
    const keyManager = await getKeyManagerAddress(web3, profile)

    const { data: payee, error: payeeError } = await supabase
      .from<definitions['services']>('services')
      .select('key_manager,contracts')
      .eq('api_key', apiKey)
      .single()
    if (!payee || payeeError) {
      console.error(payeeError?.message)
      return res.status(404).json({ error: 'Invalid request' })
    }

    const payeeKeyManager = payee.key_manager
    const payeeProfile = await getProfileAddress(web3, payeeKeyManager)
    const { remaining: remainingQuota } = await quota(web3, payeeProfile)
    if (remainingQuota.isZero()) {
      return res.status(401).json({ error: 'Insufficient funds' })
    }

    const contracts: ServiceContract[] = payee.contracts ? JSON.parse(payee.contracts) : []

    // if it is external call, verify api key approved contracts
    const executeSelector = web3.eth.abi
      .encodeFunctionSignature('execute(uint256,address,uint256,bytes)')
      .toLowerCase()
    if (parameters.transaction.abi.slice(0, 10).toLowerCase() === executeSelector) {
      const values = web3.eth.abi.decodeParameters(
        [
          { type: 'uint256', name: 'operation' },
          { type: 'address', name: 'to' },
          { type: 'uint256', name: 'value' },
          { type: 'bytes', name: 'data' }
        ],
        '0x' + parameters.transaction.abi.slice(10)
      )
      if (Number(values.operation) !== 0) {
        return res.status(401).json({ error: 'Invalid operation' })
      }
      const callingContract = values.to.toLowerCase()
      if (!contracts.find((contract) => contract.address === callingContract)) {
        return res.status(401).json({ error: 'Invalid contract' })
      }
    } else {
      // calling self, must be allowlisted
      if (!contracts.find((contract) => contract.address === profile.toLowerCase())) {
        return res.status(401).json({ error: 'Invalid contract' })
      }
    }

    const { transactionHash } = await executeTransaction({
      profile,
      payeeProfile,
      keyManager,
      ...parameters.transaction
    })

    return res.status(200).json({ transactionHash })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ error: 'Internal' })
  }
}

export default method('POST', handler)
