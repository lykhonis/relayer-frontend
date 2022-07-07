import { useContext } from 'react'
import { ProfileContext, ProfileContextProps } from 'providers/profile'

export const useProfile = () => useContext(ProfileContext) as ProfileContextProps
