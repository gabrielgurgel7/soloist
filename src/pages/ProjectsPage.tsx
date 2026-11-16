import { useState, useEffect, type DragEvent } from "react";
import { FolderKanban } from "lucide-react";
import {
  ProjectCard,
  type Project,
  type ProjectStatus,
} from "../components/cards/ProjectCard";
import { KanbanColumn } from "../components/kanban/KanbanColumn";
import { BaseCard } from "../components/cards/BaseCard";
import { PageTitleHeader } from "../components/headers/SectionHeader";
import { CloseButton, SendButton } from "../components/buttons/Buttons";
import { Input } from "../components/inputs/Input";
import {
  getStoredProjects,
  saveStoredProjects,
  pushActivityNotification,
} from "../services/crmStorage";
import {
  pushNewProjectToPostgres,
  pushProjectKanbanToPostgres,
} from "../lib/firebase";

const PROJECT_COLUMNS: ProjectStatus[] = [
  "Em andamento",
  "Concluído",
  "Pausado",
  "Cancelado",
];

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() =>
    getStoredProjects(),
  );

  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ProjectStatus | null>(
    null,
  );
  const [addingToStatus, setAddingToStatus] = useState<ProjectStatus | null>(
    null,
  );
  const [mobileColumnFilter, setMobileColumnFilter] = useState<
    ProjectStatus | "Todas"
  >("Todas");
  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    type: "",
    value: "",
  });

  useEffect(() => {
    function reloadFromAccount() {
      setProjects(getStoredProjects());
    }
    window.addEventListener("soloist-auth-changed", reloadFromAccount);
    return () =>
      window.removeEventListener("soloist-auth-changed", reloadFromAccount);
  }, []);

  function moveProjectToStatus(projectId: string, targetStatus: ProjectStatus) {
    const targetProj = projects.find((p) => p.id === projectId);
    if (targetProj && targetProj.status !== targetStatus) {
      pushActivityNotification({
        category:
          targetStatus === "Concluído" && !targetProj.isPaid
            ? "payment"
            : "event",
        title: `Projeto movido para ${targetStatus}`,
        message: `"${targetProj.name}" (${targetProj.client}) agora está em "${targetStatus}".`,
        actionLabel: "Ver Kanban",
        actionRoute: "/projects",
      });
    }

    setProjects((prev) => {
      const next = prev.map((project) =>
        project.id === projectId
          ? { ...project, status: targetStatus }
          : project,
      );
      saveStoredProjects(next);
      return next;
    });
    pushProjectKanbanToPostgres(projectId, { status: targetStatus }).catch(
      () => undefined,
    );
  }

  function handleDragStart(
    event: DragEvent<HTMLLIElement>,
    projectId: string,
  ) {
    setDraggedProjectId(projectId);
    event.dataTransfer.setData("text/plain", projectId);
    event.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    setDraggedProjectId(null);
    setDragOverColumn(null);
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>,
    status: ProjectStatus,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>,
    status: ProjectStatus,
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
    targetStatus: ProjectStatus,
  ) {
    event.preventDefault();
    const projectId =
      event.dataTransfer.getData("text/plain") || draggedProjectId;

    if (projectId) {
      moveProjectToStatus(projectId, targetStatus);
    }

    setDraggedProjectId(null);
    setDragOverColumn(null);
  }

  function handleAddProject(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addingToStatus || !newProject.name.trim()) return;

    const created: Project = {
      id: crypto.randomUUID(),
      name: newProject.name.trim(),
      client: newProject.client.trim() || "Cliente não informado",
      type: newProject.type.trim() || "Geral",
      value: Number(newProject.value) || 0,
      status: addingToStatus,
    };

    setProjects((prev) => {
      const next = [created, ...prev];
      saveStoredProjects(next);
      return next;
    });
    pushNewProjectToPostgres(created).catch(() => undefined);
    setNewProject({ name: "", client: "", type: "", value: "" });
    setAddingToStatus(null);
  }

  return (
    <>
      <section className="flex flex-col gap-4 max-w-6xl w-full p-3.5 sm:p-6 mx-auto backdrop-blur-md bg-green-950/60 border border-white/10 rounded-2xl">
        <PageTitleHeader
          title="Projetos"
          subtitle="Acompanhe o andamento dos projetos, valores acumulados por coluna e mova cards com Drag and Drop ou toque no status."
          icon={<FolderKanban size={22} />}
        />

        {/* Pílulas de Filtro Rápido de Coluna para Telas Pequenas (Mobile) */}
        <div
          className="flex sm:hidden items-center gap-1.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filtrar coluna de projetos no mobile"
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
            Todas ({projects.length})
          </button>
          {PROJECT_COLUMNS.map((status) => {
            const count = projects.filter((p) => p.status === status).length;
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
                {status} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-start">
          {PROJECT_COLUMNS.map((status) => {
            const columnProjects = projects.filter(
              (project) => project.status === status,
            );
            const totalValue = columnProjects.reduce(
              (sum, project) => sum + project.value,
              0,
            );
            const isHiddenOnMobile =
              mobileColumnFilter !== "Todas" && mobileColumnFilter !== status;

            return (
              <div
                key={status}
                className={isHiddenOnMobile ? "hidden sm:block" : "block"}
              >
                <KanbanColumn
                  title={status}
                  subtitle={`${columnProjects.length} ${
                    columnProjects.length === 1 ? "projeto" : "projetos"
                  } • R$ ${totalValue.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  isDragOver={dragOverColumn === status}
                  isDraggingAny={draggedProjectId !== null}
                  hasItems={columnProjects.length > 0}
                  itemCount={columnProjects.length}
                  emptyMessage="Arraste um projeto para cá"
                  onAdd={() => setAddingToStatus(status)}
                  onFilter={() => {}}
                  onDragOver={(e) => handleDragOver(e, status)}
                  onDragLeave={(e) => handleDragLeave(e, status)}
                  onDrop={(e) => handleDrop(e, status)}
                >
                  {columnProjects.map((project) => {
                    const isBeingDragged = draggedProjectId === project.id;

                    return (
                      <li
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        onDragEnd={handleDragEnd}
                        className={[
                          "cursor-grab active:cursor-grabbing transition-all duration-150 select-none",
                          isBeingDragged
                            ? "opacity-40 scale-95 ring-2 ring-pistache-solar rounded-2xl"
                            : "hover:-translate-y-0.5",
                        ].join(" ")}
                      >
                        <ProjectCard
                          name={project.name}
                          client={project.client}
                          status={project.status}
                          type={project.type}
                          value={project.value}
                          isPaid={project.isPaid}
                          onChangeStatus={(newStatus) =>
                            moveProjectToStatus(project.id, newStatus)
                          }
                          onTogglePaid={() => {
                            const nextPaid = !project.isPaid;
                            setProjects((prev) => {
                              const next = prev.map((p) =>
                                p.id === project.id
                                  ? { ...p, isPaid: nextPaid }
                                  : p,
                              );
                              saveStoredProjects(next);
                              return next;
                            });
                            pushProjectKanbanToPostgres(project.id, {
                              isPaid: nextPaid,
                            }).catch(() => undefined);
                          }}
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
          <div
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <BaseCard
              title={`Novo Projeto (${addingToStatus})`}
              headerBg="bg-neutral-700"
              headerText="text-pistache-solar"
              minHeight="h-auto"
              rightAction={
                <CloseButton onClose={() => setAddingToStatus(null)} />
              }
            >
              <form
                onSubmit={handleAddProject}
                className="flex flex-col gap-3 p-2"
              >
                <Input
                  id="project-name"
                  name="name"
                  type="text"
                  label="Nome do projeto"
                  placeholder="Nome do projeto"
                  required
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  id="project-client"
                  name="client"
                  type="text"
                  label="Cliente"
                  placeholder="Nome do cliente"
                  required
                  value={newProject.client}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      client: e.target.value,
                    }))
                  }
                />
                <Input
                  id="project-type"
                  name="type"
                  type="text"
                  label="Tipo de serviço"
                  placeholder="Tipo (ex: Design, Arquitetura)"
                  value={newProject.type}
                  onChange={(e) =>
                    setNewProject((prev) => ({ ...prev, type: e.target.value }))
                  }
                />
                <Input
                  id="project-value"
                  name="value"
                  type="number"
                  label="Valor (R$)"
                  placeholder="Valor em R$"
                  value={newProject.value}
                  onChange={(e) =>
                    setNewProject((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                />
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

