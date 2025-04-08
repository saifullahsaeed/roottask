import { DatePickerInput } from "@mantine/dates";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export type DateValue = {
  startDate: Date | null;
  endDate: Date | null;
};

export interface DateRangePickerProps {
  value?: DateValue;
  onChange?: (value: DateValue) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  // Convert DateValue to [Date | null, Date | null]
  const [start, end] = [value?.startDate || null, value?.endDate || null];

  return (
    <div className={cn("w-full", className)}>
      <DatePickerInput
        type="range"
        value={[start, end]}
        onChange={(dates) => {
          const [newStart, newEnd] = dates;
          onChange?.({
            startDate: newStart,
            endDate: newEnd,
          });
        }}
        placeholder="Pick dates range"
        leftSection={<Calendar className="h-4 w-4 text-muted-foreground" />}
        numberOfColumns={2}
        minDate={new Date()}
        clearable
        valueFormat="MMM DD, YYYY"
        firstDayOfWeek={0}
        classNames={{
          input:
            "min-h-[2.5rem] bg-background text-foreground border border-input rounded-[var(--radius)] text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 placeholder:text-muted-foreground",
          day: "rounded-[var(--radius)] transition-colors duration-200 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[in-range]:bg-primary/10 data-[in-range]:text-foreground hover:bg-muted hover:text-foreground data-[outside]:text-muted-foreground data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          weekday: "text-muted-foreground font-normal",
          calendarHeader: "text-foreground",
        }}
      />
    </div>
  );
}
