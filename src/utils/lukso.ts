import Web3 from 'web3'

export const configureRelayerService = async (
  web3: Web3,
  {
    chainIds,
    serviceKey
  }: {
    chainIds?: number[]
    serviceKey?: string
  } = {}
) => {
  const baseUrl = 'https://relayer-frontend.vercel.app'
  const provider = web3.currentProvider as any
  const relayerChainIds = chainIds ?? []
  if (!chainIds) {
    const chainId = await web3.eth.getChainId()
    relayerChainIds.push(chainId)
  }
  const relayer = {
    name: 'Wise Relayer',
    apiUrl: serviceKey ? `${baseUrl}/api/delegate/${serviceKey}/` : `${baseUrl}/api/`,
    chainIds: relayerChainIds
  }
  await provider.request({
    jsonrpc: '2.0',
    method: 'up_addRelayService',
    params: [relayer]
  })
}
