import { web3 } from 'api/utils/web3'
import { executeRelayCall } from 'contracts/keyManager'
import { supabase } from 'api/utils/supabase'
import Web3 from 'web3'
import { definitions } from 'types/supabase'

export const submitTransaction = async (profile: string | undefined, transactionHash: string) => {
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

export const executeTransaction = async ({
  keyManager,
  profile,
  abi,
  signature,
  nonce,
  payeeProfile
}: {
  keyManager: string
  profile: string
  abi: string
  signature: string
  nonce: number
  payeeProfile?: string
}) => {
  const { transactionHash, send: sendRelayCallTx } = await executeRelayCall({
    web3,
    keyManager,
    abi,
    nonce,
    signature
  })
  console.log(`processing relay: ${transactionHash}`)
  const { error } = await supabase
    .from<definitions['tasks']>('tasks')
    .insert({
      status: 'pending',
      transaction_hash: transactionHash.toLowerCase(),
      key_manager: keyManager.toLowerCase(),
      profile: profile.toLowerCase()
    })
    .single()
  if (error) {
    throw new Error(error?.message ?? 'Internal')
  }
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
  await submitTransaction(payeeProfile, transactionHash)

  executeRelay()
  return { transactionHash }
}
