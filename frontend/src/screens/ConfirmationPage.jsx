import React, { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";  

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");

    //? check if payment was successfull or not
    if (success) {
      toast.success("Payment successful. Please wait while we process your order.");
      console.log("Payment successful. Please wait while we process your order.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else if (canceled) {
      toast.error("Payment was canceled. Please try again.");
      console.log("Payment was canceled. Please try again.");
      navigate("/");
    }
  }, [location.search]);

  return <div className="w-screen h-screen flex justify-center items-center text-xl" >Loading...</div>;
};

export default ConfirmationPage;
