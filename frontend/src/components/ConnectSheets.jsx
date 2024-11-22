import { useGlobal } from "@/context/GlobalContext";
import axios from "axios";
import React, { useState } from "react";

const ConnectSheets = () => {

    const {baseUrl} = useGlobal()

  async function handleSheet() {
    try {
        const res = await axios.get(`${baseUrl}/api/sheets/auth`, {withCredentials : true})

        if(res.status === 200){
            window.location.href = res.data.url
        }
    } catch (error) {
        console.error('Server error creating new google sheets', error.message)
        toast.error('Server error creating new google sheets')
    }
  }

  return (
    <>
      <div className="sheets flex flex-col w-full h-full py-12 px-10 gap-12 ">
        <div className="sheet-top px-[5%] text-center ">
          Google Sheets is a powerful data management tool that helps you
          organize important data and collaborate with others. Integrate Jotform
          with Google Sheets to automatically sync form submissions to your
          spreadsheets and update your data in real time.
        </div>
        <div className="sheet-bottom py-5 gap-6 flex flex-col">
            <div className="font-semibold text-2xl " >Choose an action</div>
            <div className="w-full text-center" >
            <button onClick={()=>handleSheet()} className="font-semibold rounded-md border-2 py-2 px-10 border-black " >Connect a new account</button>
            </div>
        </div>  
      </div>
    </>
  );
};

export default ConnectSheets;
