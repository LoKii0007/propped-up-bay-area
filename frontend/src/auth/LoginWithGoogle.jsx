import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useGlobal } from "../context/GlobalContext";

function LoginWithGoogle() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { baseUrl } = useGlobal();

  const loginCredentials = async (res) => {

    // loading data via google
    const decoded = jwtDecode(res.credential);
    if (!decoded) {
      toast.error("Google login failed. Please try again.");
    }
    const userData = {
      email: decoded.email,
      googleId: decoded.sub,
    };
    console.log("userdata", userData);

    // api call
    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        { email: userData.email, googleId: userData.googleId },
        { withCredentials: true, validateStatus : (status) => status < 500 }
      )
      if (response.status === 200) {
        setCurrentUser(response.data.user);
        navigate("/");
      }else{
        toast.error( response.data.msg ||"Google login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    }
  };

  const loginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return (
    <>
      <div className="google">
        <GoogleLogin onSuccess={loginCredentials} onError={loginError} />
      </div>
    </>
  );
}
export default LoginWithGoogle;
