import React, { useState } from "react";
import DashboardBtn from "./ui/dashboardBtn";

function Dashboard() {
  const orders = [
    {
      id: "1",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "pending",
    },
    {
      id: "12",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "pending",
    },
    {
      id: "11",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "completed",
    },
    {
      id: "41",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "completed",
    },
    {
      id: "16",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "completed",
    },
    {
      id: "20",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "completed",
    }
  ]

  const [filteredOrders, setFilteredOrders] = useState(orders)
  const [orderType, setOrderType] = useState("all")

  const handleOrderType = (type) => {
    if(type === "all"){
      setOrderType(type)
      setFilteredOrders(orders)
    }else{
      setOrderType(type)
      const newOrders = orders.filter((order) => order.status === type)
      setFilteredOrders(newOrders)
    }
  }

  return (
    <>
      <div className="dashboard mx-5 px-10 py-5 flex flex-col bg-white shadow-md rounded-lg h-full">
        <div className="dashboard-top w-full grid grid-cols-4 font-medium ">
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType}  filter="all" text="All Orders" />
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="pending" text="Pending Orders" />
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="installed" text="Installed Orders" />
          <DashboardBtn orderType={orderType} handleOrderType={handleOrderType} filter="completed" text="Completed Orders" />
        </div>
        <div className="dashboard-bottom w-full border-2">
          <div className="order-top bg-gray-100 grid grid-cols-4 ">
            <div className="px-5 py-2 text-center">OrderId</div>
            <div className="px-5 py-2 text-center">Order Date</div>
            <div className="px-5 py-2 text-center">Requested Date</div>
            <div className="px-5 py-2 text-center">Status</div>
          </div>
          <div className="order-bottom flex flex-col gap-1">
            { filteredOrders.length>0 ?
             filteredOrders?.map((order, index) => (
              <div  key={index} >
              <div className="grid grid-cols-4">
                <div className="px-5 text-center">{order.id}</div>
                <div className="px-5 text-center">{order.orderdate}</div>
                <div className="px-5 text-center">{order.requestedDate}</div>
                <div className="px-5 text-center">{order.status}</div>
              </div>
              { index !== orders?.length-1 && <div className="bg-gray-300 h-[1px] w-full " ></div> }
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
