import OrderInfo from "@/components/OrderInfo"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export default function Accordian({order, setOrders }) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{order.orderNo}</AccordionTrigger>
          <AccordionContent>
            <OrderInfo order={order} setOrders={setOrders}  />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  