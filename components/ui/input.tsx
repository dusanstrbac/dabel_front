import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  step?: number;
  min?: number;
}

function Input({ className, type, step = 1, min, ...props }: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number" && min !== undefined) {
      const value = Number(e.target.value);
      if (value < min) {
        e.target.value = min.toString();
        // Poziv originalnog onChange handlera sa korigovanom vrednošću
        props.onChange?.({
          ...e,
          target: {
            ...e.target,
            value: min.toString()
          }
        });
        return;
      }
    }
    props.onChange?.(e);
  };

  return (
    <input
      type={type}
      step={type === "number" ? step : undefined}
      min={type === "number" ? min : undefined}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
      onChange={handleChange}
    />
  )
}

export { Input }