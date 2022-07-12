// type RelayCall = {
//   keyManager: string
//   profile: string
//   controller: string
//   transaction: {
//     nonce: string
//     data: string
//     signature: string
//   }
// }

// export const decodeRelayCall = async (data: string): Promise<RelayCall> => {
//   // verify selector
//   const selector = Web3.eth.abi
//     .encodeFunctionSignature('executeRelayCall(address,uint256,bytes,bytes)')
//     .toLowerCase()
//   if (data.slice(0, 10) !== selector) {
//     throw new Error(`Selector mismatch: ${selector}`)
//   }

//   // resolve data
//   const values = web3.eth.abi.decodeParameters(
//     [
//       { type: 'address', name: 'owner' },
//       { type: 'uint256', name: 'nonce' },
//       { type: 'bytes', name: 'data' },
//       { type: 'bytes', name: 'signature' }
//     ],
//     '0x' + data.slice(10)
//   )

//   // resolve key manager and profile
//   const keyManagerContract = new web3.eth.Contract(KeyManager.abi as any, values.owner)
//   const profile = await keyManagerContract.methods.account().call()
//   const profileContract = new web3.eth.Contract(UniversalProfile.abi as any, profile)

//   // resolve controller
//   const hash = web3.utils.soliditySha3(
//     { type: 'address', value: values.owner },
//     { type: 'uint256', value: values.nonce },
//     { type: 'bytes', value: values.data }
//   ) as string
//   const controller = web3.eth.accounts.recover(hash, values.signature)

//   return {
//     profile,
//     controller,
//     keyManager: values.owner,
//     transaction: {
//       data: values.data,
//       signature: values.signature,
//       nonce: values.nonce
//     }
//   }
// }
