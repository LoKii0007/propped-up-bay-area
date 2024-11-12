import React, { useState } from "react";
import axios from "axios"; 
import toast from "react-hot-toast";
import { UseGlobal } from "../context/GlobalContext";
import { useAuth } from "../context/AuthContext";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const {baseUrl} = UseGlobal()
  const {setAdmin} = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/auth/admin-login`,
        { email, password },
        { withCredentials: true, validateStatus : (status) => status < 500 }
      );
      if (response.status === 200) {
        toast.success("Login successful");
        setAdmin(response.data.user);
      } else {
        toast.error(response.data.msg || 'Login failed. Please try again');
      }
    } catch (err) {
      toast.error('Server error. Please try again');
      console.log('login failed : ',err.message)
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="fixed flex top-0 left-0 py-6 px-8 bg-transparent">
        <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
        <h2 className="text-2xl text-[26.3px] poppinns-font font-semibold text-[#ffffff]">Propped up</h2>
      </div>

      <div className=" font-inter flex h-screen bg-[#1E5631] w-svw justify-center items-center">
        <div className="flex h-[80%] w-[80%] bg-white rounded-[20px] justify-center items-center">
          <div className="bg-white rounded-[20px] h-[70vh] overflow-hidden flex max-w-4xl">
            <div className="w-1/2 hidden md:block">
              <img
                src="/login-bg.png"
                alt="Mountain landscape"
                className="object-cover h-[70vh]  "
              />
            </div>
            <div className="w-full md:w-1/2 py-16 px-12">
              <div className="flex  justify-center mb-8 w-full">
                <img src="/logo.png" alt="Logo" className="h-8 mr-2" />
                <h2 className="text-2xl text-[26.3px] font-semibold text-[#151D48]">
                  Propped up
                </h2>
              </div>
              <h1 className="text-xl mb-4 text-[#252733] font-semibold w-full text-center">
                Log In to Admin Panel
              </h1>
              <p className="mb-4 text-[#9FA2B4] text-sm w-full text-center">
                {/* Enter your phone number and password below */}
              </p>
              <form onSubmit={handleSubmit}>
                <div className="mt-5 flex flex-col gap-2">
                  <label htmlFor="email" className="form-label">
                    EMAIL
                  </label>
                  <input
                    id="email"
                    className="form-input"
                    type="email"
                    placeholder="Enter your phone number"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <label htmlFor="password" className="form-label">
                    PASSWORD
                  </label>
                  <input
                    id="password"
                    className="form-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mt-8">
                  <button
                    className="bg-gray-900 w-full text-[13px] text-white py-[16px] px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:shadow-outline flex items-center justify-center"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div
                          className="spinner-border animate-spin inline-block w-4 h-4 border-4 border-t-transparent border-gray-100 rounded-full"
                          role="status"
                          aria-hidden="true"
                        ></div>
                      </div>
                    ) : (
                      "Log in"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
