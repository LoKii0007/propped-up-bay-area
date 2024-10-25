import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

function SignInwithGoogle() {
  const navigate = useNavigate();
  const {setCurrentUser} = useAuth()

  const loginCredentials = async (res) => {
    console.log(res);
    const decoded = jwtDecode(res.credential);
    if (!decoded) {
      toast.error("some error ocuured");
    }
    const userData = {
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      email: decoded.email,
      googleId: decoded.sub,
    };
    const response = await registerUser(userData);
    if (!response) {
      toast.error("something went wrong!");
    }
    if (response.status === 400) {
      toast.error("user with the email already exist");
      return;
    }
    if (response.status === 201) {
      setCurrentUser(response.data.user)
      navigate("/");
      return;
    }
    toast.error("something went wrong!");
    console.log(response.data.message);
  };

  const loginError = () => {
    toast.error("something went wrong");
    console.log("login failed");
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
