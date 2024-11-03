import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { UseGlobal } from "../context/GlobalContext";
import axios from "axios";

function SignInwithGoogle() {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const { baseUrl } = UseGlobal();

  const loginCredentials = async (res) => {
    console.log(res);
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
      const response = await axios.post(`${baseUrl}/auth/signUp`, userData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        setCurrentUser(response.data.user);
        toast.success("Signup successful! Redirecting...");
        navigate("/");
      } else if (response.status === 400) {
        toast.error(res.data.msg || "User with this email already exists.");
      } else {
        toast.error(res.data.msg || "Signup failed. Please try again.");
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
