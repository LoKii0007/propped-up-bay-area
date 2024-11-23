import React, { useContext, useState } from "react";

export const GlobalContext = React.createContext()

export function GlobalContextProvider({children}){
    const [settingsActiveView, setSettingsActiveView] = useState("profileSettings")
    const [breadCrumb, setBreadCrumb] = useState('clients')
    const [isInfo, setIsInfo] = useState(false)
    const baseUrl = import.meta.env.VITE_BACKEND_URL
    const [activeView, setActiveView] = useState('dashboard')
    const [totalUserCount, setTotalUserCount] = useState(0)
    const [adminActiveView, setAdminActiveView] = useState("order requests")

    return(
        <GlobalContext.Provider value={{adminActiveView, setAdminActiveView, setSettingsActiveView, settingsActiveView, breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl, activeView, setActiveView, totalUserCount, setTotalUserCount}} >
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