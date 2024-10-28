import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProppedUpLogo from "../ui/proppedUpLogo";
import Cookies from "js-cookie";
import LoginWithGoogle from "./LoginWithGoogle";
import axios from "axios";
import { UseGlobal } from "../context/GlobalContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser, setUserLoggedIn, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const {baseUrl} = UseGlobal()

  useEffect(() => {
    const token = Cookies.get("authToken");
    console.log("token ", token);
    if (token) {
      navigate("/"); // Redirect to home if token exists
    }
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        Cookies.set("authToken", res.data.token); //setting cookie
        //? navigate to signup details if profile completed is false
        if (!res.data.user.profileCompleted) {
          navigate("/signup/details", { state: { user: res.data.user } });
          return;
        }
        setCurrentUser(res.data.user); //? setting up current user
        setUserLoggedIn(true);
        toast.success("User logged in Successfully");
        navigate("/"); //? navigate to home page
      } else {
        toast.error("something went wrong, try again later");
      }
    } catch (error) {
      toast.error("something went wrong, try again later");
      console.log("something went wrong, try again later");
    }
    setLoading(false);
  }

  return (
    <>
      <ProppedUpLogo />

      <div className="min-h-screen flex items-center justify-center bg-[#4c9a2a10]">
        <div className="flex bg-white shadow-lg rounded-[20px] w-[70%] justify-center items-center">
          <div className="login-client w-[50vw] flex justify-center items-center py-10 gap-8">
            <div className="hidden md:flex md:w-1/2">
              <img
                className="rounded-l-lg h-[60vh] w-full"
                src="/signup-bg.png"
                alt="House"
              />
            </div>
            <div className="w-[90%] sm:w-3/4 lg:w-1/2 flex flex-col gap-4 py-8">
              <div className="flex items-center justify-center mb-6 gap-5">
                <img src="/logo.png" alt="Propped up Logo" className="h-10" />
                <h3 className="font-semibold text-2xl ">Propped up</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#101010]">
                    Email
                  </label>
                  <input
                    type="email"
                    aria-label="Email"
                    className="mt-1 block w-full p-2 border border-gray-300 bg-[#FCFDFE] rounded-md shadow-sm "
                    placeholder="someone@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#101010]">
                    Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 block w-full p-2 border border-gray-300 bg-[#FCFDFE] rounded-md shadow-sm "
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-2 px-4 bg-[#4C9A2A] text-white font-semibold rounded-md shadow-sm hover:bg-green-600"
                >
                  {loading ? "submitting..." : "Log In"}
                </button>
              </form>
              <div className="grid grid-cols-3 text-[12px] ">
                <div className="justify-center items-center flex w-full ">
                  <div className="h-[1px] w-3/4 bg-gray-300 "></div>
                </div>
                <p className="text-center">Or Login with</p>
                <div className="justify-center items-center flex w-full ">
                  <div className="h-[1px] w-3/4 bg-gray-300 "></div>
                </div>
              </div>
              <div className="w-full flex flex-col items-center justify-center gap-5">
                <LoginWithGoogle />
                <p className="text-sm text-gray-500 text-center">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-green-500 hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
