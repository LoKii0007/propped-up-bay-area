import OrderInfo from "@/components/OrderInfo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { parseDate } from "@/helpers/utilities";

export default function Accordian({ order, setOrders }) {
  return (
    <Accordion type="single" collapsible className="w-full hover:bg-gray-100 ">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex justify-between px-5 items-center w-full">
            <div className="">{parseDate(order.createdAt)}</div>
            <div className="">{order.orderNo}</div>
            <div className="">$ {order.total}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <OrderInfo order={order} setOrders={setOrders} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
