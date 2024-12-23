import OrderInfo from "@/components/OrderInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";

export default function ImageAccordian({ currentUser, imageUrl, isLoading }) {
  useEffect(() => {}, [currentUser, imageUrl, isLoading]);

  return (
    <Accordion type="single" collapsible className="w-full hover:bg-gray-100 ">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex justify-between items-center w-full">
            Show image
          </div>
        </AccordionTrigger>
        <AccordionContent>
          {!isLoading ? (
            <div className="w-full py-6 flex flex-col gap-5 justify-center items-center ">
              {imageUrl ? (
                <img width={400} src={imageUrl} alt="image" />
              ) : (
                "Image not uploaded yet."
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
