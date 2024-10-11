import React, { useState } from 'react'
import AdminSidebar from '../components/adminSidebar'
import Dashboard from '../components/dashboard'
import ClientDetails from '../components/clientDetails'
import Salesreport from '../components/salesreport'
import { users } from '../data/staticData'
import AdminLogin from '../auth/adminLogin'
import Invoices from '../components/Invoices'
import Dropdown from '../ui/dropdown'
function Admin() {

  const sampleAdmin = {
    phoneNumber: "08033333333",
    password: "admin123",
    email: "admin@gmail.com",
    fullName: "Admin"
  }

  const [activeView, setActiveView] = useState("clients")
  const filteredUsers = users.filter(user => user.isSubscribed)
  console.log(filteredUsers)
  const [admin, setAdmin] = useState(sampleAdmin)

  if (!admin) {
    return (
      <>
        <AdminLogin setAdmin={setAdmin} />
      </>
    )
  }

  return (
    <>
      <div className="home w-[100vw] flex">
        <div className="sidebar min-w-[300px] w-2/12 px-10 flex flex-col justify-between gap-5 bg-white">
          <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="active-content w-svw h-full ">

          <div className="active-top flex justify-between items-center px-12 py-8 bg-[#F4FFF0] ">
            <div className="text-2xl font-bold">{activeView}</div>
            <div className='flex gap-8 items-center'>
            <button className='flex items-center text-xl justify-center font-bold bg-[#34CAA5] text-white px-6 py-2 rounded-md' >
              + New Client
            </button>
            <Dropdown/>
            </div>
          </div>
          <div className='min-h-[82vh] p-7 bg-white' >
            <div className="active-bottom bg-[#FAFBFC] rounded-[20px] h-full">
              {activeView === "clients" && <ClientDetails users={users} />}
              {activeView === "order requests" && <Dashboard />}
              {activeView === "subscription" && <ClientDetails users={filteredUsers} />}
              {activeView === "sales report" && <Salesreport />}
              {activeView === "invoices" && <Invoices />}
            </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Admin