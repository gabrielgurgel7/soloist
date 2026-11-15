import { ChevronDown } from "lucide-react";
import { BaseCard } from "./BaseCard";

export type Ticket = "Baixo" | "Médio" | "Alto" | "Premium";

export type ClientStatus = "Ativo" | "Inativo" | "Prospecto" | "Bloqueado";

const ALL_CLIENT_STATUSES: ClientStatus[] = [
  "Ativo",
  "Inativo",
  "Prospecto",
  "Bloqueado",
];

const STATUS_HEADER: Record<ClientStatus, { bg: string; text: string }> = {
  Ativo: { bg: "bg-green-300", text: "text-slate-700" },
  Inativo: { bg: "bg-slate-300", text: "text-slate-700" },
  Prospecto: { bg: "bg-amber-300", text: "text-slate-700" },
  Bloqueado: { bg: "bg-red-300", text: "text-slate-700" },
};

const STATUS_COLOR: Record<ClientStatus, { bg: string; text: string }> = {
  Ativo: { bg: "bg-green-200", text: "text-green-700" },
  Inativo: { bg: "bg-gray-200", text: "text-gray-700" },
  Prospecto: { bg: "bg-amber-200", text: "text-amber-700" },
  Bloqueado: { bg: "bg-red-200", text: "text-red-700" },
};

const TICKET_COLOR: Record<Ticket, { bg: string; text: string }> = {
  Baixo: { bg: "bg-slate-200", text: "text-slate-700" },
  Médio: { bg: "bg-blue-200", text: "text-blue-700" },
  Alto: { bg: "bg-orange-200", text: "text-orange-700" },
  Premium: { bg: "bg-purple-200", text: "text-purple-700" },
};

export interface ClientCardProps {
  id?: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  birthDate?: string;
  ticket: Ticket;
  status: ClientStatus;
  lastContact?: string;
  totalRevenue?: number;
  totalBudgets?: number;
  avatar?: string;
  onChangeStatus?: (newStatus: ClientStatus) => void;
}

export function ClientCard({
  name,
  company,
  email,
  phone,
  birthDate,
  lastContact,
  ticket,
  status,
  onChangeStatus,
}: ClientCardProps) {
  return (
    <BaseCard
      title={name}
      headerBg={STATUS_HEADER[status].bg}
      headerText={STATUS_HEADER[status].text}
      minHeight="h-auto"
    >
      <div className="text-sm text-neutral-200 font-inter space-y-1">
        {company && (
          <p className="hover:bg-neutral-500/30 truncate">
            <strong>Empresa:</strong> {company}
          </p>
        )}
        <p className="hover:bg-neutral-500/30 truncate">
          <strong>Email:</strong> {email}
        </p>
        {phone && (
          <p className="hover:bg-neutral-500/30">
            <strong>Telefone:</strong> {phone}
          </p>
        )}
        {birthDate && (
          <p className="hover:bg-neutral-500/30">
            <strong>Aniversário:</strong> {birthDate}
          </p>
        )}
        {lastContact && (
          <p className="hover:bg-neutral-500/30">
            <strong>Último contato:</strong> {lastContact}
          </p>
        )}
      </div>
      <div className="mt-auto pt-1 flex flex-wrap items-center gap-1.5">
        {onChangeStatus ? (
          <div
            className={`relative inline-flex items-center rounded-full ${STATUS_COLOR[status].bg} ${STATUS_COLOR[status].text}`}
            onClick={(e) => e.stopPropagation()}
          >
            <select
              aria-label={`Alterar status do cliente ${name}`}
              value={status}
              onChange={(e) =>
                onChangeStatus(e.target.value as ClientStatus)
              }
              className="appearance-none bg-transparent text-xs font-bold pl-2.5 pr-5 py-0.5 rounded-full cursor-pointer outline-none"
            >
              {ALL_CLIENT_STATUSES.map((st) => (
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

        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            TICKET_COLOR[ticket].bg
          } ${TICKET_COLOR[ticket].text}`}
        >
          Ticket: {ticket}
        </span>
      </div>
    </BaseCard>
  );
}
