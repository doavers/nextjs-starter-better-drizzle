/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { parseDate } from "chrono-node";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function Calendar29({
  value,
  onValueChangeAction,
  month,
  onMonthChangeAction,
}: {
  value: string;
  onValueChangeAction: (value: string) => void;
  month: Date | undefined;
  onMonthChangeAction: (month: Date | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(parseDate(value) ?? undefined);

  React.useEffect(() => {
    const parsedDate = parseDate(value);
    console.log("Update", value, date?.toISOString());

    if (parsedDate !== date) {
      console.log("parsedDate", parsedDate, date?.toISOString());
      setDate(parsedDate ?? undefined);
      onMonthChangeAction(parsedDate ?? undefined);
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="Tomorrow or next week"
          className="bg-background pr-10"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          // onChange={(e) => {
          //   setValue(e.target.value);
          //   const date = parseDate(e.target.value);
          //   if (date) {
          //     setDate(date);
          //     setMonth(date);
          //   }
          // }}
          onChange={(e) => onValueChangeAction(e.target.value)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={onMonthChangeAction}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  onValueChangeAction(formatDate(selectedDate));
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-muted-foreground px-1 text-sm">
        Set at <span className="font-medium">{formatDate(date)}</span>.
      </div>
    </div>
  );
}
