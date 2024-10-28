import React, { useEffect, useState } from 'react'
import { InvoiceTypes } from './Invoices'
import OpenHouseInvoice from './invoices/openHouseInvoice'
import PostOrderInvoice from './invoices/postOrderInvoice'
import html2pdf from 'html2pdf.js'
import toast from 'react-hot-toast'

function InvoiceDownload({invoiceDetails}) {

  var opt = {
    margin: 1,
    filename: 'invoice.pdf',
  }

  const [loading, setLoading] = useState(false)

  function handlesave(type) {
    setLoading(true)
    const pdf = document.getElementById(type)
    html2pdf(pdf).save()
    setLoading(false)
  }

  useEffect(()=>{}, [invoiceDetails])

  if(!invoiceDetails) return(
    <>loading ...</>
  )
  return (
    <>
      <div className="invoice-page flex flex-col gap-6 items-center ">
        <div className="inpage-top">
          {invoiceDetails.type === InvoiceTypes.OPENHOUSE && <OpenHouseInvoice data={invoiceDetails} />}
          {invoiceDetails.type === InvoiceTypes.POSTORDER && <PostOrderInvoice data={invoiceDetails} />}
        </div>
        <div className="inpage-bottom max-w-[790px] flex justify-end w-full">
          <button disabled={loading} className='py-2 px-5 border-[1px] border-[#00B087] text-[#00B087] rounded-lg' onClick={() => handlesave(invoiceDetails.type)} >Downlaod Invoice</button>
        </div>
      </div>
    </>
  )
}

export default InvoiceDownload