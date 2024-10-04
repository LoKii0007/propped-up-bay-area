import React, { useState, useEffect } from "react";

function ClientDetails({users}) {

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const filtered = users.filter(user =>
      Object.entries(user).some(([key, value]) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      })
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="dashboard px-10 py-5 flex flex-col h-full ">
        <div className="relative bg-gray-100 mt-4 mb-6">
          <input
            name="searchBox"
            className="w-full py-2 px-3 bg-white border rounded-md"
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
          />
          <label className="absolute left-3 top-2 text-gray-400 pointer-events-none">
            {searchTerm ? "" : "Search"}
          </label>
        </div>
        <div className="dashboard-bottom w-full">
          <div className="order-top bg-[#F7F8FA] border-[1px] border-[#EFF0F4] rounded-md grid grid-cols-4 ">
            <div className="px-5 py-2 text-center">OrderId</div>
            <div className="px-5 py-2 text-center">Username</div>
            <div className="px-5 py-2 text-center">Email</div>
            <div className="px-5 py-2 text-center">Phone</div>
          </div>
          <div className="order-bottom flex flex-col">
            {filteredUsers.length > 0 ?
              filteredUsers.map((user, index) => (
                <div key={index} >
                  <div className="grid grid-cols-4 bg-white py-5 border-b-[1px]">
                    <div className="px-5 text-center">{user.id}</div>
                    <div className="px-5 text-center">{user.username}</div>
                    <div className="px-5 text-center">{user.email}</div>
                    <div className="px-5 text-center">{user.phone}</div>
                  </div>
                  {/* {index !== filteredUsers?.length - 1 && <div className="bg-gray-300 h-[1px] w-full " ></div>} */}
                </div>
              )) : (
                <div className="text-center text-gray-500 p-12">No matching customers found.</div>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientDetails
