import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/adminSidebar";
import ClientDetails from "../components/clientDetails";
import Salesreport from "../components/salesreport";
import AdminLogin from "../auth/adminLogin";
import Invoices from "../components/Invoices";
import Dropdown from "../ui/dropdown";
import OrderRequests from "../components/orderRequests";
import AdminSettings from "../components/adminSettings";
import { UseGlobal } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function Admin() {
  const navigate = useNavigate();
  const { breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl } = UseGlobal();
  const [activeView, setActiveView] = useState("clients");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { admin } = useAuth();

  async function handleUsers() {
    try {
      const page = 1;
      const limit = 10;

      const res = await axios.get(`${baseUrl}/api/users`, {
        params: { page, limit },
        withCredentials: true,
      });

      if (res.status === 401) {
        toast.error(res.data.message || 'Unauthorized');
        return;
      }
      if (res.status === 404) {
        toast.custom(res.data.message || 'No users found');
        return;
      }

      const allUsers = res.data.users;
      setUsers(allUsers);
      const subscribedUsers = allUsers.filter(user => user.isSubscribed);
      setFilteredUsers(subscribedUsers);

    } catch (error) {
      console.error("Error fetching users:", error.message);
      toast.error('Error fetching users');
    }
  }

  function handleView() {
    if (isInfo) setIsInfo(false);
    if (breadCrumb !== activeView) setBreadCrumb(activeView);
  }

  useEffect(() => {
    if (admin) {
      handleUsers();
    } 
  }, [admin]);

  if (!admin) {
    return <AdminLogin />;
  }

  return (
    <div className="home w-[100vw] flex">
      <div className="sidebar min-w-fit w-3/12 border-r px-10 flex flex-col justify-between gap-5 bg-white">
        <AdminSidebar activeView={activeView} setActiveView={setActiveView} />
      </div>

      <div className="active-content w-full">
        <div className="active-top flex justify-between items-center px-12 h-[13vh] py-8 bg-[#F4FFF0]">
          <div className="text-2xl font-bold flex gap-3 items-center capitalize">
            <button onClick={handleView} className="chevron-icon px-3 py-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16">
                <path
                  stroke="#000000"
                  strokeWidth={1}
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                />
              </svg>
            </button>
            {breadCrumb}
          </div>
          <div className="flex gap-8 items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-xl font-bold bg-[#34CAA5] text-white px-6 py-2 rounded-md"
            >
              + New Client
            </button>
            <Dropdown setActiveView={setActiveView} />
          </div>
        </div>
        <div className="p-7 bg-white h-[87vh]">
          <div className="active-bottom h-full overflow-y-auto">
            {activeView === "dashboard" && <Salesreport />}
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
  );
}

export default Admin;
