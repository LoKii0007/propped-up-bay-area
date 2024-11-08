import React from "react";
import { useAuth } from "../context/AuthContext";
import LinkGoogleAccount from "./LinkGoogleAccount";

const ConnectedAccounts = () => {
  const { currentUser } = useAuth();

  return (
    <div className="connected p-6 rounded-2xl client-form flex flex-col gap-6">
      <div className="text-xl font-semibold">Connected Accounts</div>
      <div className="flex flex-col gap-4">
        {/* Email Account */}
        <div className="grid grid-cols-2 items-center">
          <div className="font-medium">Email</div>
          <div>
            {!currentUser?.googleId ? (
              <span>{currentUser.email}</span>
            ) : (
              <span className="text-gray-500">Not connected</span>
            )}
          </div>
        </div>

        {/* Google Account */}
        <div className="grid grid-cols-2 items-center">
          <div className="font-medium">Google</div>
          <div>
            {currentUser?.googleId ? (
              <span>Connected</span>
            ) : (
              <>
                <span className="text-gray-500">Not connected</span>
                <LinkGoogleAccount />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;
