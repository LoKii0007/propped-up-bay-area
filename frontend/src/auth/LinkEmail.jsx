import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { UseGlobal } from "../context/GlobalContext";

const LinkEmail = () => {
  const [password, setPassword] = useState("");
  const { currentUser, setCurrentUser } = useAuth();
  const { baseUrl } = UseGlobal();
  const [loading, setLoading] = useState(false);
  const [connect, setConnect] = useState(false);

  const handleLinkEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/auth/update/connected-accounts`,
        {
          email: currentUser.email,
          password: password,
          googleId : currentUser.googleId
        },
        { withCredentials: true, validateStatus :(status)=> status < 500 }
      );

      if (response.status === 200) {
        setCurrentUser(response.data.user); // Update the currentUser context
        sessionStorage.setItem('proppedUpUser',JSON.stringify(response.data.user))
        toast.success("Email linked successfully!");
      } else {
        toast.error(response.data.msg ||"Failed to link email. Please try again.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
      console.error("API call error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="link-email">
      {connect ? (
        <form onSubmit={handleLinkEmail} className="flex flex-col gap-4">
          <label htmlFor="password" className="font-medium">
            Enter your password to confirm:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 border bg-[#638856] text-white rounded-md "
            disabled={loading}
          >
            {loading ? "Linking..." : "Link Email"}
          </button>

          <button
            onClick={() => setConnect(!connect)}
            className="px-4 py-2 border border-[#638856] text-[#638856] rounded-md "
          >
            Cancel
          </button>
        </form>
      ) : (
        <button className="px-4 py-1 border border-[#638856] text-[#638856] rounded-md " onClick={() => setConnect(!connect)}>Connect</button>
      )}
    </div>
  );
};

export default LinkEmail;
