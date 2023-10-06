import React, { useState, createContext, useContext} from 'react'
import { Profile } from '../interfaces/ProfileInterface'

const ProfileContext = createContext<Profile>({
  name: '',
  setName: () => {},
  pfp: '',
  setPfp: () => {}
})

export const useProfileContext = () => useContext(ProfileContext)

interface Props {
  children: React.ReactNode
}

export const ProfileProvider: React.FC<Props> = ({children}) => {
  const [pfp, setPfp] = useState('')
  const [name, setName] = useState('')

  return (
    <ProfileContext.Provider
      value={{
        pfp, setPfp,
        name, setName
      }}
    >
      { children }
    </ProfileContext.Provider>
  )
}