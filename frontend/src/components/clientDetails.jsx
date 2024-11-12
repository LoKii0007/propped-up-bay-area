import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import RowHeading from "../ui/rowHeading";
import DetailedInfo from "./DetailedInfo";
import { UseGlobal } from "../context/GlobalContext";
import axios from "axios";
import toast from "react-hot-toast";

function ClientDetails({ users, setUsers, sub, totalCount }) {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const { setBreadCrumb, isInfo, setIsInfo, baseUrl } = UseGlobal();
  const [userInfo, setUserInfo] = useState(null);
  const [nextLoading, setNextLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const limit = 10;

  //? ------------------------
  //? pagination
  //? ------------------------
  const [displayCount, setDisplayCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(users.length / displayCount)
  );
  const [startPage, setStartPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;

  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.entries(user).some(([key, value]) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm);
        }
        return false;
      })
    );
    setFilteredUsers(filtered);

    //? --------------------
    //? pagination resets
    //?---------------------
    setTotalPages(Math.ceil(filtered.length / displayCount));
    setCurrentPage(1); // Reset to first page when filtering
    setStartPage(1); // Reset page range to the beginning when filtering
  }, [searchTerm, users, displayCount]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  //? -------------------------
  //? pagination resets
  //?--------------------------
  function resetPagination(filtered) {
    setTotalPages(Math.ceil(filtered.length / displayCount));
    setCurrentPage(1); // Reset to first page when filtering
    setStartPage(1); // Reset page range to the beginning when filtering
  }

  //? -------------------------
  //? handle next users
  //?--------------------------
  async function handleNextUsers() {
    setNextLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/users/get`, {
        params: { page: orderPage + 1, limit },
        withCredentials: true,
        validateStatus: function (status) {
          return status < 500;
        },
      });

      if (res.status === 200) {
        const allUsers = [...users, ...res.data.users];
        setUsers(allUsers);
        setFilteredUsers(allUsers);
        setOrderPage((prev) => prev + 1);
        setTotalPages(Math.ceil(users.length / displayCount));
        resetPagination(allUsers);
      } else {
        toast(res.data.message || "no more users found");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setNextLoading(false);
    }
  }

  useEffect(() => {}, [filteredUsers]);

  //? --------------------
  //? user click
  //?---------------------
  function handleUserClick(index) {
    const selectedUser = filteredUsers[index];
    if (selectedUser) {
      setUserInfo(selectedUser); // Store selected user
      setBreadCrumb("Customer info"); // updating breadcrumb
      setIsInfo(true); // changing view
    }
  }

  return (
    <>
      {!isInfo ? (
        <div className="dashboard flex flex-col h-full  overflow-y-auto">
          <div className="relative mt-4 mb-6 flex justify-between items-center w-full gap-6">
            <div className="search rounded-md bg-[#f5f5f5] w-1/3 flex items-center px-3">
              <div className="search-icon ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </div>
              <input
                name="searchBox"
                className="w-full py-2 px-3 focus-visible:outline-none bg-[#f5f5f5]"
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by name or email"
              />
            </div>
          </div>

          <div className="dashboard-bottom w-full gap-6 flex flex-col justify-between h-full">
            <div className="order-list w-full flex flex-col">
              <div className="order-top text-[#718096] grid grid-cols-4 px-5 gap-2">
                <RowHeading
                  setFilteredData={setFilteredUsers}
                  filterValue={"firstName lastName"}
                  data={filteredUsers}
                  text="Username"
                />
                <RowHeading
                  setFilteredData={setFilteredUsers}
                  filterValue={"email"}
                  data={filteredUsers}
                  text="Email"
                />
                <RowHeading
                  setFilteredData={setFilteredUsers}
                  filterValue={"totalOrders"}
                  data={filteredUsers}
                  text="Orders"
                />
                <RowHeading
                  setFilteredData={setFilteredUsers}
                  filterValue={"totalSpent"}
                  data={filteredUsers}
                  text="Spent"
                />
                {/* {sub && (
                  <RowHeading
                    setFilteredData={setFilteredUsers}
                    filterValue={"isSubscribed"}
                    data={filteredUsers}
                    text="Subscription"
                  />
                )} */}
              </div>
              <div className="order-bottom flex flex-col">
                {filteredUsers
                  .slice(startIndex, endIndex)
                  .map((user, index) => (
                    <div
                      onClick={() => handleUserClick(index)}
                      key={user._id}
                      className="grid grid-cols-4 bg-white p-5 gap-2 cursor-pointer "
                    >
                      <div className="text-center flex items-center gap-3 overflow-hidden">
                        <img
                          src="/user.png"
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="overflow-hidden">{user.email}</div>
                      <div className="overflow-hidden">{user.totalOrders}</div>
                      <div className="overflow-hidden">{user.totalSpent}</div>
                      {/* {sub && <div className="overflow-hidden">{user.isSubscribed}</div>} */}
                    </div>
                  ))}
                {users.length < totalCount &&
                  currentPage === totalPages && (
                    <div className="flex justify-center">
                      <button
                        disabled={nextLoading}
                        onClick={() => handleNextUsers()}
                        className="bg-yellow-500 py-2 px-4 rounded-md my-3 "
                      >
                        {nextLoading ? "loading..." : "Load more"}
                      </button>
                    </div>
                  )}
              </div>
            </div>

            <Pagination
              startPage={startPage}
              setStartPage={setStartPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              displayCount={displayCount}
              setDisplayCount={setDisplayCount}
              filtered={filteredUsers}
            />
          </div>
        </div>
      ) : (
        <DetailedInfo user={userInfo} /> // Pass selected user ID
      )}
    </>
  );
}

export default ClientDetails;
