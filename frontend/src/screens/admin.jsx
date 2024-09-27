import React, {useState} from 'react'
import AdminSidebar from '../components/adminSidebar'
import Dashboard from '../components/dashboard'
import ClientDetails from '../components/clientDetails'
import Salesreport from '../components/salesreport'

function Admin() {

  const [activeView, setActiveView] = useState("clients")

  return (
    <>
      <div className="home w-[100vw] bg-gray-200 h-[92vh] flex">
        <div className="sidebar w-[20vw] flex flex-col justify-between mt-5 gap-5 bg-white shadow-md rounded-lg ">
          <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="active-content mt-5 mx-5 w-svw">
          {activeView === "clients" && <ClientDetails />}
          {activeView === "order requests" && <Dashboard/>}
          {activeView === "subscription customers" && <Dashboard  />}
          {activeView === "sales report" && <Salesreport />}
        </div>
      </div>
    </>
  )
}

export default Admin