import React, { useContext, useState } from "react";


export const GlobalContext = React.createContext()

export function GlobalContextProvider({children}){
    const [settingsActiveView, setSettingsActiveView] = useState("profileSettings")
    const [breadCrumb, setBreadCrumb] = useState('clients')
    const [isInfo, setIsInfo] = useState(false)

    return(
        <GlobalContext.Provider value={{setSettingsActiveView, settingsActiveView, breadCrumb, setBreadCrumb, isInfo, setIsInfo}} >
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