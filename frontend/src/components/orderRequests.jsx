import React, { useState, useEffect } from "react";
import Pagination from "./pagination";
import RowHeading from "../ui/rowHeading";
import OrderTypeDropdown from "../ui/orderTypeDropdown";
import OrderStatusdropdown from "../ui/orderStatusdropdown";
import { UseGlobal } from "../context/GlobalContext";
import OrderInfo from "./OrderInfo";
import ChangeStatusModal from "../ui/ChangeStatusModal";
import toast from "react-hot-toast";
import { parseDate } from "../helpers/utilities";
import axios from "axios";

function OrderRequests() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderType, setOrderType] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { setBreadCrumb, isInfo, setIsInfo, baseUrl } = UseGlobal();
  const [completeOrder, setCompleteOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [nextLoading, setnextLoading] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const limit = 20

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
        withCredentials: true, validateStatus : (status) => status < 500
      });
      if (res.status === 200) {
        const allOrders = res.data.orders;
        console.log(allOrders);
        setOrders(allOrders);
        setFilteredOrders(allOrders);
        setTotalPages(Math.ceil(allOrders.length / displayCount));
      }
      else if (res.status === 404) {
        toast.custom(`${res.data.message} || 'no orders found'`);
      }
      else {
        toast.error(`${res.data.message} || 'Unauthorized'`);
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  //? ----------------------------------
  //? loading next orders
  //? ---------------------------------
  async function handleNextOrders() {
    setnextLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/orders/get-all`, {
        params: { page: orderPage + 1, limit },
        withCredentials: true,
        validateStatus : (status) => status < 500
      });
      if (res.status === 200) {
        setOrderPage((prev) => prev + 1);
        const allOrders = [...orders, ...res.data.orders];
        setFilteredOrders(allOrders);
        setOrders(allOrders);
        setTotalPages(Math.ceil(allOrders.length / displayCount));
        resetPagination(allOrders);
        console.log("res : ", allOrders);
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
    handleOrders();
  }, []);

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

  //? --------------------
  //? upadting render
  //?---------------------
  useEffect(() => {}, [
    filteredOrders,
    orders,
    orderType,
    orderStatus,
    completeOrder,
    setOrders
  ]);

  //? --------------------
  //? updating order status
  //?---------------------
  function handleUpdateOrderStatus(index) {
    const slectedOrder = filteredOrders[index];
    if (slectedOrder) {
      setCompleteOrder(filteredOrders[index]);
    }
  }

  return (
    <>
      {!isInfo ? (
        <div className="order-req flex flex-col h-full overflow-y-auto ">
          <div className="req-top mt-4 w-full flex gap-6 font-medium mb-6 items-center">
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
            <div className="filter-right mx-auto grid grid-cols-2 gap-5 w-2/3">
              <OrderTypeDropdown
                filterType={orderType}
                handleOrderType={handleOrderType}
              />
              <OrderStatusdropdown
                filterType={orderStatus}
                handleOrderType={handleOrderStatus}
              />
              {/* <button className="font-semibold">
                <img src="" alt="" />
                Date filters
              </button> */}
            </div>
          </div>

          <div className="req-bottom w-full h-full flex flex-col gap-6 justify-between">
            <div className=" flex flex-col">
              <div className="order-top text-[#718096] grid grid-cols-6 px-5 gap-2">
                <RowHeading
                  data={filteredOrders}
                  setFilteredData={setFilteredOrders}
                  filterValue={"_id"}
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
                    <div key={index} className="flex w-full p-5 gap-2 ">
                      <div
                        onClick={() => handleUserClick(index)}
                        className="cursor-pointer grid grid-cols-5 w-5/6 gap-2"
                      >
                        <div className="overflow-hidden">{order._id}</div>
                        <div className="overflow-hidden">
                          {order.firstName} {order.lastName}
                        </div>
                        <div className="overflow-hidden">
                          {parseDate(order.createdAt)}
                        </div>
                        <div className="overflow-hidden">
                          {parseDate(order.requestedDate)}
                        </div>
                        <div className="overflow-hidden">{order.total}</div>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setModalOpen(true);
                            handleUpdateOrderStatus(index);
                          }}
                          className={`text-left font-semibold capitalize
                            ${order.status === "pending" && "text-[#F6B73C]"}
                            ${order.status === "installed" && "text-[#4C9A2A]"}
                            ${order.status === "completed" && "text-[#4C9A2A]"}
                          }`}
                        >
                          {order.status}
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className=" text-gray-500 p-12 text-center">
                  {loading ? "loading..." : "You don't have any orders yet."}
                </div>
              )}
              {orders.length >= orderPage * limit && currentPage === totalPages && (
                <div className="flex justify-center">
                  <button
                    disabled={nextLoading}
                    onClick={() => handleNextOrders()}
                    className="bg-yellow-500 py-2 px-4 rounded-md my-3 "
                  >
                    {nextLoading ? "loading..." : "Load more"}
                  </button>
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
        <OrderInfo setOrders={setOrders} order={completeOrder} setCompleteOrder={setCompleteOrder} setFilteredOrders={setFilteredOrders} />
      )}

      {/* -------------modal---------------  */}
      <ChangeStatusModal
        order={completeOrder}
        open={modalOpen}
        setOpen={setModalOpen}
        setOrders={setOrders}
        setFilteredOrders={setFilteredOrders}
        setCompleteOrder={setCompleteOrder}
      />
    </>
  );
}

export default OrderRequests;
