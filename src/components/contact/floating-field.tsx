"use client";

import { useId, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

type FloatingFieldProps = {
  label: string;
  type?: string;
  textarea?: boolean;
  /** Renders a <select>; the label stays raised because a value is always set. */
  options?: readonly string[];
  error?: string;
  registration: UseFormRegisterReturn;
};

export function FloatingField({
  label,
  type = "text",
  textarea = false,
  options,
  error,
  registration,
}: FloatingFieldProps) {
  const id = useId();
  const [hasValue, setHasValue] = useState(false);
  // `date` and `select` inputs always render chrome, so the label can't sit over them.
  const alwaysRaised = options !== undefined || type === "date";

  const shared = {
    id,
    placeholder: " ",
    "aria-invalid": error ? true : undefined,
    className: cn(
      "peer w-full border-b bg-transparent pb-3 pt-6 text-foreground outline-none transition-colors",
      error ? "border-red-500/70" : "border-foreground/25 focus:border-beige"
    ),
    ...registration,
    onChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setHasValue(e.target.value.length > 0);
      registration.onChange(e);
    },
  };

  return (
    <div className="relative">
      {options ? (
        <select {...shared} className={cn(shared.className, "appearance-none pr-6")}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea rows={5} {...shared} className={cn(shared.className, "resize-none")} />
      ) : (
        <input type={type} {...shared} />
      )}

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 top-6 label text-foreground/50 transition-all duration-500",
          "peer-focus:top-0 peer-focus:text-beige",
          (hasValue || alwaysRaised) && "top-0 text-beige"
        )}
      >
        {label}
      </label>

      {options && (
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-0 h-1.5 w-1.5 rotate-45 border-b border-r border-foreground/40"
        />
      )}

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
