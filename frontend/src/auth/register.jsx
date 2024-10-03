
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import SignInwithGoogle from "./signInWithGoogle";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { registerUser } from "../api/auth";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser, setCurrentUser, setUserLoggedIn } = useContext(AuthContext)

  const navigate = useNavigate()

  async function handleRegister(e){
    e.preventDefault()
    const userData = {
      firstName: fname,
      lastName: lname,
      email: email,
      password: password
    }
    const res = await registerUser(userData)
    console.log('res : ', res)
    if(res.status === 201){
      toast.success('User registered successfully')
      setCurrentUser(res.data.user)
      setUserLoggedIn(true)
      navigate('/')
    }else{
      toast.error(res.message)
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto p-6 mt-24 bg-white shadow-md rounded-md">
        <form onSubmit={handleRegister} className="">
          <h3 className="text-xl font-semibold mb-4 text-center">Sign Up</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="First name"
              onChange={(e) => setFname(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Last name"
              onChange={(e) => setLname(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600">
              {loading ? 'signing up...' : 'Sign Up'}
            </button>
          </div>

        </form>

        <hr />

        <div className="flex  items-center justify-center gap-4 py-4">
          <SignInwithGoogle />

          <p className="text-sm text-gray-500 text-center">
            Already registered? <a href="/login" className="text-blue-500 hover:underline">Login</a>
          </p>
        </div>
      </div>
    </>

  );
}

export default Register;
