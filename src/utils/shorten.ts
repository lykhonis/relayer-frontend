export const shorten = (value: string, charsLength = 4) => {
  if (!value?.length || value.length < charsLength) {
    return value
  }
  return value.slice(0, charsLength) + '…' + value.slice(-charsLength)
}
