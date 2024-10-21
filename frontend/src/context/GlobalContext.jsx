import React, { useContext, useState } from "react";


export const GlobalContext = React.createContext()

export function GlobalContextProvider({children}){
    const [activeView, setActiveView] = useState("clients")
    const [prevView, setPrevView] = useState('clients')
    const [breadCrumb, setBreadCrumb] = useState('clients')
    const [isInfo, setIsInfo] = useState(false)

    return(
        <GlobalContext.Provider value={{activeView, setActiveView, prevView, setPrevView, breadCrumb, setBreadCrumb, isInfo, setIsInfo}} >
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