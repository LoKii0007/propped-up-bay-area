
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { jwtDecode } from "jwt-decode"

function SignInwithGoogle() {

  const navigate = useNavigate()

  const loginCredentials = async (res) => {
    console.log(res)
    const decoded = jwtDecode(res.credential)
    console.log(' : ', decoded)
    localStorage.setItem('google', decoded)
  }

  const loginError = () => {
    toast.error('something went wrong')
    console.log("login failed")
  }


  return (
    <>
      <div className="google">
        <GoogleLogin onSuccess={loginCredentials} onError={loginError} />
      </div>
    </>
  );
}
export default SignInwithGoogle;