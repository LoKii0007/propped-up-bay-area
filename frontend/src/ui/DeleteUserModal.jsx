import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { useGlobal } from "../context/GlobalContext";

const DeleteUserModal = ({ open, setOpen, setUsers, userId }) => {
  const [loading, setLoading] = useState(false);
  const {baseUrl, setIsInfo, setTotalUserCount, setBreadCrumb, adminActiveView } = useGlobal()

  async function handleDeleteUser() {
    setLoading(true)
    try {
      const res = await axios.post(
        `${baseUrl}/api/user/delete`,
        { userId },
        {
          withCredentials: true,
          validateStatus: function (status) {
            return status < 500; // Reject only if the status code is greater than or equal to 500
          },
        }
      )
      if(res.status !== 200 ){
        toast.error(res.data.msg || 'Error deleting user. Please try again' )
      }
      toast.success('User deleted')
      setUsers((prev)=> prev.filter((user)=>user._id !== userId) )
      setTotalUserCount((prev)=>prev-1)
      setBreadCrumb(adminActiveView)
      setIsInfo(false) 
    } catch (error) {
      toast.error(res.data.msg || 'Server Error deleting user. Please try again' )
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full ">
                    <DialogTitle
                      as="h3"
                      className="text-base text-center font-semibold leading-6 w-full text-gray-900"
                    >
                      Are you sure?
                    </DialogTitle>
                    <div className="mt-2 text-center w-full">
                      <p className="text-sm text-gray-500">
                        You want to delete this user.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:flex w-full justify-center sm:flex-row-reverse sm:px-6">
                <button
                  disabled={loading}
                  type="button"
                  onClick={() => handleDeleteUser()}
                  className="inline-flex w-full justify-center rounded-md bg-[#00B087] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00b087d3] sm:ml-3 sm:w-auto"
                >
                  {loading ? "Deleting..." : "Delete user"}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteUserModal;
