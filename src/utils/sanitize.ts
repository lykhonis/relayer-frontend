const disallowed = new Set(['id'])

const snakeCasePattern = /(_[a-z])/g

const snakeToCamel = (value: string) => {
  if (snakeCasePattern.test(value)) {
    return value.replace(snakeCasePattern, (group) => group.toUpperCase().replace('_', ''))
  } else {
    return value
  }
}

const sanitizeObject = (data: any): any =>
  Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => !disallowed.has(key))
      .map(([key, value]) => [snakeToCamel(key), sanitize(value)])
  )

export const sanitize = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(sanitize)
  } else if (typeof data === 'object' && data !== null) {
    return sanitizeObject(data)
  } else {
    return data
  }
}
