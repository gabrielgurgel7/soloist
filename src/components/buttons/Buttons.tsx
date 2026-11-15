import {
  Plus,
  Pencil,
  ListFilter,
  UserRound,
  Bell,
  Settings,
  Dot,
  ChevronRight,
  X,
  type LucideIcon,
} from "lucide-react";

interface IconButtonProps {
  icon: LucideIcon;
  className?: string;
  onClick?: () => void;
}

function IconButton({
  icon: Icon,
  className = "text-pistache-solar",
  onClick,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer w-8 h-8 items-center justify-center rounded-full transition-colors hover:bg-neutral-500/40 stroke-0 active:scale-90"
    >
      <Icon className={className} size={18} />
    </button>
  );
}

export const AddButton = (props: { onClick?: () => void }) => (
  <IconButton icon={Plus} {...props} />
);
export const FilterButton = (props: { onClick?: () => void }) => (
  <IconButton icon={ListFilter} {...props} />
);
export const LoginButton = (props: { onClick?: () => void }) => (
  <IconButton icon={UserRound} {...props} />
);
export const SettingsButton = (props: { onClick?: () => void }) => (
  <IconButton icon={Settings} {...props} />
);
export const EditButton = (props: { onClick?: () => void }) => (
  <IconButton icon={Pencil} className="text-musgo-escuro" {...props} />
);

export function SendButton() {
  return (
    <div className="relative flex items-center  bg-pistache-solar h-4 w-12 m-2 rounded-full shrink-0">
      <button
        type="submit"
        aria-label="Enviar"
        className="group absolute right-0 bg-pistache-solar p-2 h-10 w-10 rounded-full cursor-pointer transition-transform duration-300 ease-out hover:translate-x-2 active:scale-90"
      >
        <ChevronRight className="transition-transform duration-200 ease-out group-hover:rotate-360" />
      </button>
    </div>
  );
}

interface CloseButtonProps {
  onClose?: () => void;
}

export function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Fechar"
      className="text-pistache-solar cursor-pointer"
    >
      <X size={20} />
    </button>
  );
}

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function PrimaryButton({ children, ...props }: BaseButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center text-neutral-50 bg-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }: BaseButtonProps) {
  return (
    <button
      type="button"
      className="flex items-center justify-center text-neutral-50 text-sm border border-neutral-500 h-8 w-full rounded-full px-4 hover:bg-neutral-400 transition-colors cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
}

interface NotifyButtonProps {
  hasNotifications?: boolean;
  onClick?: () => void;
}

export function NotifyButton({
  hasNotifications = false,
  onClick,
}: NotifyButtonProps) {
  return (
    <div className="relative">
      <IconButton icon={Bell} onClick={onClick} />
      {hasNotifications && (
        <Dot
          className="pointer-events-none absolute bottom-1.5 left-1 text-red-500"
          size={32}
        />
      )}
    </div>
  );
}
