import { AtSign } from "lucide-react";

interface InputEmailProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function InputEmail({ value, onChange }: InputEmailProps) {
  return (
    <div className="flex items-center gap-2 bg-neutral-500/30 h-10 pr-3 rounded-full w-full">
      <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-10 w-10 rounded-full shrink-0">
        <AtSign size={18} />
      </div>
      <label htmlFor="email" className="sr-only">
        Seu e-mail
      </label>
      <input
        id="email"
        name="email"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="text-pistache-solar outline-none bg-transparent w-full text-sm"
        type="email"
        autoComplete="email"
        placeholder="Seu e-mail"
      />
    </div>
  );
}
