import React, { useEffect, useState } from "react";
import OpenHouseInvoice from "./invoices/openHouseInvoice";
import PostOrderInvoice from "./invoices/postOrderInvoice";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useGlobal } from "@/context/GlobalContext";

function UserInvoice() {
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const { baseUrl } = useGlobal();

  async function getInvoice() {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/invoice/open-house-order`, {
        params: { orderId },
        validateStatus: (status) => status < 500,
      });
      if (res.status !== 200) {
        toast.error(res.data.msg || "Error fetching invoice. Please try again");
      } else {
        setInvoiceDetails(res.data.invoice);
      }
    } catch (error) {
      toast.error("Server error. Please try again");
    } finally {
      setLoading(false);
    }
  }

  function handlesave(type) {
    setLoading(true);
    try {
      const pdf = document.getElementById(type);
      html2pdf(pdf).save();
    } catch (error) {
      toast.error("Error downloading invoice", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, [invoiceDetails]);

  useEffect(() => {
    getInvoice();
  }, []);

  if (loading)
    return <div className="w-full text-center py-5">Loading ...</div>;

  return (
    <>
      {invoiceDetails ? (
        <div className="invoice-page flex flex-col mx-0 px-0 gap-6 items-center my-3">
          <div className="inpage-top w-full ">
            {invoiceDetails?.type === "openHouse" && (
              <OpenHouseInvoice data={invoiceDetails} />
            )}
            {invoiceDetails?.type === "postOrder" && (
              <PostOrderInvoice data={invoiceDetails} />
            )}
          </div>
          <div className="inpage-bottom max-w-[790px] flex justify-end w-full">
            <button
              disabled={loading}
              className="py-2 px-5 border-[1px] border-[#00B087] text-[#00B087] rounded-lg"
              onClick={() => handlesave(invoiceDetails.type)}
            >
              Downlaod Invoice
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full p-3">some error occured. Please try again</div>
      )}
    </>
  );
}

export default UserInvoice;
