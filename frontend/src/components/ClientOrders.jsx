import React, { useState, useEffect } from "react";
import DashboardBtn from "../ui/dashboardBtn";
import Pagination from "./pagination";
import RowHeading from "../ui/rowHeading";
import OrderTypeDropdown from "../ui/orderTypeDropdown";
import { UseGlobal } from "../context/GlobalContext";
import OrderInfo from "./OrderInfo";
import { sampleOrder } from "../data/staticData";
import toast from "react-hot-toast";

function ClieentOrders() {
  const orders = [
    {
      type: "openHouse",
      id: "1",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "Pending",
      name: "John Doe",
      amount: "1000",
      isSubscribed: true,
    },
    {
      id: "2",
      type: "openHouse",
      orderdate: "15-1-23",
      requestedDate: "2-1-23",
      status: "Installed",
      name: "Jane Doe",
      amount: "4000",
      isSubscribed: true,
    },
    {
      id: "3",
      type: "postOrder",
      orderdate: "15-11-23",
      requestedDate: "25-11-23",
      status: "Pending",
      name: "Alice Smith",
      amount: "1500",
      isSubscribed: false,
    },
    {
      id: "4",
      type: "PostRemoval",
      orderdate: "10-10-23",
      requestedDate: "20-10-23",
      status: "Installed",
      name: "John Doe",
      amount: "1000",
      isSubscribed: true,
    },
  ];

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderType, setOrderType] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { setBreadCrumb, isInfo, setIsInfo } = UseGlobal();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //? ------------------------
  //? pagination
  //? ------------------------
  const [displayCount, setDisplayCount] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(orders.length / displayCount)
  );
  const [startPage, setStartPage] = useState(1);
  const startIndex = (currentPage - 1) * displayCount;
  const endIndex = startIndex + displayCount;

  //? -------------------------
  //? pagination resets
  //?--------------------------
  function resetPagination(filtered) {
    setTotalPages(Math.ceil(filtered.length / displayCount));
    setCurrentPage(1); // Reset to first page when filtering
    setStartPage(1); // Reset page range to the beginning when filtering
  }

  //? -------------------------
  //? filter - search
  //?--------------------------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const filtered = orders.filter((order) =>
      Object.entries(order).some(([key, value]) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof value === "number") {
          return value.toString().includes(searchTerm);
        }
        return false;
      })
    );
    setFilteredOrders(filtered); // updating parent
    resetPagination(filtered); // reset pagination
  }, [searchTerm, displayCount]);

  //? -------------------------
  //? filter - order status
  //?--------------------------
  const handleOrderStatus = (type) => {
    let filtered;
    if (type === "all") {
      setOrderStatus(type);
      setFilteredOrders(orders);
      filtered = orders;
    } else {
      setOrderStatus(type);
      filtered = orders.filter(
        (order) => order.status.toLowerCase() === type.toLowerCase()
      );
      setFilteredOrders(filtered);
    }

    resetPagination(filtered); // reset pagination
  };

  //? -------------------------
  //? filter - order type
  //?--------------------------
  const handleOrderType = (type) => {
    let filtered;
    if (type === "all") {
      setOrderType(type);
      setFilteredOrders(orders);
      filtered = orders;
    } else {
      setOrderType(type);
      filtered = orders.filter(
        (order) => order.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredOrders(filtered);
    }

    resetPagination(filtered); // reset pagination
  };

  //? -------------------------
  //? filter - date range
  //?--------------------------
  function parseDate(dateStr) {
    const [day, month, year] = dateStr.split("-");
    // Prepend '20' to the year to get the full year (assuming dates in 'YY' are after 2000)
    const fullYear = `20${year}`;
    return new Date(fullYear, month - 1, day); // month is zero-indexed in JS Date
  }
  
  function handleDateFilter() {
    if (!startDate || !endDate) {
      toast.error("please select date range !");
      return;
    }
  
    // Convert startDate and endDate to Date objects
    const start = parseDate(startDate);
    const end = parseDate(endDate);
  
    const filtered = orders.filter((order) => {
      const orderDate = parseDate(order.orderdate);
      return orderDate >= start && orderDate <= end;
    });
  
    setFilteredOrders(filtered);
    resetPagination(filtered);
  }
//   function handleDateFilter() {
//     if(!startDate || !endDate){
//         toast.error('please select date range !')
//         return
//     }
//     const filtered = orders.filter((order)=> order.orderdate >= startDate && order.orderdate <= endDate )
//     setFilteredOrders(filtered)
//     resetPagination(filtered)  
//   }

  //? --------------------
  //? user click
  //?---------------------
  function handleUserClick() {
    setBreadCrumb("Order details"); //updating breadcrumb
    setIsInfo(true); //changing view
  }

  return (
    <>
      {!isInfo ? (
        <div className="order-req flex flex-col h-full overflow-y-auto ">
          <div className="req-top mt-4 w-full flex flex-col gap-6 font-medium mb-6 items-center">
            <div className="w-full flex gap-6 font-medium items-center">
              <div className="filter-left w-1/3">
                <div className="search rounded-md bg-[#f5f5f5] flex items-center px-3">
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
                    placeholder="Search by anyhthing..."
                  />
                </div>
              </div>
              <div className="filter-right mx-auto grid grid-cols-4 gap-5 w-2/3">
                <OrderTypeDropdown
                  filterType={orderType}
                  handleOrderType={handleOrderType}
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="p-2 border rounded flex items-center justify-center "
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="p-2 border rounded"
                />
                <button onClick={handleDateFilter} className="font-semibold">
                  <div className="icon"></div>
                  Filter
                </button>
              </div>
            </div>

            <div className="w-full grid grid-cols-4 ">
              <DashboardBtn
                orderType={orderStatus}
                handleOrderType={handleOrderStatus}
                filter="all"
                text="All"
              />
              <DashboardBtn
                orderType={orderStatus}
                handleOrderType={handleOrderStatus}
                filter="pending"
                text="Pending"
              />
              <DashboardBtn
                orderType={orderStatus}
                handleOrderType={handleOrderStatus}
                filter="installed"
                text="Installed"
              />
              <DashboardBtn
                orderType={orderStatus}
                handleOrderType={handleOrderStatus}
                filter="completed"
                text="Completed"
              />
            </div>
          </div>

          <div className="req-bottom w-full h-full flex flex-col gap-6 justify-between">
            <div className=" flex flex-col">
              <div className="order-top text-[#718096] grid grid-cols-6 px-5 gap-2">
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"id"}
                  text="OrderId"
                />
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"name"}
                  text="Name"
                />
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"orderdate"}
                  text="Order Date"
                />
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"requestedDate"}
                  text="Req. Date"
                />
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"amount"}
                  text="Amount"
                />
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"status"}
                  text="Status"
                />
              </div>
              {filteredOrders.length > 0 ? (
                filteredOrders
                  ?.slice(startIndex, endIndex)
                  .map((order, index) => (
                    <div
                      onClick={handleUserClick}
                      key={index}
                      className="cursor-pointer grid grid-cols-6 w-full p-5 gap-2 "
                    >
                      <div className="">{order.id}</div>
                      <div className="">{order.name}</div>
                      <div className="">{order.orderdate}</div>
                      <div className="">{order.requestedDate}</div>
                      <div className="">{order.amount}</div>
                      <button
                        onClick={() => setModalOpen(true)}
                        className={`text-left font-semibold ${
                          order.status === "Pending"
                            ? "text-[#F6B73C]"
                            : order.status === "installed"
                            ? "text-[#4C9A2A]"
                            : "text-[#4C9A2A]"
                        }`}
                      >
                        {order.status}
                      </button>
                    </div>
                  ))
              ) : (
                <div className=" text-gray-500 p-12">
                  You don't have any orders yet.
                </div>
              )}
            </div>

            <Pagination
              filtered={filteredOrders}
              startPage={startPage}
              setStartPage={setStartPage}
              totalPages={totalPages}
              setTotalPages={setTotalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              displayCount={displayCount}
              setDisplayCount={setDisplayCount}
            />
          </div>
        </div>
      ) : (
        <OrderInfo order={sampleOrder} />
      )}
    </>
  );
}

export default ClieentOrders;
