import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const fieldClasses =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={cn(fieldClasses, error && "border-red-400", className)} {...props} />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <select ref={ref} id={selectId} className={cn(fieldClasses, error && "border-red-400", className)} {...props}>
          {children}
        </select>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";

export function FieldLabel(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="text-sm font-medium text-slate-700" {...props} />;
}
