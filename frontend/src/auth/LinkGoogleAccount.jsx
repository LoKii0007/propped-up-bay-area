import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";
import { useState } from "react";

function LinkGoogleAccount() {
  const { setCurrentUser, currentUser } = useAuth();
  const { baseUrl } = useGlobal();

  const [password, setPassword] = useState(""); // State to store password input
  const [connect, setConnect] = useState(false); // State to toggle connect form
  const [loading, setLoading] = useState(false); // State to handle loading status

  const linkGoogleAccount = async (res) => {
    const decoded = jwtDecode(res.credential);
    if (!decoded) {
      toast.error("Error with Google account connection.");
      return;
    }

    if (currentUser.email !== decoded.email) {
      toast.error("Please add the same email for Google.");
      return;
    }

    // Include password if provided
    const userData = {
      email: currentUser.email,
      googleId: decoded.sub,
      password, // Add password if entered
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/auth/update/connected-accounts`,
        userData,
        {
          withCredentials: true,
          validateStatus: (status) => status < 500,
        }
      );

      if (response.status === 200) {
        setCurrentUser(response.data.user);
        sessionStorage.setItem(
          "proppedUpUser",
          JSON.stringify(response.data.user)
        );
        toast.success("Google account linked successfully!");
      } else {
        toast.error(
          response.data.msg ||
            "Failed to link google account. Please try again."
        );
      }
    } catch (apiError) {
      toast.error("Server error. Please try again.");
      console.error("Server error:", apiError);
    } finally {
      setLoading(false);
    }
  };

  const linkError = () => {
    toast.error("Google account connection failed. Please try again.");
  };

  return (
    <div className="link-google">
      {connect ? (
        <div className="flex flex-col gap-3">
          <div className="password-input flex flex-col gap-3 ">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your password to confirm:
            </label>
            <input
              type="password"
              id="password"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              min={6}
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between gap-3 ">
            <GoogleLogin onSuccess={linkGoogleAccount} onError={linkError} />
            <button
              type="button"
              onClick={() => setConnect(false)}
              className="px-4 py-2 border border-[#638856] text-[#638856] rounded-md "
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="px-4 py-1 border border-[#638856] text-[#638856] rounded-md"
          onClick={() => setConnect(true)}
        >
          Connect
        </button>
      )}
    </div>
  );
}

export default LinkGoogleAccount;
