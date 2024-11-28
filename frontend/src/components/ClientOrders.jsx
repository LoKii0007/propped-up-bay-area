import React, { useState, useEffect } from "react";
import DashboardBtn from "../ui/dashboardBtn";
import Pagination from "./pagination";
import RowHeading from "../ui/rowHeading";
import OrderTypeDropdown from "../ui/orderTypeDropdown";
import { useGlobal } from "../context/GlobalContext";
import OrderInfo from "./OrderInfo";
import toast from "react-hot-toast";
import { parseDate } from "../helpers/utilities";
import StartDatePicker from "./ui/StartDatePicker";
import EndDatePicker from "./ui/EndDatePicker";
import html2pdf from "html2pdf.js";
import OpenHouseInvoice from "./invoices/openHouseInvoice";
import PostOrderInvoice from "./invoices/postOrderInvoice";
import ReactDOM from "react-dom";
import { useAuth } from "@/context/AuthContext";
import FilterModal from "@/ui/FilterModal";

function ClientOrders({ orders, loadingOrders, setOrders, setPostOrders }) {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [orderType, setOrderType] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { setBreadCrumb, isInfo, setIsInfo } = useGlobal();
  const { currentUser } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completeOrder, setCompleteOrder] = useState("");
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
  //? user click
  //?---------------------
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
  useEffect(() => { }, [
    filteredOrders,
    orderType,
    orderStatus,
    completeOrder,
    loadingOrders,
  ]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  //?-------------------------
  //? single invoice download
  function handleInvoiceDownload(data) {
    try {
      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      // Render the appropriate component based on the invoice type
      let element;
      if (data.type === "openHouse") {
        element = <OpenHouseInvoice data={data} />;
      } else if (data.type === "postOrder") {
        element = <PostOrderInvoice data={data} />;
      } else {
        toast.error("Download failed. Please try again");
        return;
      }

      // Render the invoice component
      ReactDOM.render(element, container);

      const invoiceElement = container.firstChild;
      const filename = `${data.type}_invoice.pdf`;

      const options = {
        margin: 1,
        filename,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" },
      };

      // Generate and download PDF
      html2pdf()
        .from(invoiceElement)
        .set(options)
        .save()
        .then(() => {
          toast.success(`Downloaded ${filename}`);
          ReactDOM.unmountComponentAtNode(container);
          document.body.removeChild(container); // Clean up
        })
        .catch((error) => {
          console.error("PDF Generation Error:", error);
          toast.error("Error generating PDF. Please try again.");
        });
    } catch (error) {
      toast.error("Something went wrong");
      console.error("PDF Generation Error:", error);
    }
  }

  return (
    <>
      {!isInfo ? (
        <div className="order-req flex flex-col h-full overflow-y-auto ">

          <div className="req-top mt-4 w-full flex flex-col gap-6 font-medium mb-3 md:mb-6 items-center">
            <div className="w-full flex gap-6 font-medium items-center">
              <div className="filter-left px-5 pe-0 flex md:px-0 w-full md:w-1/3 justify-between items-center ">
                <div className="search rounded-md bg-[#f5f5f5] md:w-full flex items-center px-3">
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
                <button className='text-black font-semibold flex items-center md:hidden px-5 py-2 ' onClick={() => setOpen(true)}>
                  <img src="/svg/filter.svg" alt="filter" />
                </button>

                 {/* --------------------filter modal-------------  */}
                <FilterModal open={open} setOpen={setOpen} setStartDate={setStartDate} setEndDate={setEndDate} startDate={startDate} endDate={endDate} handleClearFilter={handleClearFilter} handleOrderStatus={handleOrderStatus} orderStatus={orderStatus} orderType={orderType} handleOrderType={handleOrderType} />
              </div>
              <div className="filter-right items-center justify-end px-6 hidden  md:flex gap-3 w-2/3">
                <div className="">
                  <OrderTypeDropdown
                    filterType={orderType}
                    handleOrderType={handleOrderType}
                  />
                </div>

                <div className=" grid grid-cols-3 gap-3 items-center border rounded-md px-1 ">
                  <StartDatePicker
                    date={startDate}
                    selectedDate={(newDate) => setStartDate(newDate)}
                  />

                  <EndDatePicker
                    date={endDate}
                    selectedDate={(newDate) => setEndDate(newDate)}
                  />

                  <button
                    onClick={handleDateFilter}
                    className="font-semibold rounded-md py-2 hover:bg-gray-50"
                  >
                    Filter
                  </button>
                </div>

                <button
                  onClick={handleClearFilter}
                  className=" font-semibold rounded-md py-2 px-6 hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="w-full hidden md:grid grid-cols-4 ">
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
              <div className="flex ">
                <div className="order-top text-[#718096] grid grid-cols-2 md:grid-cols-6 gap-2 px-5 w-[95%] ">
                  <RowHeading
                    data={filteredOrders}
                    setFilteredData={setFilteredOrders}
                    filterValue={"name"}
                    text="Name"
                  />
                  <RowHeading
                    data={filteredOrders}
                    setFilteredData={setFilteredOrders}
                    filterValue={"orderNo"}
                    text="OrderId"
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
                <div className="px-5 flex items-center justify-center">
                  <img className="w-full" src="/svg/download2.svg" alt="" />
                </div>
              </div>

              {filteredOrders.length > 0 ? (
                filteredOrders
                  ?.slice(startIndex, endIndex)
                  .map((order, index) => (
                    <div className="flex">
                      <div
                        onClick={() => handleUserClick(index)}
                        key={index}
                        className="cursor-pointer grid grid-cols-2 md:grid-cols-6 w-[95%] custom-transition rounded-md py-2 md:py-5 p-5 gap-2 hover:bg-green-200 "
                      >
                        <div className="overflow-hidden text-sm md:text-base flex items-center gap-2">
                          {currentUser.img && <img className="w-8 h-8 rounded-full" src={currentUser.img} alt="" />}
                          {order.firstName} <span className="hidden md:block"> {order.lastName}</span>
                        </div>
                        <div className="overflow-hidden text-sm md:text-base flex items-center">{order.orderNo}</div>
                        <div className="overflow-hidden hidden md:flex items-center text-sm md:text-base">{parseDate(order.createdAt)}</div>
                        <div className="overflow-hidden hidden md:flex items-center text-sm md:text-base">{parseDate(order.requestedDate)}</div>
                        <div className="overflow-hidden hidden md:flex items-center text-sm md:text-base">$ {order.total}</div>

                        <button
                          className={`text-left font-semibold capitalize hidden md:flex items-center text-sm md:text-base
                          ${order.status === "pending" && "text-[#F6B73C]"}
                          ${order.status === "installed" && "text-[#4C9A2A]"}
                          ${order.status === "completed" && "text-[#4C9A2A]"}
                        }`}
                        >
                          {order.status}
                        </button>
                      </div>
                      <button
                        onClick={() => handleInvoiceDownload(order)}
                        className="px-5"
                      >
                        <img src="/svg/download.svg" alt="" />{" "}
                      </button>
                    </div>
                  ))
              ) : (
                <div className=" text-gray-500 p-12 text-center">
                  {loadingOrders ? "loading..." : "You dont have any orders"}
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
          order={completeOrder}
          setOrders={setOrders}
          setPostOrders={setPostOrders}
        />
      )}
    </>
  );
}

export default ClientOrders;
