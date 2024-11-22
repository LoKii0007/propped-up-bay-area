import React, { useContext, useState } from "react";

export const GlobalContext = React.createContext()

export function GlobalContextProvider({children}){
    const [settingsActiveView, setSettingsActiveView] = useState("profileSettings")
    const [breadCrumb, setBreadCrumb] = useState('clients')
    const [isInfo, setIsInfo] = useState(false)
    const baseUrl = import.meta.env.VITE_BACKEND_URL
    const [activeView, setActiveView] = useState('dashboard')

    return(
        <GlobalContext.Provider value={{setSettingsActiveView, settingsActiveView, breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl, activeView, setActiveView}} >
           {children}
        </GlobalContext.Provider>
    )
}

export const useGlobal = () => {
    const context = useContext(GlobalContext)
    if(!context) {
        throw new Error('UseGlobal must be used within a GlobalContextProvider')
    }
    return context
}