import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useGlobal } from "@/context/GlobalContext";
import { useLocation } from "react-router-dom";

const ResetPassword = ({ setForget }) => {
  const { register, handleSubmit } = useForm();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP + New Password
  const [email, setEmail] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false); // State for showing/hiding password
  const { baseUrl } = useGlobal();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const sendOtp = async (data) => {
    try {
      setLoading(true);
      setEmail(data.email);
      await axios.post(`${baseUrl}/auth/send-otp`, { email: data.email });
      toast.success("otp sent. Please check your gmail");
      setStep(2); // Move to OTP verification step
    } catch (error) {
      toast.error(error.response.data.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div>
      {step === 1 && (
        <form
          className="space-y-6 p-6 rounded-2xl client-form"
          onSubmit={handleSubmit(sendOtp)}
        >
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <label className="pe-4 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Enter your email"
            className="focus:outline-none pt-2 border-b mx-8"
          />
          <button
            disabled={loading}
            className="border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
            type="submit"
          >
            {!loading ? "Send otp" : "sending.."}
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          className="space-y-6 p-6 rounded-2xl client-form"
          onSubmit={handleSubmit(resetPassword)}
        >
          <h2 className="text-xl font-semibold">Verify OTP</h2>
          <div className="grid grid-cols-2 gap-6">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-eye-off"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="border-green-800 font-semibold border text-green-800 px-4 py-2 rounded-md hover:border-green-900"
            type="submit"
          >
            {!loading ? "Reset Password" : "Updating.."}
          </button>
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
