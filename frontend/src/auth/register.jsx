import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import SignInwithGoogle from "./signInWithGoogle";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../api/auth";
import ProppedUpLogo from "../ui/proppedUpLogo";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("")
  const [agreeTerms, setAgreeterms] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setCurrentUser, setUserLoggedIn, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true)
    // if(!agreeTerms) {
    //   return
    // }
    const userData = {
      firstName: fname,
      lastName: lname,
      email: email,
      password: password,
    }

    const res = await registerUser(userData);
    if (res.status === 201) {
      toast.success("User registered successfully");
      setCurrentUser(res.data.user)
      setUserLoggedIn(true);
      navigate("/");
    } else {
      toast.error('something went wrong');
    }
    setLoading(false)
  }

  return (
    <>
      <ProppedUpLogo/>
      <div className="min-h-screen flex items-center justify-center bg-[#4c9a2a10]">
        <div className="flex bg-white shadow-lg rounded-[20px] w-[90%] md:w-[80%] lg:w-[70%] justify-center items-center">
          <div className="signup-client w-[90%] md:w-[90%] lg:w-3/4 flex justify-center items-center py-10 gap-8">
            {/* Image section */}
            <div className="hidden md:flex md:w-1/2">
              <img
                className=" h-full w-full"
                src="/signup-bg.png"  // Replace with the path to your image
                alt="House"
              />
            </div>

            {/* Form section */}
            <div className="w-[90%] md:w-1/2 py-10">
              <div className="flex justify-center items-center gap-5">
                <img src="/logo.png" alt="Propped up Logo" className="h-10 mb-4" />
                <h3 className="text-2xl font-semibold">Propped up</h3>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 mt-6">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="First name"
                    className="w-1/2 px-4 py-2 border rounded-md"
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    className="w-1/2 px-4 py-2 border rounded-md  "
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-md"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="flex items-center mt-2 px-2 ">
                  <input onChange={(e) => setAgreeterms(e.target.value)} type="checkbox" className="h-4 w-4 text-green-600" required />
                  <label className="ml-2 text-sm text-gray-600">
                    By proceeding you agree to the{" "}
                    <a href="/terms" className="text-green-600 hover:underline">
                      Terms and Conditions
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#4C9A2A] text-white font-semibold rounded-md hover:bg-green-600 focus:ring focus:ring-green-200"
                >
                  {loading ? "Signing up..." : "Sign up with email"}
                </button>
              </form>

              <div className="grid grid-cols-3 text-[12px] my-4" >
                <div className="justify-center items-center flex w-full " >
                  <div className="h-[1px] w-3/4 bg-gray-300 " ></div>
                </div>
                <p className="text-center" >Or signup with</p>
                <div className="justify-center items-center flex w-full " >
                  <div className="h-[1px] w-3/4 bg-gray-300 " ></div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                {/* <button className="px-4 py-2 bg-gray-100 border rounded-lg">
                <img src="/google-icon.png" alt="Google" className="h-6 w-6" />
              </button>
              <button className="px-4 py-2 bg-gray-100 border rounded-lg">
                <img src="/apple-icon.png" alt="Apple" className="h-6 w-6" />
              </button> */}
                <SignInwithGoogle />
              </div>

              <p className="text-sm text-center mt-4 text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-green-600 hover:underline">
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
