import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DatePickerWithRange({ setStartDate, setEndDate }) {
  const [internalDate, setInternalDate] = useState({ from: null, to: null });
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedRange) => {
    setInternalDate(selectedRange); // Update internal state

    if (selectedRange?.from) {
      setStartDate(format(selectedRange.from, "dd-MM-yy")); // Update start date in parent
    }
    if (selectedRange?.to) {
      setEndDate(format(selectedRange.to, "dd-MM-yy")); // Update end date in parent
      setIsOpen(false); // Close popover when range is complete
    }
  };

  return (
    <div className={cn("grid gap-2")}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !internalDate.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "dd-MM-yy")} -{" "}
                  {format(internalDate.to, "dd-MM-yy")}
                </>
              ) : (
                format(internalDate.from, "dd-MM-yy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={internalDate}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
