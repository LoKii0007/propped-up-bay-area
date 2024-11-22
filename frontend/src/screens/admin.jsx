import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/adminSidebar";
import ClientDetails from "../components/clientDetails";
import Salesreport from "../components/salesreport";
import AdminLogin from "../auth/adminLogin";
import Invoices from "../components/Invoices";
import Dropdown from "../ui/dropdown";
import OrderRequests from "../components/orderRequests";
import AdminSettings from "../components/adminSettings";
import { useGlobal } from "../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

function Admin() {
  const navigate = useNavigate();
  const { breadCrumb, setBreadCrumb, isInfo, setIsInfo, baseUrl } = useGlobal();
  const [activeView, setActiveView] = useState("order requests");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const { admin, setAdmin } = useAuth();
  const page = 1;
  const limit = 20;
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [totalOrderCount, setTotalOrderCount] = useState(0);

  //? ----------------------------------
  //? loading initial users
  async function handleUsers() {
    try {
      const res = await axios.get(`${baseUrl}/api/users/get`, {
        params: { page, limit },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      if (res.status === 401) {
        toast.error(res.data.message || "Unauthorized");
        return;
      } else if (res.status === 404) {
        toast.custom(res.data.message || "No users found");
      } else if (res.status === 200) {
        const allUsers = res.data.users;
        console.log(allUsers);
        setUsers(res.data.users);
        setTotalUserCount(res.data.count);
        const subs = allUsers.filter((user) => user.isSubscribed);
        // setSubscribedUsers(subs);
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
      toast.error("Error fetching users");
    }
  }

  //? ----------------------------------
  //? loading initial orders
  async function handleOrders() {
    try {
      const res = await axios.get(`${baseUrl}/api/orders/get-all`, {
        params: { page, limit },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      if (res.status === 200) {
        const allOrders = res.data.orders;
        setOrders(allOrders);
        setTotalOrderCount(res.data.count);
        const sub = allOrders.filter((order)=> order.type === 'postOrder' )
        setSubscribedUsers(sub)
      } else if (res.status === 404) {
        toast(res.data.message || "no orders found");
      } else {
        toast.error(res.data.message || "Unauthorized");
      }
    } catch (error) {
      toast.error("Server error loading orders. Please try again");
    }
  }

  //? --------------------------
  //? on load logic for auth
  useEffect(() => {
    if (admin) {
      handleUsers();
      handleOrders();
    } else {
      const data = JSON.parse(sessionStorage.getItem("proppedUpAdmin"));
      console.log(admin);
      if (data) {
        setAdmin(data);
      }
    }
  }, [admin]);

  //?--------------------------
  //? update breadcrumb
  function handleView() {
    if (isInfo) setIsInfo(false);
    if (breadCrumb !== activeView) setBreadCrumb(activeView);
  }

  useEffect(() => {}, [orders, users, subscribedUsers]);

  return (
    <>
      {admin ? (
        <div className="home w-[100vw] flex">
          <div className="sidebar min-w-fit w-3/12 border-r px-10 flex flex-col justify-between gap-5 bg-white">
            <AdminSidebar
              activeView={activeView}
              setActiveView={setActiveView}
            />
          </div>

          <div className="active-content w-full">
            <div className="active-top flex justify-between items-center px-12 h-[13vh] py-8 bg-[#F4FFF0]">
              <div className="text-2xl font-bold flex gap-3 items-center capitalize">
                {isInfo && (
                  <button
                    onClick={handleView}
                    className="chevron-icon px-3 py-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 16 16"
                    >
                      <path
                        stroke="#000000"
                        strokeWidth={1}
                        fillRule="evenodd"
                        d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                      />
                    </svg>
                  </button>
                )}
                {breadCrumb}
              </div>
              <div className="flex gap-8 items-center">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center text-xl font-bold bg-[#34CAA5] text-white px-6 py-2 rounded-md"
                >
                  + New Client
                </button>
                {/* <Dropdown setActiveView={setActiveView} /> */}
                <div className=" capitalize">
                  Welcome, {admin?.firstName} {admin?.lastName}
                </div>
              </div>
            </div>
            <div className="p-7 bg-white h-[87vh]">
              <div className="active-bottom h-full overflow-y-auto">
                {activeView === "dashboard" && <Salesreport />}
                {activeView === "clients" && (
                  <ClientDetails
                    users={users}
                    setUsers={setUsers}
                    totalCount={totalUserCount}
                    orders={orders}
                    setOrders={setOrders}
                  />
                )}
                {activeView === "order requests" && (
                  <OrderRequests
                    orders={orders}
                    setOrders={setOrders}
                    totalOrderCount={totalOrderCount}
                  />
                )}
                {activeView === "subscriptions" && (
                  <OrderRequests
                    orders={subscribedUsers}
                    setOrders={setSubscribedUsers}
                    totalOrderCount={totalOrderCount}
                  />
                )}
                {/* {activeView === "subscriptions" && (
                  <ClientDetails
                    users={subscribedUsers}
                    setUsers={setSubscribedUsers}
                    totalCount={totalUserCount}
                    orders={orders}
                    setOrders={setOrders}
                  />
                )} */}
                {activeView === "sales report" && <Salesreport />}
                {activeView === "invoices" && <Invoices />}
                {activeView === "settings" && <AdminSettings />}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AdminLogin />
      )}
    </>
  );
}

export default Admin;
