import React, { useEffect, useState } from "react";
import OpenHouseInvoice from "./invoices/openHouseInvoice";
import PostOrderInvoice from "./invoices/postOrderInvoice";
import html2pdf from "html2pdf.js";
import toast from "react-hot-toast";

function InvoiceDownload({ invoiceDetails }) {
  
  var opt = {
    margin: 1,
    filename: "invoice.pdf",
  };

  const [loading, setLoading] = useState(false);

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

  if (!invoiceDetails) return <>loading ...</>;
  return (
    <>
      <div className="invoice-page flex flex-col gap-6 items-center ">
        <div className="inpage-top w-full ">
          {invoiceDetails.type === "openHouse" && (
            <OpenHouseInvoice data={invoiceDetails} />
          )}
          {invoiceDetails.type === "postOrder" && (
            <PostOrderInvoice data={invoiceDetails} />
          )}
        </div>
        <div className="inpage-bottom max-w-[790px] flex justify-end w-full">
          <button
            disabled={loading}
            className="py-2 px-5 border-[1px] border-[#00B087] text-[#00B087] rounded-lg"
            onClick={() => handlesave(invoiceDetails.type)}
          >
            Download Invoice
          </button>
        </div>
      </div>
    </>
  );
}

export default InvoiceDownload;
