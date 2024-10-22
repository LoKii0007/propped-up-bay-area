import React, { useState } from 'react'
import AdminSidebar from '../components/adminSidebar'
import ClientDetails from '../components/clientDetails'
import Salesreport from '../components/salesreport'
import { users } from '../data/staticData'
import AdminLogin from '../auth/adminLogin'
import Invoices from '../components/Invoices'
import Dropdown from '../ui/dropdown'
import OrderRequests from '../components/orderRequests'
import AdminSettings from '../components/adminSettings'
import { UseGlobal } from '../context/GlobalContext'
import { useNavigate } from 'react-router-dom'


function Admin() {

  const sampleAdmin = {
    phoneNumber: "08033333333",
    password: "admin123",
    email: "admin@gmail.com",
    fullName: "Admin"
  }

  const navigate = useNavigate()
  const {breadCrumb, setBreadCrumb, isInfo, setIsInfo} = UseGlobal()
  const [activeView, setActiveView] = useState("clients")
  const filteredUsers = users.filter(user => user.isSubscribed)
  console.log(filteredUsers)
  const [admin, setAdmin] = useState(sampleAdmin)

  function handleView(){
    if(isInfo) setIsInfo(false)
    if(breadCrumb !== activeView) setBreadCrumb(activeView)
  }

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
        <div className="sidebar min-w-fit w-3/12 px-10 flex flex-col justify-between gap-5 bg-white">
          <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="active-content w-svw ">

          <div className="active-top flex justify-between items-center px-12 h-[13vh] py-8 bg-[#F4FFF0] ">
            <div className="text-2xl font-bold flex gap-3 items-center capitalize justify-center">
              <button onClick={handleView} className="chevron-icon px-3 py-1  ">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" class="bi bi-chevron-left" viewBox="0 0 16 16">
                  <path stroke='#000000' strokeWidth={1} fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                </svg>
              </button>
              {breadCrumb}
            </div>
            <div className='flex gap-8 items-center'>
              <button onClick={()=>navigate('/')} className='flex items-center text-xl justify-center font-bold bg-[#34CAA5] text-white px-6 py-2 rounded-md' >
                + New Client
              </button>
              <Dropdown />
            </div>
          </div>
          <div className='p-7 bg-white h-[87vh] ' >
            <div className="active-bottom h-full overflow-y-auto ">
              {activeView === "clients" && <ClientDetails users={users} />}
              {activeView === "order requests" && <OrderRequests />}
              {activeView === "subscription" && <ClientDetails users={filteredUsers} />}
              {activeView === "sales report" && <Salesreport />}
              {activeView === "invoices" && <Invoices />}
              {activeView === "settings" && <AdminSettings />}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin