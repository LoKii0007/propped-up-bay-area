import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isBefore, startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePickerDemo({ date, selectedDate }) {
  const today = startOfDay(new Date());
  const [isOpen, setIsOpen] = React.useState(false); // Track the popover state

  const handleSelectDate = (date) => {
    selectedDate(date); // Update the parent state with the selected date
    setIsOpen(false); // Close the popover after selecting the date
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full overflow-hidden justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate} // Use the new handler for date selection
          initialFocus
          disabled={(date) => isBefore(date, today)} // Disable past dates
        />
      </PopoverContent>
    </Popover>
  );
}