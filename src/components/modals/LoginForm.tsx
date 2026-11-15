import { Link } from "react-router-dom";
import { BaseCard } from "../cards/BaseCard";
import { LineDivision } from "../division/LineDivision";
import { InputEmail } from "../inputs/InputEmail";
import { InputPassword } from "../inputs/InputPassword";
import { CloseButton, SendButton } from "../buttons/Buttons";

interface LoginFormProps {
  onClose?: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  return (
    <BaseCard
      className="max-w-sm"
      title="Login"
      headerBg="bg-neutral-700"
      headerText="text-pistache-solar"
      minHeight="h-auto"
      rightAction={<CloseButton onClose={onClose} />}
    >
      <form>
        <fieldset className="flex flex-col gap-4 p-2">
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center justify-center text-neutral-50 bg-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
            >
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center text-neutral-50 bg-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
            >
              Apple
            </button>
          </div>
          <LineDivision />
          <InputEmail />
          <InputPassword />
          <div className="flex items-center justify-between gap-2">
            <small className="text-neutral-400">
              Ao continuar, você concorda com nossos{" "}
              <Link to="/terms" className="text-pistache-solar hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                to="/privacy"
                className="text-pistache-solar hover:underline"
              >
                Política de Privacidade
              </Link>
              .
            </small>

            <SendButton />
          </div>
          <LineDivision />
          <div className="inline-flex gap-2 items-center justify-center">
            <Link
              to="/register"
              className="flex items-center justify-center text-neutral-50 text-sm border border-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
            >
              Registre-se
            </Link>
          </div>
        </fieldset>
      </form>
    </BaseCard>
  );
}
