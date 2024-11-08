import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { UseGlobal } from "../context/GlobalContext";
import axios from "axios";

function LinkGoogleAccount() {
  const { setCurrentUser, currentUser } = useAuth();
  const { baseUrl } = UseGlobal();

  const linkGoogleAccount = async (res) => {
    const decoded = jwtDecode(res.credential);
    if (!decoded) {
      toast.error("Error with Google account connection.");
      return;
    }

    if(currentUser.email !== decoded.email){
        toast.error('Please add the same email for google')
        return
    }

    const userData = {
      email: currentUser.email, // Ensure we're updating the existing user's email
      googleId: decoded.sub,
    };

    try {
      const response = await axios.post(`${baseUrl}/auth/updateAuth`, userData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setCurrentUser(response.data.user);
        toast.success("Google account linked successfully!");
      } else if (response.status === 404) {
        toast.error("User not found. Please sign up first.");
      } else {
        toast.error("Failed to link Google account. Please try again.");
      }
    } catch (apiError) {
      toast.error("Server error. Please try again.");
      console.error("API call error:", apiError);
    }
  };

  const linkError = () => {
    toast.error("Google account connection failed. Please try again.");
  };

  return (
    <div className="link-google">
      <GoogleLogin onSuccess={linkGoogleAccount} onError={linkError} />
    </div>
  );
}

export default LinkGoogleAccount;
