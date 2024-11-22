import { useGlobal } from "@/context/GlobalContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const SheetsCallback = () => {
  const [searchParams] = useSearchParams();
  // const { baseUrl } = useGlobal;
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BACKEND_URL

  async function handleSheets() {
    if (created) return;
    const code = searchParams.get("code");
    if (!code) {
      return toast.error("Invalid session");
    }

    try {
      console.log(baseUrl);
      const res = await axios.get(`${baseUrl}/api/sheets/add-callback`, {
        params: { code },
        withCredentials: true,
      });
      if (res.status === 200) {
        console.log(res);
        setCreated(true);
        toast.success("Added successfully");
      }
    } catch (error) {
      console.error("Server error creating new google sheets", error.message);
      toast.error("Server error creating new google sheets");
    } finally {
      navigate('/admin')
    }
  }

  useEffect(() => {
    handleSheets()
    // console.log("url", baseUrl);
  }, []);

  return <div>Loading, Please wait...</div>;
};

export default SheetsCallback;
