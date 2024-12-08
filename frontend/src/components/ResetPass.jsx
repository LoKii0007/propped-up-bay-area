import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobal } from "@/context/GlobalContext";
import { useLocation } from "react-router-dom";
import Loader from "./ui/loader";

const ResetPassword = ({ setForget }) => {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State for showing/hiding password
  const { baseUrl } = useGlobal();
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const location = useLocation()
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const timerRef = useRef(null)

  //?-----------------------------
  //? send otp
  const sendOtp = async (data) => {
    try {
      setOtpLoading(true);
      setEmail(data.email);
      await axios.post(`${baseUrl}/auth/send-otp`, { email: data.email });

      //? clear previous timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      //? reset timer to 5 minutes
      setTimer(300);
      
      //? start new timer
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000)
      toast.success("otp sent. Please check your gmail");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      toast.error(error.response.data.message || "Error sending OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  //?-----------------------------
  //? reset password
  const resetPassword = async (data) => {
    try {
      setLoading(true);
      const payload = { ...data, email };
      await axios.post(`${baseUrl}/auth/reset-pass`, payload, {
        withCredentials: true,
      });
      toast.success("Password reset successfully");
      setForget(false);
    } catch (error) {
      toast.error(error.response.data.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  //?-----------------------------
  //? cleanup timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      {step === 1 && (
        <form
          className="space-y-6 md:p-6 px-3 py-4 rounded-2xl client-form flex flex-col"
          onSubmit={handleSubmit(sendOtp)}
        >
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <div className="w-full flex flex-col md:flex-row gap-4 md:items-center" >
            <label className="pe-4 font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className="focus:outline-none pt-2 border-b sm:mx-8 w-full md:w-1/3 focus:border-b focus:border-green-800"
            />
            <button
              disabled={otpLoading}
              className="border-green-800 font-semibold border text-green-800 px-4 py-2 mt-2 md:mt-0 rounded-md hover:border-green-900"
              type="submit"
            >
              {!otpLoading ? "Send otp" : "sending.."}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          className="space-y-6 md:p-6 px-3 py-4 rounded-2xl client-form" 
          onSubmit={handleSubmit(resetPassword)}
        >
          <h2 className="text-xl font-semibold">Verify OTP</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-4">
            <div className="flex flex-col mt-1 p-2 w-full border rounded-md border-[#E5E7EB ]">
              <label className="text-xs">OTP</label>
              <input
                type="text"
                {...register("otp", { required: true })}
                placeholder="Enter OTP"
                className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700"
              />
            </div>

            <div className="flex flex-col mt-1 p-2 w-full border rounded-md border-[#E5E7EB ]">
              <label className="text-xs">New Password</label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword", { required: true })}
                  placeholder="Enter new password"
                  className="w-full focus:outline-none border-b border-white focus:border-b focus:border-green-700"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showNewPassword ? (
                    <img src="/svg/show.svg" alt="" />
                  ) : (
                    <img src="/svg/hide.svg" alt="" />
                  )}
                </button>
              </div>
            </div>
          </div>


          <div className="timer">{timer > 0 ? `This otp is only valid for ${Math.floor(timer)} seconds.` : "OTP expired, please request a new one."}</div>


          <div className="flex flex-col sm:flex-row sm:items-center items-start gap-4">
          {timer <= 0 && (
            <div
              onClick={() => sendOtp({email})}
              className="border-green-800 cursor-pointer w-[170px] font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
            >
              <div className="flex justify-center items-center w-full ">
                {otpLoading ? <Loader/> : "Request new OTP"}
              </div>
            </div>
          )}

          <button
            disabled={loading}
            className="border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
            type="submit"
          >
            {!loading ? "Reset Password" : "Updating.."}
          </button>
          </div>

          {location.pathname === "reset-pass" && (
            <button
              onClick={() => setForget(false)}
              className="ms-4 py-2 px-4 "
            >
              cancel
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
