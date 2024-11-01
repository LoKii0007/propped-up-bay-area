import React, { useContext, useState } from "react";


export const GlobalContext = React.createContext()

export function GlobalContextProvider({children}){
    const [settingsActiveView, setSettingsActiveView] = useState("profileSettings")
    const [breadCrumb, setBreadCrumb] = useState('clients')
    const [isInfo, setIsInfo] = useState(false)
    const baseUrl = 'http://localhost:5000'
    // const baseUrl = 'https://propped-up-backend.vercel.app'

    return(
        <GlobalContext.Provider value={{setSettingsActiveView, settingsActiveView, breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl}} >
           {children}
        </GlobalContext.Provider>
    )
}

export const UseGlobal=()=>{
    const context = useContext(GlobalContext)
    if(!context) {
        return(
            <>something went wrong!</>
        )
    }
    return context
}