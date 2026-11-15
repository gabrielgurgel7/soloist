import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { KeyRound, Eye, EyeOff } from "lucide-react";
import { SegmentedButtonGroup } from "../buttons/SegmentedButton";

export function InputPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex flex-row items-center pr-1 gap-2 bg-neutral-500/30 h-10 rounded-full w-full">
      <div className="flex items-center justify-center bg-neutral-300 h-10 w-10 rounded-full shrink-0">
        <KeyRound size={18} />
      </div>
      <label htmlFor="password" className="sr-only">
        Sua senha
      </label>
      <input
        id="password"
        name="password"
        className="text-pistache-solar outline-none bg-transparent w-full"
        type={showPassword ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Sua senha"
      />
      <SegmentedButtonGroup
        items={[
          {
            content: "Esqueci",
            ariaLabel: "Esqueci a senha",
            onClick: () => navigate("/esqueci-senha"),
          },
          {
            content: showPassword ? <EyeOff size={18} /> : <Eye size={18} />,
            ariaLabel: showPassword ? "Ocultar senha" : "Mostrar senha",
            onClick: () => setShowPassword((prev) => !prev),
          },
        ]}
      />
    </div>
  );
}
