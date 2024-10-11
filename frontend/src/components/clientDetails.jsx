import React, { useState, useEffect } from "react";

function ClientDetails({ users }) {

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("")
  const [displayCount, setdisplayCount] = useState(3)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.floor(users.length / displayCount) + users.length % displayCount)
  const [startCount, setStartCount] = useState(0)
  const [endCount, setEndCount] = useState(displayCount)

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
  }

  function handleDisplayCount(e) {
    setdisplayCount(e.target.value)
    setEndCount(displayCount)
    setTotalPages(Math.floor(users.length / displayCount) + users.length % displayCount)
  }

  function handlePageBtn(index) {
    setStartCount(displayCount * index)
    setEndCount(displayCount * (index + 1))
  }

  useEffect(() => {
    console.log('start : ', startCount)
    console.log('end : ', endCount)
  }, [startCount, displayCount, endCount, totalPages, currentPage])

  return (
    <>
      <div className="dashboard px-10 py-5 flex flex-col h-full ">
        <div className="relative mt-4 mb-6 flex justify-between">
          <div className="search rounded-md bg-[#f5f5f5] w-1/2 flex items-center px-3">
            <img src="/user.png" alt="" className=" w-5 h-5" />
            <input
              name="searchBox"
              className="w-full py-2 px-3 focus-visible:outline-none bg-[#f5f5f5]"
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search"
            />
          </div>
          <div className="export flex items-center gap-3" >
            <button>
              <img src="/user.png w-5 h-5" alt="" />
              export
            </button>
          </div>
        </div>
        <div className="dashboard-bottom w-full gap-8 flex flex-col justify-between h-full">
          <div className="w-full flex flex-col">
            <div className="order-top bg-[#F7F8FA] text-[#718096] border-[1px] border-[#EFF0F4] rounded-md grid grid-cols-5 ">
              <div className="px-5 py-2">Username</div>
              <div className="px-5 py-2">Email</div>
              <div className="px-5 py-2">OrderId</div>
              <div className="px-5 py-2">Orders</div>
              <div className="px-5 py-2">Spent</div>
            </div>
            <div className="order-bottom flex flex-col">
              {filteredUsers.length > 0 ?
                filteredUsers.slice(startCount, endCount).map((user, index) => (
                  <div key={index} >
                    <div className="grid grid-cols-5 bg-white py-5 border-b-[1px]">
                      <div className="px-5 text-center flex items-center gap-3">
                        <img src="/user.png" alt="" className=" w-5 h-5 rounded-[50%]" />
                        {user.username}
                      </div>
                      <div className="px-5">{user.email}</div>
                      <div className="px-5">{user.id}</div>
                      <div className="px-5">{user.orders}</div>
                      <div className="px-5">{user.spent}</div>
                    </div>
                    {/* {index !== filteredUsers?.length - 1 && <div className="bg-gray-300 h-[1px] w-full " ></div>} */}
                  </div>
                ))

                : (
                  <div className="text-center text-gray-500 p-12">No matching customers found.</div>
                )
              }
            </div>
          </div>
          <div div className="pagination flex items-center justify-between px-10">
            <div className="page-left">
              <label htmlFor="">Show results : </label>
              <input min={0} value={displayCount} onChange={(e) => handleDisplayCount(e)} type="number" className="w-[40px]" />
              {/* <button onClick={handleDisplayCount} >apply</button> */}
            </div>
            <div className="page-right flex">
              <button>
                <img src="/arrow-left.png" alt="" className="px-5 py-2" />
              </button>
              {Array.from({ length: totalPages }).slice(0, 4).map((_, index) => (
                <button onClick={() => handlePageBtn(index)} key={index} className="rounded-xl bg-[#EAFDF8] w-10 h-10 " >{index + 1}</button>
              ))}
              <div>...</div>
              <button className="rounded-xl bg-[#EAFDF8] w-10 h-10 " >{totalPages}</button>

              <button>
                <img src="/arrow-right.png" alt="" className="px-5 py-2" />
              </button>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default ClientDetails
