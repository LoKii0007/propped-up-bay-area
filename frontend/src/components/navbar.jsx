import React from 'react'
import Dropdown from './dropdown'

function Navbar() {
  return (
    <>
      <nav className='w-screen top-0 h-[8vh] bg-white shadow-md flex items-center justify-between px-12' >
         <div className="nav-left">
            logo
         </div>
         <div className="nav-right">
            <Dropdown/>
         </div>
      </nav>
    </>
  )
}

export default Navbar