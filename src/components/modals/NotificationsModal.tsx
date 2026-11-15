import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Wallet,
  PauseCircle,
  UserPlus,
  TrendingDown,
  Award,
  Activity,
  Check,
  CheckCheck,
  ArrowRight,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { BaseCard } from "../cards/BaseCard";
import { LineDivision } from "../division/LineDivision";
import { CloseButton } from "../buttons/Buttons";
import {
  type SoloistNotification,
  type NotificationCategory,
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  markProjectPaidStatus,
  clearActivityNotifications,
} from "../../services/crmStorage";

interface NotificationsModalProps {
  onClose: () => void;
}

type FilterMode = "all" | "unread" | "finance" | "crm";

const CATEGORY_ICON: Record<NotificationCategory, LucideIcon> = {
  payment: Wallet,
  paused: PauseCircle,
  prospect: UserPlus,
  pricing: TrendingDown,
  vip: Award,
  event: Activity,
};

const CATEGORY_BADGE_LABEL: Record<NotificationCategory, string> = {
  payment: "Cobrança",
  paused: "Projeto Pausado",
  prospect: "Prospecto",
  pricing: "Hora Técnica",
  vip: "Cliente VIP",
  event: "Atividade",
};

export function NotificationsModal({ onClose }: NotificationsModalProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<SoloistNotification[]>(
    () => getAllNotifications(),
  );
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    function handleRefresh() {
      setNotifications(getAllNotifications());
    }
    window.addEventListener("soloist-crm-updated", handleRefresh);
    window.addEventListener("soloist-settings-updated", handleRefresh);
    return () => {
      window.removeEventListener("soloist-crm-updated", handleRefresh);
      window.removeEventListener("soloist-settings-updated", handleRefresh);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "finance")
      return (
        n.category === "payment" ||
        n.category === "paused" ||
        n.category === "pricing"
      );
    if (filter === "crm")
      return (
        n.category === "prospect" ||
        n.category === "vip" ||
        n.category === "event"
      );
    return true;
  });

  function handleMarkRead(id: string) {
    markNotificationAsRead(id);
    setNotifications(getAllNotifications());
  }

  function handleMarkAllRead() {
    markAllNotificationsAsRead(notifications.map((n) => n.id));
    setNotifications(getAllNotifications());
  }

  function handleConfirmProjectPaid(projectId: string, notificationId: string) {
    markProjectPaidStatus(projectId, true);
    markNotificationAsRead(notificationId);
    setNotifications(getAllNotifications());
  }

  function handleNavigateAction(item: SoloistNotification) {
    markNotificationAsRead(item.id);
    if (item.actionRoute) {
      navigate(item.actionRoute);
      onClose();
    }
  }

  function handleClearHistory() {
    clearActivityNotifications();
    setNotifications(getAllNotifications());
  }

  return (
    <BaseCard
      className="max-w-lg w-full"
      title="Notificações"
      headerBg="bg-neutral-700"
      headerText="text-pistache-solar"
      minHeight="h-auto"
      rightAction={<CloseButton onClose={onClose} />}
    >
      <div className="flex flex-col gap-3 p-2">
        {/* Topo com resumo e filtros rápidos no estilo LoginForm */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-8 w-8 rounded-full shrink-0">
              <Bell size={15} />
            </div>
            <div>
              <p className="text-neutral-50 text-xs font-bold">
                Central de Alertas do Soloist
              </p>
              <small className="text-neutral-400 text-[11px] block">
                {unreadCount === 0
                  ? "Você está em dia com todos os alertas"
                  : `${unreadCount} ${unreadCount === 1 ? "notificação não lida" : "notificações não lidas"}`}
              </small>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1 text-xs text-pistache-solar hover:underline cursor-pointer shrink-0"
            >
              <CheckCheck size={14} />
              <span>Ler todas</span>
            </button>
          )}
        </div>

        {/* Filtros de Categoria (Pills estilo LoginForm) */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: "all", label: "Todas" },
            { id: "unread", label: `Não lidas (${unreadCount})` },
            { id: "finance", label: "Caixa & Preço" },
            { id: "crm", label: "CRM & Ações" },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as FilterMode)}
                className={[
                  "flex items-center justify-center h-8 rounded-full px-2 text-xs transition-colors cursor-pointer truncate",
                  isActive
                    ? "bg-pistache-solar text-neutral-900 font-bold"
                    : "text-neutral-50 bg-neutral-500 hover:bg-neutral-400",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <LineDivision />

        {/* Lista de Notificações com Scroll Estilizado */}
        <ul className="flex flex-col gap-2.5 solo-card-scroll max-h-96">
          {filteredNotifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center gap-2 py-10 text-center bg-neutral-500/20 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-center bg-neutral-300 text-neutral-900 h-10 w-10 rounded-full">
                <Check size={18} />
              </div>
              <p className="text-sm font-semibold text-amber-50">
                Nenhuma notificação nesta categoria
              </p>
              <small className="text-neutral-400 text-xs max-w-xs">
                O Soloist monitora automaticamente pagamentos pendentes,
                projetos pausados, prospectos e sua hora técnica.
              </small>
            </li>
          ) : (
            filteredNotifications.map((item) => {
              const Icon = CATEGORY_ICON[item.category];

              return (
                <li
                  key={item.id}
                  className={[
                    "flex flex-col gap-2 p-3 rounded-2xl border transition-all",
                    item.isRead
                      ? "bg-neutral-500/20 border-white/10 opacity-75"
                      : "bg-neutral-500/35 border-pistache-solar/40 shadow-sm",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={[
                        "flex items-center justify-center h-9 w-9 rounded-full shrink-0 mt-0.5",
                        item.isRead
                          ? "bg-neutral-300 text-neutral-900"
                          : "bg-pistache-solar text-neutral-900",
                      ].join(" ")}
                    >
                      <Icon size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-pistache-solar bg-neutral-900/60 px-2 py-0.5 rounded-full">
                          {CATEGORY_BADGE_LABEL[item.category]}
                        </span>
                        <small className="text-[11px] text-neutral-400 shrink-0">
                          {item.timestamp}
                        </small>
                      </div>

                      <h4 className="text-xs font-bold text-amber-50 font-sora mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-neutral-300 font-inter leading-relaxed mt-0.5">
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Ações Rápidas da Notificação */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/10">
                    {!item.isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(item.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-pistache-solar px-2 py-1 rounded-full cursor-pointer"
                      >
                        <Check size={12} />
                        <span>Marcar como lida</span>
                      </button>
                    )}

                    {item.category === "payment" && item.projectId && (
                      <button
                        type="button"
                        onClick={() =>
                          handleConfirmProjectPaid(item.projectId!, item.id)
                        }
                        className="inline-flex items-center gap-1 bg-pistache-solar text-neutral-900 font-bold text-[11px] px-3 py-1 rounded-full cursor-pointer hover:brightness-105 transition-all"
                      >
                        <Check size={12} />
                        <span>Confirmar Recebimento</span>
                      </button>
                    )}

                    {item.actionRoute && (
                      <button
                        type="button"
                        onClick={() => handleNavigateAction(item)}
                        className="inline-flex items-center gap-1 text-neutral-50 bg-neutral-500 hover:bg-neutral-400 text-[11px] font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors"
                      >
                        <span>{item.actionLabel ?? "Abrir"}</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <LineDivision />

        {/* Rodapé do Modal */}
        <div className="flex items-center justify-between px-1">
          <small className="text-neutral-400 text-xs">
            Alertas sincronizados em tempo real com seu CRM
          </small>
          <button
            type="button"
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-pistache-solar cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Limpar histórico</span>
          </button>
        </div>
      </div>
    </BaseCard>
  );
}
