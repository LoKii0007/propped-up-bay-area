import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { useGlobal } from "../context/GlobalContext";
import axios from "axios";

function SignInwithGoogle() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { baseUrl } = useGlobal();

  const loginCredentials = async (res) => {
    // console.log(res);
    const decoded = jwtDecode(res.credential); // decodeiing google credentials
    if (!decoded) {
      toast.error("some error ocuured");
    }
    const userData = {
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      email: decoded.email,
      googleId: decoded.sub,
    };

    try {
      const res = await axios.post(`${baseUrl}/auth/sign-up`, userData, {
        withCredentials: true, validateStatus : (status) => status < 500
      });

      if (res.status === 201) {
        setCurrentUser(res.data.user);
        toast.success("Signup successful! Redirecting...");
        navigate("/");
      } else {
        toast.error(res.data.msg || "Google signup failed. Please try again.");
      }
    } catch (apiError) {
      toast.error("Server error. Please try again.");
      console.log("API call error:", apiError);
    }
  };

  const loginError = () => {
    toast.error("Google signup failed. Please try again.");
  };

  return (
    <>
      <div className="google">
        <GoogleLogin onSuccess={loginCredentials} onError={loginError} />
      </div>
    </>
  );
}
export default SignInwithGoogle;
