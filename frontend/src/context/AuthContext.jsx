
import React,  { useContext, useState } from "react"
import toast from "react-hot-toast"

export const AuthContext = React.createContext()

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [admin, setAdmin] = useState(null)

  return (
    <AuthContext.Provider value={{currentUser, setCurrentUser, loading, setLoading, userLoggedIn, setUserLoggedIn, admin, setAdmin}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=>{
  const context = useContext(AuthContext)
  if(!context){
    toast.error('somethinng went wrong')
    return
  }
  return context
}
