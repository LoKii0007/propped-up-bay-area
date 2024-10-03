import React from 'react'
import Dropdown from '../ui/dropdown'
import { useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()
  function handleNavigate(){
    navigate('/')
  }

  return (
    <>
      <nav className='w-screen top-0 h-[8vh] bg-white shadow-md flex items-center justify-between px-12' >
         <button onClick={handleNavigate} className="nav-left">
            logo
         </button>
         <div className="nav-right">
            <Dropdown/>
         </div>
      </nav>
    </>
  )
}

export default Navbar