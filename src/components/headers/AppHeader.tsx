import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SlidersHorizontal,
  Layers,
  Users,
  FolderKanban,
  type LucideIcon,
} from "lucide-react";
import { LoginButton, NotifyButton, SettingsButton } from "../buttons/Buttons";
import { LoginForm } from "../modals/LoginForm";
import { SettingsModal } from "../modals/SettingsModal";
import { NotificationsModal } from "../modals/NotificationsModal";
import { getAllNotifications } from "../../services/crmStorage";

interface NavItem {
  label: string;
  mobileLabel: string;
  path: string;
  icon: LucideIcon;
}

export function AppHeader() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(() =>
    getAllNotifications().some((n) => !n.isRead),
  );
  const location = useLocation();

  useEffect(() => {
    function syncBadge() {
      setHasUnreadNotifications(getAllNotifications().some((n) => !n.isRead));
    }
    window.addEventListener("soloist-crm-updated", syncBadge);
    window.addEventListener("soloist-settings-updated", syncBadge);
    return () => {
      window.removeEventListener("soloist-crm-updated", syncBadge);
      window.removeEventListener("soloist-settings-updated", syncBadge);
    };
  }, []);

  const navItems: NavItem[] = [
    {
      label: "Initial Configs",
      mobileLabel: "Início",
      path: "/configs",
      icon: SlidersHorizontal,
    },
    {
      label: "Serviços",
      mobileLabel: "Serviços",
      path: "/services",
      icon: Layers,
    },
    {
      label: "Clientes",
      mobileLabel: "Clientes",
      path: "/clients",
      icon: Users,
    },
    {
      label: "Projetos",
      mobileLabel: "Projetos",
      path: "/projects",
      icon: FolderKanban,
    },
  ];

  return (
    <>
      <header className="flex flex-col md:flex-row w-full sticky max-w-6xl mx-auto justify-between md:items-center gap-2.5 md:gap-4 top-0 z-50 backdrop-blur-md bg-emerald-950/60 border border-t-0 border-amber-50/10 px-3.5 sm:px-6 py-3 sm:py-4 rounded-b-2xl">
        {/* Linha Superior no Mobile / Esquerda + Direita no Desktop */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to="/"
            className="text-pistache-solar text-xl sm:text-2xl font-sora font-bold tracking-tight"
          >
            Soloist
          </Link>

          {/* Botões de ação visíveis no topo direito em telas menores */}
          <div className="inline-flex md:hidden gap-1.5">
            <LoginButton onClick={() => setIsLoginOpen(true)} />
            <NotifyButton
              hasNotifications={hasUnreadNotifications}
              onClick={() => setIsNotificationsOpen(true)}
            />
            <SettingsButton onClick={() => setIsSettingsOpen(true)} />
          </div>
        </div>

        {/* Navegação Responsiva: Grade de 4 Pílulas com Ícones no Mobile / Inline no Desktop */}
        <nav className="grid grid-cols-4 md:inline-flex items-center gap-1 sm:gap-2 md:gap-3 text-amber-50 transition-colors w-full md:w-auto bg-neutral-900/40 md:bg-transparent p-1 md:p-0 rounded-full border border-white/10 md:border-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/configs" && location.pathname === "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  "inline-flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 md:py-1 rounded-full text-xs sm:text-sm transition-colors text-center truncate",
                  isActive
                    ? "bg-pistache-solar/20 text-pistache-solar font-bold border border-pistache-solar/40"
                    : "hover:text-pistache-solar text-neutral-200 md:text-amber-50",
                ].join(" ")}
              >
                <Icon size={14} className="shrink-0 md:hidden lg:inline-block" />
                <span className="md:hidden truncate">{item.mobileLabel}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Botões de ação no Desktop */}
        <div className="hidden md:inline-flex gap-2 shrink-0">
          <LoginButton onClick={() => setIsLoginOpen(true)} />
          <NotifyButton
            hasNotifications={hasUnreadNotifications}
            onClick={() => setIsNotificationsOpen(true)}
          />
          <SettingsButton onClick={() => setIsSettingsOpen(true)} />
        </div>
      </header>

      {isLoginOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsLoginOpen(false)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <LoginForm onClose={() => setIsLoginOpen(false)} />
          </div>
        </div>
      )}

      {isNotificationsOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsNotificationsOpen(false)}
        >
          <div
            className="w-full max-w-lg flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <NotificationsModal
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            className="w-full max-w-4xl flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SettingsModal onClose={() => setIsSettingsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
