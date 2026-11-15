import { useState, useEffect, type DragEvent } from "react";
import { Users } from "lucide-react";
import {
  ClientCard,
  type ClientStatus,
  type Ticket,
} from "../components/cards/ClientCard";
import { KanbanColumn } from "../components/kanban/KanbanColumn";
import { BaseCard } from "../components/cards/BaseCard";
import { PageTitleHeader } from "../components/headers/SectionHeader";
import { CloseButton, SendButton } from "../components/buttons/Buttons";
import { Input } from "../components/inputs/Input";
import {
  type StoredClient,
  getStoredClients,
  saveStoredClients,
  pushActivityNotification,
} from "../services/crmStorage";

const CLIENT_COLUMNS: { title: string; status: ClientStatus }[] = [
  { title: "Ativos", status: "Ativo" },
  { title: "Inativos", status: "Inativo" },
  { title: "Prospectos", status: "Prospecto" },
  { title: "Bloqueados", status: "Bloqueado" },
];

export function ClientsPage() {
  const [clients, setClients] = useState<StoredClient[]>(() =>
    getStoredClients(),
  );

  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ClientStatus | null>(
    null,
  );
  const [addingToStatus, setAddingToStatus] = useState<ClientStatus | null>(
    null,
  );
  const [mobileColumnFilter, setMobileColumnFilter] = useState<
    ClientStatus | "Todas"
  >("Todas");
  const [newClient, setNewClient] = useState<{
    name: string;
    company: string;
    email: string;
    phone: string;
    ticket: Ticket;
  }>({
    name: "",
    company: "",
    email: "",
    phone: "",
    ticket: "Médio",
  });

  useEffect(() => {
    saveStoredClients(clients);
  }, [clients]);

  function moveClientToStatus(clientId: string, targetStatus: ClientStatus) {
    const movedClient = clients.find((c) => c.id === clientId);
    if (movedClient && movedClient.status !== targetStatus) {
      pushActivityNotification({
        category: targetStatus === "Prospecto" ? "prospect" : "event",
        title: `Cliente movido para ${targetStatus}`,
        message: `${movedClient.name} foi movido para a coluna "${targetStatus}".`,
        actionLabel: "Ver Clientes",
        actionRoute: "/clients",
      });
    }

    setClients((prev) =>
      prev.map((client) =>
        client.id === clientId ? { ...client, status: targetStatus } : client,
      ),
    );
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>, clientId: string) {
    setDraggedClientId(clientId);
    event.dataTransfer.setData("text/plain", clientId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedClientId(null);
    setDragOverColumn(null);
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
    status: ClientStatus,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>,
    status: ClientStatus,
  ) {
    if (
      !event.currentTarget.contains(event.relatedTarget as Node | null) &&
      dragOverColumn === status
    ) {
      setDragOverColumn(null);
    }
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>,
    targetStatus: ClientStatus,
  ) {
    event.preventDefault();
    const clientId =
      event.dataTransfer.getData("text/plain") || draggedClientId;

    if (clientId) {
      moveClientToStatus(clientId, targetStatus);
    }

    setDraggedClientId(null);
    setDragOverColumn(null);
  }

  function handleAddClient(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addingToStatus || !newClient.name.trim() || !newClient.email.trim())
      return;

    const created: StoredClient = {
      id: crypto.randomUUID(),
      name: newClient.name.trim(),
      company: newClient.company.trim() || undefined,
      email: newClient.email.trim(),
      phone: newClient.phone.trim() || undefined,
      ticket: newClient.ticket,
      status: addingToStatus,
    };

    setClients((prev) => [created, ...prev]);
    setNewClient({
      name: "",
      company: "",
      email: "",
      phone: "",
      ticket: "Médio",
    });
    setAddingToStatus(null);
  }

  return (
    <>
      <section className="flex flex-col gap-4 max-w-6xl w-full p-3.5 sm:p-6 mx-auto backdrop-blur-md bg-green-950/60 border border-white/10 rounded-2xl">
        <PageTitleHeader
          title="Clientes"
          subtitle="Gerencie sua carteira de clientes e mova cards entre colunas com Drag and Drop ou toque no status."
          icon={<Users size={22} />}
        />

        {/* Pílulas de Filtro Rápido de Coluna para Telas Pequenas (Mobile) */}
        <div
          className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filtrar coluna de clientes no mobile"
        >
          <button
            type="button"
            onClick={() => setMobileColumnFilter("Todas")}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer",
              mobileColumnFilter === "Todas"
                ? "bg-pistache-solar text-neutral-900"
                : "bg-neutral-900/70 text-neutral-200 border border-white/10",
            ].join(" ")}
          >
            Todas ({clients.length})
          </button>
          {CLIENT_COLUMNS.map(({ title, status }) => {
            const count = clients.filter((c) => c.status === status).length;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setMobileColumnFilter(status)}
                className={[
                  "px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer",
                  mobileColumnFilter === status
                    ? "bg-pistache-solar text-neutral-900"
                    : "bg-neutral-900/70 text-neutral-200 border border-white/10",
                ].join(" ")}
              >
                {title} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-start">
          {CLIENT_COLUMNS.map(({ title, status }) => {
            const columnClients = clients.filter(
              (client) => client.status === status,
            );
            const isHiddenOnMobile =
              mobileColumnFilter !== "Todas" && mobileColumnFilter !== status;

            return (
              <div
                key={status}
                className={isHiddenOnMobile ? "hidden sm:block" : "block"}
              >
                <KanbanColumn
                  title={title}
                  subtitle={`${columnClients.length} ${
                    columnClients.length === 1 ? "cliente" : "clientes"
                  }`}
                  isDragOver={dragOverColumn === status}
                  isDraggingAny={draggedClientId !== null}
                  hasItems={columnClients.length > 0}
                  itemCount={columnClients.length}
                  emptyMessage="Arraste um cliente para cá"
                  onAdd={() => setAddingToStatus(status)}
                  onFilter={() => {}}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={(e) => handleDragLeave(e, status)}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {columnClients.map((client) => {
                    const isBeingDragged = draggedClientId === client.id;

                    return (
                      <li
                        key={client.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, client.id)}
                        onDragEnd={handleDragEnd}
                        className={[
                          "cursor-grab active:cursor-grabbing transition-all duration-150 select-none",
                          isBeingDragged
                            ? "opacity-40 scale-95 ring-2 ring-pistache-solar rounded-2xl"
                            : "hover:-translate-y-0.5",
                        ].join(" ")}
                      >
                        <ClientCard
                          name={client.name}
                          company={client.company}
                          email={client.email}
                          phone={client.phone}
                          birthDate={client.birthDate}
                          lastContact={client.lastContact}
                          ticket={client.ticket}
                          status={client.status}
                          onChangeStatus={(newStatus) =>
                            moveClientToStatus(client.id, newStatus)
                          }
                        />
                      </li>
                    );
                  })}
                </KanbanColumn>
              </div>
            );
          })}
        </div>
      </section>

      {addingToStatus && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setAddingToStatus(null)}
        >
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <BaseCard
              title={`Novo Cliente (${addingToStatus})`}
              headerBg="bg-neutral-700"
              headerText="text-pistache-solar"
              minHeight="h-auto"
              rightAction={
                <CloseButton onClose={() => setAddingToStatus(null)} />
              }
            >
              <form
                onSubmit={handleAddClient}
                className="flex flex-col gap-3 p-2"
              >
                <Input
                  id="client-name"
                  name="name"
                  type="text"
                  label="Nome do cliente"
                  placeholder="Nome do cliente"
                  required
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  id="client-company"
                  name="company"
                  type="text"
                  label="Empresa"
                  placeholder="Empresa (opcional)"
                  value={newClient.company}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                />
                <Input
                  id="client-email"
                  name="email"
                  type="email"
                  label="E-mail"
                  placeholder="E-mail do cliente"
                  required
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
                <Input
                  id="client-phone"
                  name="phone"
                  type="tel"
                  label="Telefone"
                  placeholder="Telefone (opcional)"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="client-ticket"
                    className="text-neutral-50 text-sm px-2"
                  >
                    Ticket
                  </label>
                  <div className="flex items-center bg-neutral-500/30 h-10 px-4 rounded-full w-full">
                    <select
                      id="client-ticket"
                      name="ticket"
                      value={newClient.ticket}
                      onChange={(e) =>
                        setNewClient((prev) => ({
                          ...prev,
                          ticket: e.target.value as Ticket,
                        }))
                      }
                      className="text-pistache-solar outline-none bg-transparent w-full"
                    >
                      <option value="Baixo" className="bg-neutral-800">
                        Baixo
                      </option>
                      <option value="Médio" className="bg-neutral-800">
                        Médio
                      </option>
                      <option value="Alto" className="bg-neutral-800">
                        Alto
                      </option>
                      <option value="Premium" className="bg-neutral-800">
                        Premium
                      </option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <SendButton />
                </div>
              </form>
            </BaseCard>
          </div>
        </div>
      )}
    </>
  );
}
