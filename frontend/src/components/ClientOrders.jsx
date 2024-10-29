import React, { useState, useEffect } from "react";
import DashboardBtn from "../ui/dashboardBtn";
import Pagination from "./pagination";
import RowHeading from "../ui/rowHeading";
import OrderTypeDropdown from "../ui/orderTypeDropdown";
import { UseGlobal } from "../context/GlobalContext";
import OrderInfo from "./OrderInfo";
import toast from "react-hot-toast";
import { parseDate } from "../helpers/utilities";

function ClieentOrders({orders}) {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderType, setOrderType] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { setBreadCrumb, isInfo, setIsInfo } = UseGlobal();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completeOrder, setCompleteOrder] = useState('')

  //? ------------------------
  //? pagination
  //? ------------------------
  const [displayCount, setDisplayCount] = useState(10);
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
  }, [searchTerm, displayCount, orders]);

  //? -------------------------
  //? filter - order status
  //?--------------------------
  const handleOrderStatus = (type) => {
    let filtered = orders;
    setOrderStatus(type); // updating order status

    if (orderType !== "all") {
      //  checking for prev filters
      filtered = orders.filter(
        (order) => order.type.toLowerCase() === orderType.toLowerCase()
      );
    }

    if (type === "all") {
      setFilteredOrders(filtered);
    } else {
      // applying the clicked filter
      filtered = filtered.filter(
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
    let filtered = orders;
    setOrderType(type); // updating order type

    if (orderStatus !== "all") {
      //  checking for prev filters
      filtered = orders.filter(
        (order) => order.status.toLowerCase() === orderStatus.toLowerCase()
      );
    }

    if (type === "all") {
      setFilteredOrders(filtered);
    } else {
      // applying the clicked filter
      filtered = filtered.filter(
        (order) => order.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredOrders(filtered);
    }

    resetPagination(filtered); // reset pagination
  };

  //? -------------------------
  //? filter - date range
  //?--------------------------
  function handleDateFilter() {
    if (!startDate || !endDate) {
      toast.error("please select date range !");
      return;
    }

    console.log("date : ", startDate);
    const filtered = orders.filter((order) => {
      const orderDate = parseDate(order.requestedDate);
      return orderDate >= startDate && orderDate <= endDate;
    });

    setFilteredOrders(filtered);
    resetPagination(filtered);
  }

  //? -------------------------
  //? filter - date range
  //?--------------------------
  function handleClearFilter() {
    setOrderStatus("all");
    setOrderType("all");
    setStartDate('')
    setEndDate('')
    setFilteredOrders(orders);
    resetPagination(orders); // pagination reset
  }

  //? --------------------
  //? user click
  //?---------------------
  function handleUserClick(index) {
    const slectedOrder = filteredOrders[index]
    if(slectedOrder){
      setCompleteOrder(filteredOrders[index])
      setBreadCrumb("Order details"); //updating breadcrumb
      setIsInfo(true); //changing view
    }
  }

  //? --------------------
  //? upadting render
  //?---------------------
  useEffect(() => {}, [filteredOrders, orders, orderType, orderStatus, completeOrder]);

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
              <div className="filter-right mx-auto grid grid-cols-5 gap-3 w-2/3">
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
                <button onClick={handleClearFilter} className="font-semibold">
                  <div className="icon"></div>
                  clear
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
                      onClick={()=>handleUserClick(index)}
                      key={index}
                      className="cursor-pointer grid grid-cols-6 w-full p-5 gap-2 "
                    >
                      <div className="overflow-hidden">{order._id}</div>
                      <div className="">
                        {order.firstName} {order.lastName}{" "}
                      </div>
                      <div className="">{parseDate(order.requestedDate)}</div>
                      <div className="">{parseDate(order.requestedDate)}</div>
                      <div className="">{order.total}</div>
                      <button
                        onClick={() => setModalOpen(true)}
                        className={`text-left font-semibold
                          ${order.status === "pending" && "text-[#F6B73C]"}
                          ${order.status === "installed" && "text-[#4C9A2A]"}
                          ${order.status === "completed" && "text-[#4C9A2A]"}
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
        <OrderInfo order={completeOrder} />
      )}
    </>
  );
}

export default ClieentOrders;
