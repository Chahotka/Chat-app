import React, { useState, createContext, useContext} from 'react'
import { Auth } from '../interfaces/AuthInterface'

const AuthContext = createContext<Auth>({
  auth: false,
  setAuth: () => {}
})

export const useAuthContext = () => useContext(AuthContext)

interface Props {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({children}) => {
  const [auth, setAuth] = useState<boolean>(false)

  return (
    <AuthContext.Provider
      value={{auth, setAuth}}
    >
      { children }
    </AuthContext.Provider>
  )
}