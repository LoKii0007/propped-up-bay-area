import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import RowHeading from "../ui/rowHeading";
import OrderTypeDropdown from "../ui/orderTypeDropdown";
import OrderStatusdropdown from "../ui/orderStatusdropdown";
import { useGlobal } from "../context/GlobalContext";
import OrderInfo from "./OrderInfo";
import toast from "react-hot-toast";
import { parseDate } from "../helpers/utilities";
import axios from "axios";
import ChangeStatusDropdown from "../ui/ChangeStatusDropdown";
import StatusDropdown from "./StatusDropdown";
import FilterModal from "@/ui/FilterModal";

function OrderRequests({ orders, setOrders, totalOrderCount }) {
  // const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderType, setOrderType] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { setBreadCrumb, isInfo, setIsInfo, baseUrl, breadcrumb } = useGlobal();
  const [completeOrder, setCompleteOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [nextLoading, setnextLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const limit = 10;
  // const [totalOrderCount, setTotalOrderCount] = useState(0)
  // orders, setOrders, totalOrderCount
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [open, setOpen] = useState(false)

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

  //? ----------------------------------
  //? loading initial orders
  //? ---------------------------------
  async function handleOrders() {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/orders/get-all`, {
        params: { page: orderPage, limit },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      if (res.status === 200) {
        const allOrders = res.data.orders;
        console.log(allOrders);
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        setTotalPages(Math.ceil(allOrders.length / displayCount));
        setTotalOrderCount(res.data.count);
      } else if (res.status === 404) {
        toast.custom(res.data.message || "no orders found");
      } else {
        toast.error(res.data.message || "Unauthorized");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  //? ----------------------------------
  //? loading next orders
  async function handleNextOrders() {
    setnextLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/orders/get-all`, {
        params: { page: orderPage + 1, limit },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      if (res.status === 200) {
        setOrderPage((prev) => prev + 1);
        const updatedOrders = [...orders, ...res.data.orders];

        setOrders(updatedOrders);

        setFilteredOrders(updatedOrders);

        setTotalPages(Math.ceil(updatedOrders.length / displayCount));
        // resetPagination(updatedOrders);
        // console.log("res : ", updatedOrders);
      } else {
        toast(res.data.message || "no more orders found");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setnextLoading(false);
    }
  }

  //? ----------------------------------
  //? loading next post orders
  async function handleNextPostOrders() {
    setnextLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/orders/admin-post-orders`, {
        params: { page: orderPage + 1, limit },
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });
      if (res.status === 200) {
        setOrderPage((prev) => prev + 1);
        const updatedOrders = [...orders, ...res.data.orders];

        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);

        setTotalPages(Math.ceil(updatedOrders.length / displayCount));
        // resetPagination(updatedOrders);
        // console.log("res : ", updatedOrders);
      } else {
        toast(res.data.message || "no more orders found");
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setnextLoading(false);
    }
  }

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

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
  useEffect(() => {
    if (orders.length === 0) {
      return;
    }
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
      setFilteredOrders(orders);
    } else {
      // applying the clicked filter
      filtered = filtered.filter(
        (order) => order.type.toLowerCase() === type.toLowerCase()
      );
      setFilteredOrders(filtered);
    }

    resetPagination(filtered); // reset pagination
  };

  function handleUserClick(index) {
    const slectedOrder = filteredOrders[index];
    if (slectedOrder) {
      setCompleteOrder(filteredOrders[index]);
      setBreadCrumb("Order details"); //updating breadcrumb
      setIsInfo(true); //changing view
    }
  }

  //? -------------------------
  //? filter - date range
  //?--------------------------
  function handleDateFilter() {
    if (!startDate || !endDate) {
      toast("Please select date range !");
      return;
    }

    console.log("date : ", parseDate(startDate));
    const filtered = orders.filter((order) => {
      const orderDate = parseDate(order.requestedDate);
      return (
        orderDate >= parseDate(startDate) && orderDate <= parseDate(endDate)
      );
    });

    setFilteredOrders(filtered);
    resetPagination(filtered);
  }

    //? -------------------------
  //? filter - clear
  //?--------------------------
  function handleClearFilter() {
    setOrderStatus("all");
    setOrderType("all");
    setStartDate("");
    setEndDate("");
    setFilteredOrders(orders);
    resetPagination(orders); // pagination reset
  }

  //? --------------------
  //? upadting render
  //?---------------------
  useEffect(() => {}, [
    filteredOrders,
    orderType,
    orderStatus,
    completeOrder,
    breadcrumb,
  ]);

  return (
    <>
      {!isInfo ? (
        <div className="order-req flex flex-col h-full overflow-y-auto ">
          <div className="req-top mt-4 px-4 w-full flex gap-6 font-medium mb-6 items-center justify-between ">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by anything..."
                />
              </div>
            </div>

            {/* <div className="filter-right flex w-2/3">
              <OrderTypeDropdown
                filterType={orderType}
                handleOrderType={handleOrderType}
              />
              <OrderStatusdropdown
                filterType={orderStatus}
                handleOrderType={handleOrderStatus}
              />
            </div> */}

            <button
                className="text-black font-semibold flex items-center border border-black rounded-md px-5 md:px-8 py-2 "
                onClick={() => setOpen(true)}
              >
                {/* <img src="/svg/filter.svg" alt="filter" /> */}
                Filters
              </button>

              {/* --------------------filter modal-------------  */}
              <FilterModal
                open={open}
                setOpen={setOpen}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                startDate={startDate}
                endDate={endDate}
                handleClearFilter={handleClearFilter}
                handleOrderStatus={handleOrderStatus}
                orderStatus={orderStatus}
                orderType={orderType}
                handleOrderType={handleOrderType}
                handleDateFilter={handleDateFilter}
              />
          </div>

          <div className="req-bottom w-full h-full flex flex-col gap-6 justify-between">
            <div className=" flex flex-col">
              <div className="order-top text-[#718096] flex w-full px-5 gap-2">
                <div className="grid grid-cols-5 gap-2 w-5/6 ">
                  <RowHeading
                    data={filteredOrders}
                    setFilteredData={setFilteredOrders}
                    filterValue={"orderNo"}
                    text="OrderId"
                  />
                  <RowHeading
                    data={filteredOrders}
                    setFilteredData={setFilteredOrders}
                    filterValue={`firstName lastName`}
                    text="Name"
                  />
                  <RowHeading
                    data={filteredOrders}
                    setFilteredData={setFilteredOrders}
                    filterValue={"createdAt"}
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
                    filterValue={"total"}
                    text="Amount"
                  />
                </div>
                <div className="w-1/6">
                  <RowHeading
                    data={filteredOrders}
                    setFilteredData={setFilteredOrders}
                    filterValue={"status"}
                    text="Status"
                  />
                </div>
              </div>
              {filteredOrders.length > 0 ? (
                filteredOrders
                  ?.slice(startIndex, endIndex)
                  .map((order, index) => (
                    <div key={index} className="flex w-full px-5 ps-0 gap-2 ">
                      <div
                        onClick={() => handleUserClick(index)}
                        className="cursor-pointer grid grid-cols-5 w-5/6 py-5 gap-2 ps-5 custom-transition hover:shadow-md rounded-md hover:bg-green-100"
                      >
                        <div className="overflow-hidden text-ellipsis text-nowrap ">
                          {order.orderNo}
                        </div>
                        <div className="overflow-hidden text-nowrap text-ellipsis">
                          {order.firstName} {order.lastName}
                        </div>
                        <div className="overflow-hidden">
                          {parseDate(order.createdAt)}
                        </div>
                        <div className="overflow-hidden">
                          {parseDate(order.requestedDate)}
                        </div>
                        <div className="overflow-hidden">$ {order.total}</div>
                      </div>
                      <div
                        className={`text-left font-semibold capitalize w-1/6 flex items-center rounded-md
                          ${order.status === "pending" && "text-yellow-500"}
                          ${order.status === "installed" && "text-blue-500"}
                          ${order.status === "completed" && "text-green-500"}
                        }`}
                      >
                        <StatusDropdown
                          order={order}
                          setOrders={setOrders}
                          setFilteredOrders={setFilteredOrders}
                          setCompleteOrder={setCompleteOrder}
                          status={order.status}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <div className=" text-gray-500 p-12 text-center">
                  {loading ? "loading..." : "You don't have any orders yet."}
                </div>
              )}

              {/* ---------------load more button -------------- */}
              {orders.length < totalOrderCount &&
                 (
                  <div className="flex justify-center">
                    {breadcrumb === "Order requests" ? (
                      <button
                        disabled={nextLoading}
                        onClick={() => handleNextOrders()}
                        className="bg-yellow-500 py-2 px-4 rounded-md my-3 "
                      >
                        {nextLoading ? "loading..." : "Load more"}
                      </button>
                    ) : (
                      <button
                        disabled={nextLoading}
                        onClick={() => handleNextPostOrders()}
                        className="bg-yellow-500 py-2 px-4 rounded-md my-3 "
                      >
                        {nextLoading ? "Loading..." : "Load more"}
                      </button>
                    )}
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
        <OrderInfo
          setOrders={setOrders}
          order={completeOrder}
          setCompleteOrder={setCompleteOrder}
          setFilteredOrders={setFilteredOrders}
        />
      )}
    </>
  );
}

export default OrderRequests;
