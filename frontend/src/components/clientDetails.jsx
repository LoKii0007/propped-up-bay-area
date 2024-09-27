import React, { useState } from "react";
import DashboardBtn from "./ui/dashboardBtn";

function ClientDetails() {
  const users = [
    {
      id: "1",
      username: "10-10-23",
      email: "20-10-23",
      phone: "pending",
    }
  ]

  const [filteredUsers, setFilteredUsers] = useState(users)


  return (
    <>
      <div className="dashboard mx-5 px-10 py-5 flex flex-col h-full bg-white rounded-md shadow-md ">
        <div className=" bg-gray-100 mt-4 mb-6 ">
          <input name="searchBox" className="py-2 bg-white" type="text" />
          <label >Search</label>
        </div>
        <div className="dashboard-bottom w-full border-2">
          <div className="order-top bg-gray-100 grid grid-cols-4 ">
            <div className="px-5 py-2 text-center">OrderId</div>
            <div className="px-5 py-2 text-center">Username</div>
            <div className="px-5 py-2 text-center">Email</div>
            <div className="px-5 py-2 text-center">Phone</div>
          </div>
          <div className="order-bottom flex flex-col gap-1">
            {users.length > 0 ?
              users?.map((user, index) => (
                <div key={index} >
                  <div className="grid grid-cols-4">
                    <div className="px-5 text-center">{user.id}</div>
                    <div className="px-5 text-center">{user.username}</div>
                    <div className="px-5 text-center">{user.email}</div>
                    <div className="px-5 text-center">{user.phone}</div>
                  </div>
                  {index !== users?.length - 1 && <div className="bg-gray-300 h-[1px] w-full " ></div>}
                </div>
              )) : (
                <div className="text-center text-gray-500 p-12">You don't have any customers yet.</div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientDetails
