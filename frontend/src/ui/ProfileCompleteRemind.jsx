import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const ProfileCompleteRemind = ({ email }) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false)
  console.log(baseUrl);

  const userEmail = email;

  async function handleReminder() {
    setLoading(true)
    const notificationPromise = toast.promise(
      axios.post(
        `${baseUrl}/api/user/send-reminder`,
        { email: userEmail },
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      ),
      {
        loading: "Sending reminder...",
        success: (res) => {
          return res.status === 200
            ? "Notification sent successfully!"
            : "Error sending notification!";
        },
        error: "Server error. Please try again.",
      }
    );

    try {
      const res = await notificationPromise;
      if (res.status !== 200) {
        toast.error(
          res.data.msg || "Error sending notification. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log("Received email:", email);
  }, [email]);

  return (
    <div className="w-full flex flex-col justify-center items-center h-full text-xl font-medium gap-10">
      <div>The user’s profile is not fully completed yet.</div>
      <button
       disabled={loading}
        onClick={() => handleReminder()}
        className="bg-[#34CAA5] px-6 py-2 text-lg text-white rounded-md shadow-sm"
      >
        Send reminder
      </button>
    </div>
  );
};

export default ProfileCompleteRemind;
