import Web3 from 'web3'

export const getNetworkName = async (web3: Web3) => {
  const chainId = await web3.eth.getChainId()
  switch (chainId) {
    case 2828:
      return 'Testnet L16'
  }
}
