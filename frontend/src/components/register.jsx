import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth,db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";


function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");

  async function handleRegister (e) {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
          photo: "",
        });
      }
      console.log("User Registered Successfully!!");
      toast.success("User Registered Successfully!!")
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 mt-24 bg-white shadow-md rounded-md">
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
          Sign Up
        </button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Already registered? <a href="/login" className="text-blue-500 hover:underline">Login</a>
      </p>
    </form>
  );
}

export default Register;
