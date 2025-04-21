import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { cn } from "@/lib/utils";

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
  const [startDate, setStartDate] = useState<Date | null>(
    value?.startDate || null
  );
  const [endDate, setEndDate] = useState<Date | null>(value?.endDate || null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onChange?.({
      startDate: date,
      endDate: endDate,
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onChange?.({
      startDate: startDate,
      endDate: date,
    });
  };

  return (
    <div className={cn("w-full flex gap-4", className)}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={startDate}
          onChange={handleStartDateChange}
          label="Start Date"
          slotProps={{
            textField: {
              size: "small",
              sx: {
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "& fieldset": {
                    borderColor: "hsl(var(--border))",
                  },
                  "&:hover fieldset": {
                    borderColor: "hsl(var(--input))",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "hsl(var(--ring))",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "hsl(var(--foreground))",
                },
                "& .MuiInputLabel-root": {
                  color: "hsl(var(--muted-foreground))",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "hsl(var(--ring))",
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
                "& .MuiPickersCalendarHeader-root": {
                  color: "hsl(var(--popover-foreground))",
                },
                "& .MuiPickersDay-root": {
                  color: "hsl(var(--popover-foreground))",
                  "&.Mui-selected": {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  },
                  "&.MuiPickersDay-today": {
                    borderColor: "hsl(var(--primary))",
                  },
                },
                "& .MuiPickersDay-root:not(.Mui-selected)": {
                  "&:hover": {
                    backgroundColor: "hsl(var(--accent))",
                  },
                },
                "& .MuiPickersArrowSwitcher-button": {
                  color: "hsl(var(--popover-foreground))",
                },
                "& .MuiPickersCalendarHeader-label": {
                  color: "hsl(var(--popover-foreground))",
                },
              },
            },
          }}
        />
        <DatePicker
          value={endDate}
          onChange={handleEndDateChange}
          label="End Date"
          slotProps={{
            textField: {
              size: "small",
              sx: {
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "transparent",
                  "& fieldset": {
                    borderColor: "hsl(var(--border))",
                  },
                  "&:hover fieldset": {
                    borderColor: "hsl(var(--input))",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "hsl(var(--ring))",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "hsl(var(--foreground))",
                },
                "& .MuiInputLabel-root": {
                  color: "hsl(var(--muted-foreground))",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "hsl(var(--ring))",
                },
              },
            },
            popper: {
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
                "& .MuiPickersCalendarHeader-root": {
                  color: "hsl(var(--popover-foreground))",
                },
                "& .MuiPickersDay-root": {
                  color: "hsl(var(--popover-foreground))",
                  "&.Mui-selected": {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                  },
                  "&.MuiPickersDay-today": {
                    borderColor: "hsl(var(--primary))",
                  },
                },
                "& .MuiPickersDay-root:not(.Mui-selected)": {
                  "&:hover": {
                    backgroundColor: "hsl(var(--accent))",
                  },
                },
                "& .MuiPickersArrowSwitcher-button": {
                  color: "hsl(var(--popover-foreground))",
                },
                "& .MuiPickersCalendarHeader-label": {
                  color: "hsl(var(--popover-foreground))",
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
