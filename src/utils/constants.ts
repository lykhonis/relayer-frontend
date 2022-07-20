export const Lukso = {
  ipfs: {
    gateway: 'https://2eff.lukso.dev/ipfs/'
  }
}

export const Messages = {
  Request: {
    GenerateKey: (hash: string) =>
      `Sign this message to generate new key for your product.\n${hash}`,
    ApproveServiceContract: (hash: string) =>
      `Sign this message to approve contract for your service.\n${hash}`
  }
}
