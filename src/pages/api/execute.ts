import type { NextApiRequest, NextApiResponse } from 'next'
import { definitions } from 'types/supabase'
import { v4 as uuidv4 } from 'uuid'
import { method } from 'api/middleware/method'
import { RelayTransactionParameters } from 'types/common'
import { executeRelayCall, getProfileAddress } from 'contracts/keyManager'
import { supabase } from 'api/utils/supabase'
import { quota } from 'contracts/relayContractor'
import { web3 } from 'api/utils/web3'
import Web3 from 'web3'

type RelayExecuteParameters = {
  keyManagerAddress: string
  transaction: RelayTransactionParameters
}

const submitTransaction = async (profile: string, transactionHash: string) => {
  const data = { profile, transactionHash }
  const hash = Web3.utils.soliditySha3(JSON.stringify(data)) as string
  const signature = await web3.eth.sign(hash, web3.eth.defaultAccount as string)
  const url = `${process.env.ORACLES_URL}/transaction`
  console.log(`Submitting to ${url}`)
  const response = await fetch(url, {
    method: 'put',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Type': 'application/json'
    },
    body: JSON.stringify({ data, signature })
  })
  if (!response.ok) {
    const data = await response.json()
    console.error(`Failed to submit transaction: ${data?.error}`)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const parameters = req.body as RelayExecuteParameters
    const taskId = uuidv4()
    const profile = await getProfileAddress(web3, parameters.keyManagerAddress)
    const { remaining: remainingQuota } = await quota(web3, profile)
    if (remainingQuota.isZero()) {
      return res.status(401).json({
        success: false,
        error: 'Insufficient funds'
      })
    }
    const { transactionHash, send: sendRelayCallTx } = await executeRelayCall({
      web3,
      keyManager: parameters.keyManagerAddress,
      ...parameters.transaction
    })
    console.log(`processing relay: ${transactionHash}`)
    const { error } = await supabase
      .from<definitions['tasks']>('tasks')
      .insert({
        uuid: taskId,
        status: 'pending',
        transaction_hash: transactionHash.toLowerCase(),
        key_manager: parameters.keyManagerAddress.toLowerCase(),
        profile: profile.toLowerCase()
      })
      .single()
    if (error) {
      console.error(error?.message)
      return res.status(400).json({
        success: false,
        error: 'Internal'
      })
    } else {
      const markTransactionFailed = async () => {
        // mark tx failed
        await supabase
          .from<definitions['tasks']>('tasks')
          .update({ status: 'failed' })
          .eq('transaction_hash', transactionHash.toLowerCase())
      }

      const executeRelay = async () => {
        try {
          console.log(`sending relay: ${transactionHash}`)
          await sendRelayCallTx()
        } catch (e) {
          console.error(e)
          await markTransactionFailed()
        }
      }

      console.log(`submitting transaction: ${transactionHash}`)
      await submitTransaction(profile, transactionHash)

      executeRelay()

      return res.status(200).json({
        success: true,
        taskId,
        ...parameters
      })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({
      success: false,
      error: 'Internal'
    })
  }
}

export default method('POST', handler)
