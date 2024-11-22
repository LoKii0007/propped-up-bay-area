import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobal } from "../context/GlobalContext";

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { baseUrl } = useGlobal();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const checkPaymentStatus = async () => {
    if (orderPlaced) return;
    
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      toast.error("Session ID not found.");
      setLoading(false);
      return;
    }

    //?------ Proceed to place the order-------------
    try {
      const orderData = JSON.parse(sessionStorage.getItem("orderData"));
      const res = await axios.post(
        `${baseUrl}/api/orders/${ location.pathname.includes('openHouse') ? 'open-house-order' : 'post-order'}`,
        orderData,
        { params: { sessionId }, withCredentials: true, validateStatus : (status) => status < 500 }
      );
      if (res.status === 201) {
        setOrderPlaced(true)
        toast.success(res.data.msg || "Order placed successfully", { position: "top-right" });
      } else {
        toast.error(res.data.msg || "Error placing order", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Server error while placing order", {
        position: "top-right",
      });
    } finally {
      sessionStorage.removeItem('orderData')
      navigate("/");
    }
  };

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    //? check if payment was successfull or not
    if (success) {
      checkPaymentStatus();
    } else if (canceled) {
      toast.error("Payment was canceled. Please try again.");
      navigate("/");
    }
  }, [location.search]);

  return <div className="w-screen h-screen flex justify-center items-center text-xl" >Loading...</div>;
};

export default ConfirmationPage;
