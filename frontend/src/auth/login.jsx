import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import SignInwithGoogle from "./signInWithGoogle";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()  
  const {setCurrentUser, setUserLoggedIn} = useContext(AuthContext)

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await loginUser(email, password)
      if(res.status === 200){
        setCurrentUser(res.data.user)
        setUserLoggedIn(true)
        toast.success("User logged in Successfully")
        navigate('/')
      }else{
        toast.error(res.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto p-6 mt-24 bg-white shadow-md rounded-md">
        <form onSubmit={handleSubmit} className="">
          <h3 className="text-xl font-semibold mb-4 text-center">Login</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>
        <hr />
          <div className="flex  items-center justify-center gap-4 py-4">
            <SignInwithGoogle />

            <p className="text-sm text-gray-500 text-center">
              Dont have an account? <a href="/login" className="text-blue-500 hover:underline">Signin</a>
            </p>
          </div>
      </div>
    </>
  );
}

export default Login;
