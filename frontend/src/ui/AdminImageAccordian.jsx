import OrderInfo from "@/components/OrderInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { parseDate } from "@/helpers/utilities";

export default function AdminImageAccordian({ isLoading, imageUrl, handleFileChange, uploadImage, updateImage, uploading }) {
  return (
    <Accordion type="single" collapsible className="w-full hover:bg-gray-100 ">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex justify-between px-5 items-center w-full">
            Upload image
          </div>
        </AccordionTrigger>
        <AccordionContent>
        {!isLoading ? (
                <div className="w-full py-6 flex flex-col gap-5 justify-center items-center ">
                  {imageUrl ? (
                    <>
                      <img width={400} src={imageUrl} alt="" />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className=""
                      />
                      <button
                        onClick={() => updateImage()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Update Image"}
                      </button>
                    </>
                  ) : (
                    <>
                      <label className="block font-medium text-gray-700 text-center ">
                        Upload Order Image
                      </label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className=""
                      />
                      <button
                        onClick={() => uploadImage()}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload Image"}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="text-center">Loading...</div>
                </>
              )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
