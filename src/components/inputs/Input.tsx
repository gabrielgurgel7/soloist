interface InputProps {
  id: string;
  name: string;
  type: "text" | "number" | "email" | "tel";
  label: string;
  min?: number;
  step?: number;
  inputMode?: string;
  ariaDescribedBy?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  id,
  name,
  type,
  label,
  autoComplete,
  placeholder,
  required,
  value,
  onChange,
  ariaDescribedBy,
}: InputProps) {
  return (
    <div className="flex items-center bg-neutral-500/30 h-10 px-4 rounded-full w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        aria-describedby={ariaDescribedBy}
        className="text-pistache-solar outline-none bg-transparent w-full"
      />
    </div>
  );
}
