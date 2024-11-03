import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { UseGlobal } from "../context/GlobalContext";

function LoginWithGoogle() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { baseUrl } = UseGlobal();

  const loginCredentials = async (res) => {
    const decoded = jwtDecode(res.credential);
    if (!decoded) {
      toast.error("Google login failed. Please try again.");
    }
    const userData = {
      email: decoded.email,
      googleId: decoded.sub,
    };
    console.log("userdata", userData);
    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        { email: userData.email, googleId: userData.googleId },
        { withCredentials: true }
      );
      if (response.status === 400) {
        toast.error(`${response.data.msg || "Invalid credentials."}`);
        return;
      }
      if (response.status === 200) {
        setCurrentUser(response.data.user);
        navigate("/");
        return;
      }
      toast.error("Google login failed. Please try again.");
      console.log(response.data.msg);
    } catch (error) {
      toast.error("Google login failed. Please try again.");
      console.log(response.data.msg);
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
