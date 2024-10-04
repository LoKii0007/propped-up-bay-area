import React, {useState} from 'react'
import AdminSidebar from '../components/adminSidebar'
import Dashboard from '../components/dashboard'
import ClientDetails from '../components/clientDetails'
import Salesreport from '../components/salesreport'
import { users } from '../data/staticData'
import AdminLogin from '../auth/adminLogin'
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
  const [admin , setAdmin] = useState(sampleAdmin)

  if(!admin){
    return (
      <>
        <AdminLogin setAdmin={setAdmin}  />
      </>
    )
  }

  return (
    <>
      <div className="home w-[100vw] h-[100vh] flex">
        <div className="sidebar w-[300px] px-10 flex flex-col justify-between gap-5 bg-white">
          <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
        </div>

        <div className="active-content w-svw">
          <div className="active-top flex justify-between items-center px-14 py-10 bg-[#F4FFF0] ">
            <div className="text-2xl font-bold">Home</div>
            <button className='flex items-center text-3xl justify-center font-bold bg-[#20632C] text-white px-6 py-2 rounded-full' >
              + New Client
            </button>
          </div>
          <div className="active-bottom m-7 bg-[#FAFBFC] rounded-[20px]">
          {activeView === "clients" && <ClientDetails users={users}  />}
          {activeView === "order requests" && <Dashboard/>}
          {activeView === "subscription" && <ClientDetails users={filteredUsers}  />}
          {activeView === "sales report" && <Salesreport />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Admin