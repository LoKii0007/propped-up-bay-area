import React from 'react'
import Dashboard from '../components/dashboard'

function Admin() {
  return (
    <>
      <div className="admin bg-gray-200 w-full h-[92vh] overflow-y-scroll ">
        <div className="pt-5 ">
        <Dashboard/>
        </div>
      </div>
    </>
  )
}

export default Admin