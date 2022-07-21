import UniversalProfile from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'
import { Contract } from 'web3-eth-contract'
import Web3 from 'web3'
import { ERC725 } from '@erc725/erc725.js'

export const getContract = (web3: Web3, profile: string | Contract) => {
  if (typeof profile === 'string') {
    return new web3.eth.Contract(UniversalProfile.abi as any, profile)
  }
  return profile
}

export const getKeyManagerAddress = async (web3: Web3, profile: string | Contract) => {
  const contract = getContract(web3, profile)
  return (await contract.methods.owner().call()) as string
}

export const getControllerPermissions = async (
  web3: Web3,
  profile: string | Contract,
  controller: string
) => {
  const contract = getContract(web3, profile)
  const permissionsData = await contract.methods['getData(bytes32)'](
    Web3.utils.keccak256('AddressPermissions').slice(0, 14) +
      Web3.utils.keccak256('Permissions').slice(2, 10) +
      '0000' +
      Web3.utils.stripHexPrefix(controller).slice(0, 40)
  ).call()
  const permissions = ERC725.decodePermissions(permissionsData)
  return permissions
}
