import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const GlobalContext = React.createContext()

export function GlobalContextProvider({children}){
    const [settingsActiveView, setSettingsActiveView] = useState("profileSettings")
    const [breadCrumb, setBreadCrumb] = useState('clients')
    const [isInfo, setIsInfo] = useState(false)
    const baseUrl = import.meta.env.VITE_BACKEND_URL
    const [activeView, setActiveView] = useState('dashboard')
    const [totalUserCount, setTotalUserCount] = useState(0)
    const [adminActiveView, setAdminActiveView] = useState("order requests")
    const [zonePrices, setZonePrices] = useState([])
    const [additionalPrices, setAdditionalPrices] = useState([])
    const [draft, setDraft] = useState(null)

    async function getZonePrices() {
        try {
          const res = await axios.get(`${baseUrl}/api/pricing/get-zone-prices`, {
            withCredentials: true,
            validateStatus: (status) => status < 500,
          });
          if (res.status !== 200) {
            toast.error('Failed to fetch zone prices. please try again later');
          } else {
            console.log(res.data);
            setZonePrices(res.data.zonePrices);
          }
        } catch (error) {
          toast.error('Failed to fetch zone prices. please try again later');
        }
      }
    
      async function getAdditionalPrices() {
        try {
          const res = await axios.get(
            `${baseUrl}/api/pricing/get-additional-prices`,
            {
              withCredentials: true,
              validateStatus: (status) => status < 500,
            }
          );
          if (res.status !== 200) {
            toast.error('Failed to fetch additional prices. please try again later');
          } else {
            // const filteredPrices = res.data.additionalPrices.filter(price => price.type === "openHouse");
            setAdditionalPrices(res.data.additionalPrices);
          }
        } catch (error) {
          toast.error('Failed to fetch additional prices. please try again later');
        }
      }

      useEffect(() => {
        getZonePrices();
        getAdditionalPrices();
      }, []);
      
      useEffect(() => {
      }, [zonePrices, additionalPrices]);

    return(
        <GlobalContext.Provider value={{draft, setDraft, adminActiveView, setAdminActiveView, setSettingsActiveView, settingsActiveView, breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl, activeView, setActiveView, totalUserCount, setTotalUserCount, zonePrices, additionalPrices}} >
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