import React from 'react'
import { InvoiceTypes } from '../components/Invoices'
import OpenHouseInvoice from '../components/invoices/openHouseInvoice'
import { useLocation, useParams } from 'react-router-dom'
import PostOrderInvoice from '../components/invoices/postOrderInvoice'

function InvoiceDownload() {

    const location = useLocation()
    const InvoiceData =  location.state
    console.log(InvoiceData)

  return (
    <>
      {InvoiceData.typeOf === InvoiceTypes.OPENHOUSE && <OpenHouseInvoice data={InvoiceData} /> }
      {InvoiceData.typeOf === InvoiceTypes.POSTORDER && <PostOrderInvoice data={InvoiceData} /> }
    </>
  )
}

export default InvoiceDownload