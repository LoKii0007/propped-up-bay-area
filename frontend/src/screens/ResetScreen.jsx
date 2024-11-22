import ResetPassword from '@/components/ResetPass'
import React, { useState } from 'react'

const ResetScreen = () => {

  const [flag, setFlag] = useState(false)

  return (
    <>
      <div className="reset w-screen h-screen flex justify-center ">
          <div className='mx-[20%] mt-[7%] w-full ' >
             <ResetPassword setForget={setFlag} />
          </div>
      </div>
    </>
  )
}

export default ResetScreen