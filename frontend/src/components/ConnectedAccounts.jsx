import React from "react";
import { useAuth } from "../context/AuthContext";
import LinkGoogleAccount from "../auth/LinkGoogleAccount";
import LinkEmail from "../auth/LinkEmail";

const ConnectedAccounts = () => {
  const { currentUser } = useAuth();
  console.log(currentUser)

  return (
    <div className="connected p-6 rounded-2xl client-form flex flex-col gap-6">
      <div className="text-xl font-semibold">Connected accounts</div>
      <div className="flex flex-col gap-4">

        {/* Email Account */}
        <div className="flex items-center w-full ">
          <div className="font-medium w-full sm:w-2/12 ">Email</div>
          <div className="sm:w-5/12">
            {currentUser?.connectedAccounts?.includes("Email") ? (
              <span>{currentUser.email}</span>
            ) : (
              <span className="text-gray-500">Not connected</span>
            )}
          </div>
          <div className="sm:w-5/12">
            {!currentUser?.connectedAccounts?.includes("Email") && <LinkEmail />}
          </div>
        </div>

        {/* Google Account */}
        <div className="flex items-center w-full">
          <div className="font-medium w-full sm:w-2/12 ">Google</div>
          <div className="sm:w-5/12">
            {currentUser?.connectedAccounts?.includes("Google") ? (
              <span>Connected</span>
            ) : (
              <span className="text-gray-500">Not connected</span>
            )}
          </div>
          <div className="sm:w-5/12">
            {!currentUser?.connectedAccounts?.includes("Google") && <LinkGoogleAccount />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;
