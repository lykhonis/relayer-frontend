import Web3 from 'web3'

export const web3: Web3 = (() => {
  const web3 = new Web3(process.env.NEXT_PUBLIC_NETWORK_RPC_ENDPOINT as string)
  const relayerAccount = web3.eth.accounts.wallet.add(process.env.RELAYER_ACCOUNT as string)
  web3.eth.defaultAccount = relayerAccount.address
  return web3
})()
