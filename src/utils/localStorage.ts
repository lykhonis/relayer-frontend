export const getItem = (name: string) => {
  if (typeof window !== 'undefined') return window.localStorage.getItem(name)
}

export const setItem = (name: string, value: any) => {
  if (typeof window !== 'undefined') return window.localStorage.setItem(name, value)
}

export const removeItem = (name: string) => {
  if (typeof window !== 'undefined') return window.localStorage.removeItem(name)
}
