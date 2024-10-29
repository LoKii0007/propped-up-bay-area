import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import DashboardBtn from "../ui/dashboardBtn";
import RowHeading from "../ui/rowHeading";
import Modal from "../ui/ChangeStatusModal";
import DetailedInfo from "./DetailedInfo";
import { UseGlobal } from "../context/GlobalContext";

function ClientDetails({ users }) {
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderType, setOrderType] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const { setBreadCrumb, isInfo, setIsInfo } = UseGlobal();

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

  //? --------------------
  //? user click
  //?---------------------
  function handleUserClick() {
    setBreadCrumb("Customer info"); //updating breadcrumb
    setIsInfo(true); //changing view
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
                  class="bi bi-search"
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
            {/* <div className="flt-right">
              <button
                onClick={() => setModalOpen(true)}
                className="filter-btn px-3 me-12 flex justify-center items-center gap-3"
              >
                <div className="funnel-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-funnel"
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z" />
                  </svg>
                </div>
                Filters
              </button>
            </div> */}
          </div>

           {/* ------------------------- modal----------- */}
           <Modal open={modalOpen} setOpen={setModalOpen} />

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
                {/* <RowHeading
                  setFilteredData={setFilteredUsers}
                  filterValue={""}
                  data={filteredUsers}
                  text="OrderId"
                /> */}
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
              </div>
              <div className="order-bottom flex flex-col">
                {filteredUsers
                  .slice(startIndex, endIndex)
                  .map((user, index) => (
                    <div
                      onClick={handleUserClick}
                      key={index}
                      className="grid grid-cols-4 bg-white p-5 gap-2 cursor-pointer "
                    >
                      <div className=" text-center flex items-center gap-3">
                        <img
                          src="/user.png"
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="">{user.email}</div>
                      {/* <div className="">{user.id}</div> */}
                      <div className="">{user.totalOrders}</div>
                      <div className="">{user.totalSpent}</div>
                    </div>
                  ))}
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
        <DetailedInfo />
      )}
    </>
  );
}

export default ClientDetails;
