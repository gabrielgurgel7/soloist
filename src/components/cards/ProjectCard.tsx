import { Check, Clock, ChevronDown } from "lucide-react";
import { BaseCard } from "./BaseCard";

export type ProjectStatus =
  | "Em andamento"
  | "Concluído"
  | "Pausado"
  | "Cancelado";

const ALL_PROJECT_STATUSES: ProjectStatus[] = [
  "Em andamento",
  "Concluído",
  "Pausado",
  "Cancelado",
];

const STATUS_COLOR: Record<ProjectStatus, { bg: string; text: string }> = {
  "Em andamento": { bg: "bg-green-200", text: "text-green-700" },
  Concluído: { bg: "bg-slate-200", text: "text-slate-700" },
  Pausado: { bg: "bg-amber-200", text: "text-amber-700" },
  Cancelado: { bg: "bg-red-200", text: "text-red-700" },
};

const STATUS_HEADER: Record<ProjectStatus, { bg: string; text: string }> = {
  "Em andamento": { bg: "bg-green-300", text: "text-slate-700" },
  Concluído: { bg: "bg-slate-300", text: "text-slate-700" },
  Pausado: { bg: "bg-amber-300", text: "text-slate-700" },
  Cancelado: { bg: "bg-red-300", text: "text-slate-700" },
};

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  type: string;
  value: number;
  isPaid?: boolean;
  startDate?: string;
  deadline?: string;
}

type ProjectCardProps = Pick<
  Project,
  "name" | "client" | "status" | "type" | "value" | "isPaid"
> & {
  onTogglePaid?: () => void;
  onChangeStatus?: (newStatus: ProjectStatus) => void;
};

export function ProjectCard({
  name,
  client,
  status,
  type,
  value,
  isPaid = false,
  onTogglePaid,
  onChangeStatus,
}: ProjectCardProps) {
  return (
    <BaseCard
      title={name}
      headerBg={STATUS_HEADER[status].bg}
      headerText={STATUS_HEADER[status].text}
      minHeight="h-auto"
    >
      <p className="text-sm text-neutral-200">
        <strong>Cliente:</strong> {client}
      </p>

      <p className="text-sm text-neutral-200">
        <strong>Tipo:</strong> {type}
      </p>

      <p className="text-sm text-neutral-200">
        <strong>Valor:</strong> R${" "}
        {value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>

      <div className="mt-auto pt-1 flex flex-wrap items-center justify-between gap-1.5">
        {onChangeStatus ? (
          <div
            className={`relative inline-flex items-center rounded-full ${STATUS_COLOR[status].bg} ${STATUS_COLOR[status].text}`}
            onClick={(e) => e.stopPropagation()}
          >
            <select
              aria-label={`Alterar status do projeto ${name}`}
              value={status}
              onChange={(e) =>
                onChangeStatus(e.target.value as ProjectStatus)
              }
              className="appearance-none bg-transparent text-xs font-bold pl-2.5 pr-5 py-0.5 rounded-full cursor-pointer outline-none"
            >
              {ALL_PROJECT_STATUSES.map((st) => (
                <option
                  key={st}
                  value={st}
                  className="bg-neutral-800 text-neutral-100"
                >
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown
              size={11}
              className="pointer-events-none absolute right-1.5"
            />
          </div>
        ) : (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              STATUS_COLOR[status].bg
            } ${STATUS_COLOR[status].text}`}
          >
            {status}
          </span>
        )}

        {onTogglePaid && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePaid();
            }}
            className={[
              "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors",
              isPaid
                ? "bg-emerald-300 text-emerald-950"
                : "bg-amber-300/90 text-amber-950 hover:bg-pistache-solar",
            ].join(" ")}
            title={
              isPaid
                ? "Clique para marcar como pendente"
                : "Clique para confirmar pagamento"
            }
          >
            {isPaid ? (
              <>
                <Check size={11} /> Pago
              </>
            ) : (
              <>
                <Clock size={11} /> Pgto Pendente
              </>
            )}
          </button>
        )}
      </div>
    </BaseCard>
  );
}
