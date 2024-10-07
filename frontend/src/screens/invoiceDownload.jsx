import React from 'react'
import { InvoiceTypes } from '../components/Invoices'
import OpenHouseInvoice from '../components/invoices/openHouseInvoice'
import { useLocation, useParams } from 'react-router-dom'
import PostOrderInvoice from '../components/invoices/postOrderInvoice'
import html2pdf from 'html2pdf.js'
import toast from 'react-hot-toast'

function InvoiceDownload() {

    const location = useLocation()
    const InvoiceData =  location.state
    // console.log(InvoiceData)

    var opt = {
      margin: 1,
      filename: 'invoice.pdf',
    }

    function handlesave(type) {
      // console.log('type : ',type)
      const pdf = document.getElementById(type)
      var worker = html2pdf().from(pdf).set(opt).save().then(()=>(toast.success('done')))
      console.log('worker : ',worker)
      // html2pdf(pdf)
    }

  return (
    <>
      <button onClick={()=>handlesave(InvoiceData.typeOf)} >save</button>
      {InvoiceData.typeOf === InvoiceTypes.OPENHOUSE && <OpenHouseInvoice data={InvoiceData} /> }
      {InvoiceData.typeOf === InvoiceTypes.POSTORDER && <PostOrderInvoice data={InvoiceData} /> }
    </>
  )
}

export default InvoiceDownload