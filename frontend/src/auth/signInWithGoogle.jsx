
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"

function SignInwithGoogle() {

  const navigate = useNavigate()
  const { currentUser, setCurrentUser, setUserLoggedIn } = useContext(AuthContext)

  function googleLogin() {
     
  }

  return (
    <>
      <div className="google">
        <button className="border-2 flex items-center w-full justify-center gap-4 border-gray-300 rounded-md p-2" onClick={googleLogin}>
          <img src="/google.png" alt="google" className="w-6 h-6" />
          Sign in with Google</button>
      </div>
    </>
  );
}
export default SignInwithGoogle;