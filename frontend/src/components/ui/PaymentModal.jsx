
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Loader from "./loader";

const PaymentModal = ({ open , setOpen, handleSubmit, loading, loading2 }) => {

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center w-full justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full ">
                    <DialogTitle
                      as="h3"
                      className="text-base text-center font-semibold leading-6 w-full text-gray-900"
                    >
                      Select a payment method
                    </DialogTitle>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4 w-full justify-center sm:px-6">
                <button
                  disabled={loading}
                  type="submit"
                  onClick={(e) => handleSubmit(e, "card")}
                  className="inline-flex w-full justify-center rounded-md bg-[#00B087] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00b087d3] sm:w-auto"
                >
                  {loading ? <Loader/> : "Pay via card"}
                </button>

                <button
                  disabled={loading2}
                  type="submit"
                  onClick={(e) => handleSubmit(e, "other")}
                  className="inline-flex w-full justify-center rounded-md bg-[#00B087] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#00b087d3] sm:w-auto"
                >
                  {loading2 ? <Loader/> : "Others..."}
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

export default PaymentModal;
