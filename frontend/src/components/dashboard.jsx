import React, { useState } from "react";
import DashboardBtn from "../ui/dashboardBtn";

function Dashboard() {
  const orders = [
    {
      id: "1",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "Pending",
      name: "John Doe",
      amount: "1000",
      isSubscribed: true
    },
    {
      id: "2",
      orderdate: "15-1-23",
      requestedDate: "2-1-23",
      status: "Installed",
      name: "Jane Doe",
      amount: "4000",
      isSubscribed: true
    },
    {
      id: "3",
      orderdate: "15-11-23",
      requestedDate: "25-11-23",
      status: "Pending",
      name: "Alice Smith",
      amount: "1500",
      isSubscribed: false
    },
    {
      id: "4",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "Installed",
      name: "John Doe",
      amount: "1000",
      isSubscribed: true
    },

  ]

  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [orderType, setOrderType] = useState("all")

  const handleOrderType = (type) => {
    if (type === "all") {
      setOrderType(type)
      setFilteredOrders(orders)
    } else {
      setOrderType(type)
      const newOrders = orders.filter((order) => order.status.toLowerCase() === type.toLowerCase())
      setFilteredOrders(newOrders)
    }
  }

  return (
    <>
      <div className="dashboard flex flex-col p-10 h-full">
        <div className="dashboard-top w-[90%] mx-auto grid grid-cols-4 gap-10 font-medium mb-5">
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="all" text="All Orders" />
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="pending" text="Pending Orders" />
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="installed" text="Installed Orders" />
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="completed" text="Completed Orders" />
        </div>
        <div className="dashboard-bottom w-full bg-white rounded-lg">
          <div className="order-top grid grid-cols-6 bg-[#F7F8FA] border-[1px] border-[#EFF0F4] rounded-md">
            <div className="px-5 py-2 text-center text-[#04091E]">OrderId</div>
            <div className="px-5 py-2 text-center text-[#04091E]">Name</div>
            <div className="px-5 py-2 text-center text-[#04091E]">Order Date</div>
            <div className="px-5 py-2 text-center text-[#04091E]">Requested Date</div>
            <div className="px-5 py-2 text-center text-[#04091E]">Amount</div>
            <div className="px-5 py-2 text-center text-[#04091E]">Status</div>
          </div>

          <div className="order-bottom flex flex-col">
            {filteredOrders.length > 0 ?
              filteredOrders?.map((order, index) => (
                <div key={index} >
                  <div className="grid grid-cols-6 py-5 border-b-[1px]">
                    <div className="px-5 text-center">{order.id}</div>
                    <div className="px-5 text-center">{order.name}</div>
                    <div className="px-5 text-center">{order.orderdate}</div>
                    <div className="px-5 text-center">{order.requestedDate}</div>
                    <div className="px-5 text-center">{order.amount}</div>
                    <button className={`px-5 text-center font-semibold ${order.status === "Pending" ? "text-[#F6B73C]" : order.status === "installed" ? "text-[#4C9A2A]" : "text-[#4C9A2A]"}`}>{order.status}</button>
                  </div>
                  {/* {index !== orders?.length - 1 && <div className="bg-gray-300 h-[1px] w-full " ></div>} */}
                </div>
              )) : (
                <div className="text-center text-gray-500 p-12">You don't have any orders yet.</div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
