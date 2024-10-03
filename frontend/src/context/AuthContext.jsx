
import React,  { useState } from "react"

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  return (
    <AuthContext.Provider value={{currentUser, setCurrentUser, loading, setLoading, userLoggedIn, setUserLoggedIn}}>
      {children}
    </AuthContext.Provider>
  )
}
