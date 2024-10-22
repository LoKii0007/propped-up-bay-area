import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import SignOutModal from "./signOutModal";

function ActionsDropdown({}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <Menu as="div" className="relative inline-block py-1">
        <div>
          <MenuButton className="inline-flex capitalize w-full justify-center gap-x-1.5 border-[1px] border-[#34CAA5] rounded-md px-3 py-2 text-sm font-semibold text-[#718096] hover:bg-gray-50">
            More actions
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
          <div className="py-3 flex flex-col gap-2 ">
            <MenuItem>
              {({ close }) => (
                <button
                  className="flex px-3 gap-3 items-center text-[#718096] hover:text-black hover:bg-gray-300 py-2 "
                  onClick={() => {
                    close(); // Closes the dropdown
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-circle-user-round"
                  >
                    <path d="M18 20a6 6 0 0 0-12 0" />
                    <circle cx="12" cy="10" r="4" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  Edit details
                </button>
              )}
            </MenuItem>

            <MenuItem>
              {({ close }) => (
                <button
                  className="flex px-3 gap-3 items-center text-[#718096] hover:text-black hover:bg-gray-300 py-2 "
                  onClick={() => {
                    setModalOpen(true); //opens modal
                    close(); // Closes the dropdown
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-trash-2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" x2="10" y1="11" y2="17" />
                    <line x1="14" x2="14" y1="11" y2="17" />
                  </svg>
                  Delete user
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>

      {/* ------------------- modal ------------- */}
      <SignOutModal
        setOpen={setModalOpen}
        open={modalOpen}
        text={"You want to delete this user, this action is irreversible"}
        btnText={"delete"}
      />
    </>
  );
}

export default ActionsDropdown;
