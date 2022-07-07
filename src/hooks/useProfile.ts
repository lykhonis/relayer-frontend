import { useContext } from 'react'
import { ProfileContext } from 'providers/profile'

const useProfile = () => useContext(ProfileContext)

export default useProfile
