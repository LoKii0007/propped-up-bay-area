import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseGlobal } from "../context/GlobalContext";
import SignOutModal from "./signOutModal";

export default function Dropdown({ setActiveView }) {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const { setBreadCrumb, setSettingsActiveView } = UseGlobal();
  const [modalOpen, setModalOpen] = useState(false);

  function handleSignIn(e) {
    e.preventDefault();
    navigate("/signup");
  }

  function handleProfile() {
    setActiveView("settings");
    setBreadCrumb("Settings");
  }

  function handleChangePassword() {
    setActiveView("settings");
    setBreadCrumb("Settings");
    setSettingsActiveView("password");
  }

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            Welcome , {admin ? admin?.email : "Guest"}
            <ChevronDownIcon
              aria-hidden="true"
              className="-mr-1 h-5 w-5 text-gray-400"
            />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="py-1">
            <MenuItem>
              <a
                onClick={handleProfile}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                profile
              </a>
            </MenuItem>
            <MenuItem>
              <a
                onClick={handleChangePassword}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                Change Password
              </a>
            </MenuItem>

            {admin ? (
              <MenuItem>
                <button
                  onClick={() => setModalOpen(true)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  Sign out
                </button>
              </MenuItem>
            ) : (
              <form onSubmit={handleSignIn}>
                <MenuItem>
                  <button
                    type="submit"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  >
                    Sign in
                  </button>
                </MenuItem>
              </form>
            )}
          </div>
        </MenuItems>
      </Menu>

      {/* --------------------------------moadl-------------------------  */}
      <SignOutModal
        setOpen={setModalOpen}
        open={modalOpen}
        text={"You want to sign out?"}
        btnText={"Sign out"}
      />
    </>
  );
}
