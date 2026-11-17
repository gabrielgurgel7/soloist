import type {
  ClientCardProps,
  ClientStatus,
  Ticket,
} from "../components/cards/ClientCard";
import type { Project, ProjectStatus } from "../components/cards/ProjectCard";

export interface StoredClient extends ClientCardProps {
  id: string;
}

export interface CatalogService {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  estimatedHours: number;
  revisionsIncluded: number;
  complexity: "baixa" | "média" | "alta";
  timesRequested: number;
}

export interface ServiceComboHistory {
  id: string;
  comboName: string;
  serviceIds: string[];
  serviceTitles: string[];
  discountPercent: number;
  totalHours: number;
  totalRevisions: number;
  finalPrice: number;
  lastClientName: string;
  createdAt: string;
  timesReused: number;
}

export const STORAGE_KEYS = {
  PROJECTS: "soloist_projects_v2",
  CLIENTS: "soloist_clients_v2",
  SERVICES: "soloist_services_v2",
  COMBOS: "soloist_combos_history_v2",
  SETTINGS: "soloist_app_settings_v2",
  ACTIVITY_LOG: "soloist_activity_log_v2",
  READ_NOTIFICATIONS: "soloist_read_notifications_v2",
  EMAIL_TEMPLATES: "soloist_email_templates_v2",
  EMAIL_HISTORY: "soloist_email_history_v2",
} as const;

export type EmailCategory =
  | "Proposta"
  | "Cobrança"
  | "Onboarding"
  | "Follow-up"
  | "Entrega"
  | "Personalizado";

export type EmailVisualTheme = "soloist-dark" | "clean-light" | "editorial";

export interface SoloistEmailTemplate {
  id: string;
  name: string;
  category: EmailCategory;
  subject: string;
  greeting: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
  signature: string;
  visualTheme: EmailVisualTheme;
  updatedAt: string;
}

export interface SoloistSentEmail {
  id: string;
  templateName: string;
  category: EmailCategory;
  recipientName: string;
  recipientEmail: string;
  projectName?: string;
  subject: string;
  renderedBody: string;
  status: "Enviado" | "Rascunho";
  sentAt: string;
}

export type NotificationCategory =
  | "payment"
  | "paused"
  | "prospect"
  | "pricing"
  | "vip"
  | "event";

export interface SoloistNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  actionRoute?: "/projects" | "/clients" | "/services" | "/emails";
  projectId?: string;
  isRead: boolean;
}

export interface SoloistAppSettings {
  // Tema (Claro / Escuro)
  theme: "dark" | "light";

  // Perfil & Estúdio
  userName: string;
  studioName: string;
  userEmail: string;
  defaultLocality: string;
  proposalValidityDays: number;

  // Hora Técnica & Custos
  monthlyFixedCosts: number;
  desiredMonthlySalary: number;
  productiveHoursPerMonth: number;
  defaultProfitMargin: number;
  defaultComboDiscount: number;

  // Multiplicadores de Preço
  urgencyUrgentMultiplier: number;
  complexityMediumMultiplier: number;
  complexityHighMultiplier: number;
  segmentSmallBizMultiplier: number;
  segmentLargeBizMultiplier: number;
  extraRevisionRatePercent: number;

  // Kanban & CRM
  defaultProjectStatus: ProjectStatus;
  defaultRevisionsIncluded: number;
  autoClassifyClientTicket: boolean;
  premiumTicketThreshold: number;
}

export interface AuthenticatedSessionUser {
  uid: string;
  email: string;
  displayName: string;
}

// Estado da sessão autenticada atual (isolamento estrito por UID)
let activeSessionUser: AuthenticatedSessionUser | null = null;

export function getActiveSessionUser(): AuthenticatedSessionUser | null {
  return activeSessionUser;
}

export function isUserAuthenticated(): boolean {
  return Boolean(activeSessionUser?.uid);
}

export function setActiveSessionUser(
  user: AuthenticatedSessionUser | null,
): void {
  activeSessionUser = user;
  // Limpa chaves legadas globais (v1) para garantir que nenhum dado fictício antigo reste
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("soloist_projects_v1");
      localStorage.removeItem("soloist_clients_v1");
      localStorage.removeItem("soloist_services_v1");
      localStorage.removeItem("soloist_combos_history_v1");
      localStorage.removeItem("soloist_app_settings_v1");
      localStorage.removeItem("soloist_activity_log_v1");
      localStorage.removeItem("soloist_read_notifications_v1");
      localStorage.removeItem("soloist_email_templates_v1");
      localStorage.removeItem("soloist_email_history_v1");
    } catch {
      // Ignore storage errors
    }

    if (user) {
      const currentSettings = getStoredSettings();
      const fallbackName =
        user.displayName?.trim() ||
        currentSettings.userName?.trim() ||
        user.email.split("@")[0] ||
        "";
      if (!currentSettings.userName || !currentSettings.userEmail) {
        saveStoredSettings({
          ...currentSettings,
          userName: currentSettings.userName || fallbackName,
          userEmail: currentSettings.userEmail || user.email,
          studioName: currentSettings.studioName || "Meu Estúdio",
        });
      }
    }

    window.dispatchEvent(new Event("soloist-auth-changed"));
    window.dispatchEvent(new Event("soloist-crm-updated"));
    window.dispatchEvent(new Event("soloist-settings-updated"));
  }
}

function getScopedStorageKey(baseKey: string): string | null {
  if (!activeSessionUser?.uid) return null;
  return `${baseKey}_uid_${activeSessionUser.uid}`;
}

export const DEFAULT_APP_SETTINGS: SoloistAppSettings = {
  theme: "dark",
  userName: "",
  studioName: "",
  userEmail: "",
  defaultLocality: "São Paulo - SP",
  proposalValidityDays: 10,

  monthlyFixedCosts: 0,
  desiredMonthlySalary: 0,
  productiveHoursPerMonth: 140,
  defaultProfitMargin: 20,
  defaultComboDiscount: 10,

  urgencyUrgentMultiplier: 1.3,
  complexityMediumMultiplier: 1.15,
  complexityHighMultiplier: 1.35,
  segmentSmallBizMultiplier: 1.1,
  segmentLargeBizMultiplier: 1.25,
  extraRevisionRatePercent: 5,

  defaultProjectStatus: "Em andamento",
  defaultRevisionsIncluded: 2,
  autoClassifyClientTicket: true,
  premiumTicketThreshold: 5000,
};

export function applyAppTheme(theme: "dark" | "light"): void {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

export function getStoredSettings(): SoloistAppSettings {
  const scopedKey = getScopedStorageKey(STORAGE_KEYS.SETTINGS);
  if (!scopedKey) {
    applyAppTheme(DEFAULT_APP_SETTINGS.theme);
    return DEFAULT_APP_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(scopedKey);
    if (!raw) {
      const initialForUser: SoloistAppSettings = {
        ...DEFAULT_APP_SETTINGS,
        userName:
          activeSessionUser?.displayName ||
          activeSessionUser?.email.split("@")[0] ||
          "",
        userEmail: activeSessionUser?.email || "",
        studioName: "Meu Estúdio",
      };
      applyAppTheme(initialForUser.theme);
      return initialForUser;
    }
    const merged = {
      ...DEFAULT_APP_SETTINGS,
      ...(JSON.parse(raw) as Partial<SoloistAppSettings>),
    };
    applyAppTheme(merged.theme);
    return merged;
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
}

export function saveStoredSettings(settings: SoloistAppSettings): void {
  const scopedKey = getScopedStorageKey(STORAGE_KEYS.SETTINGS);
  if (!scopedKey) return;
  try {
    localStorage.setItem(scopedKey, JSON.stringify(settings));
    applyAppTheme(settings.theme);
    const hourly =
      settings.productiveHoursPerMonth > 0
        ? (settings.monthlyFixedCosts + settings.desiredMonthlySalary) /
          settings.productiveHoursPerMonth
        : 0;
    localStorage.setItem(
      `soloist_reference_hourly_cost_${activeSessionUser?.uid}`,
      hourly.toFixed(2),
    );
    window.dispatchEvent(new Event("soloist-settings-updated"));
  } catch {
    // Ignore storage errors
  }
}

export function getCalculatedBaseHourlyCost(
  settings: SoloistAppSettings = getStoredSettings(),
): number {
  if (settings.productiveHoursPerMonth <= 0) return 0;
  return Number(
    (
      (settings.monthlyFixedCosts + settings.desiredMonthlySalary) /
      settings.productiveHoursPerMonth
    ).toFixed(2),
  );
}

// Dados iniciais 100% zerados para novas contas
export const INITIAL_SERVICES: CatalogService[] = [];
export const INITIAL_COMBOS: ServiceComboHistory[] = [];
export const INITIAL_CLIENTS: StoredClient[] = [];
export const INITIAL_PROJECTS: Project[] = [];
export const INITIAL_EMAIL_TEMPLATES: SoloistEmailTemplate[] = [];
export const INITIAL_SENT_EMAILS: SoloistSentEmail[] = [];

function readScopedStorage<T>(baseKey: string, fallback: T): T {
  const scopedKey = getScopedStorageKey(baseKey);
  if (!scopedKey) return fallback;
  try {
    const raw = localStorage.getItem(scopedKey);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeScopedStorage<T>(baseKey: string, data: T): void {
  const scopedKey = getScopedStorageKey(baseKey);
  if (!scopedKey) return;
  try {
    localStorage.setItem(scopedKey, JSON.stringify(data));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("soloist-crm-updated"));
    }
  } catch {
    // Ignore storage write errors
  }
}

export function getStoredServices(): CatalogService[] {
  return readScopedStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
}

export function saveStoredServices(services: CatalogService[]): void {
  writeScopedStorage(STORAGE_KEYS.SERVICES, services);
}

export function getStoredCombos(): ServiceComboHistory[] {
  return readScopedStorage(STORAGE_KEYS.COMBOS, INITIAL_COMBOS);
}

export function saveStoredCombos(combos: ServiceComboHistory[]): void {
  writeScopedStorage(STORAGE_KEYS.COMBOS, combos);
}

export function getStoredClients(): StoredClient[] {
  return readScopedStorage(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
}

export function saveStoredClients(clients: StoredClient[]): void {
  writeScopedStorage(STORAGE_KEYS.CLIENTS, clients);
}

export function getStoredProjects(): Project[] {
  return readScopedStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function saveStoredProjects(projects: Project[]): void {
  writeScopedStorage(STORAGE_KEYS.PROJECTS, projects);
}

export function getStoredEmailTemplates(): SoloistEmailTemplate[] {
  return readScopedStorage(
    STORAGE_KEYS.EMAIL_TEMPLATES,
    INITIAL_EMAIL_TEMPLATES,
  );
}

export function saveStoredEmailTemplates(
  templates: SoloistEmailTemplate[],
): void {
  writeScopedStorage(STORAGE_KEYS.EMAIL_TEMPLATES, templates);
}

export function getStoredEmailHistory(): SoloistSentEmail[] {
  return readScopedStorage(STORAGE_KEYS.EMAIL_HISTORY, INITIAL_SENT_EMAILS);
}

export function saveStoredEmailHistory(history: SoloistSentEmail[]): void {
  writeScopedStorage(STORAGE_KEYS.EMAIL_HISTORY, history);
}

export interface CreateOrderPayload {
  projectName: string;
  projectType: string;
  projectStatus: ProjectStatus;
  finalPrice: number;
  ClientMode: "existing" | "new";
  existingClientId?: string;
  newClientData?: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    ticket: Ticket;
    status: ClientStatus;
  };
}

export function syncOrderWithClientsAndProjects(payload: CreateOrderPayload): {
  client: StoredClient;
  project: Project;
} {
  const clients = getStoredClients();
  const projects = getStoredProjects();
  const today = new Date().toLocaleDateString("pt-BR");

  let targetClient: StoredClient | undefined;

  if (payload.ClientMode === "existing" && payload.existingClientId) {
    targetClient = clients.find((c) => c.id === payload.existingClientId);
    if (targetClient) {
      const appSettings = getStoredSettings();
      let updatedTicket = targetClient.ticket;
      let upgradedToPremium = false;

      if (
        appSettings.autoClassifyClientTicket &&
        payload.finalPrice >= appSettings.premiumTicketThreshold &&
        targetClient.ticket !== "Premium"
      ) {
        updatedTicket = "Premium";
        upgradedToPremium = true;
      }

      const updatedClients = clients.map((c) =>
        c.id === targetClient?.id
          ? {
              ...c,
              lastContact: today,
              status: "Ativo" as ClientStatus,
              ticket: updatedTicket,
            }
          : c,
      );
      saveStoredClients(updatedClients);

      if (upgradedToPremium) {
        pushActivityNotification({
          category: "vip",
          title: "Upgrade Automático para Ticket Premium",
          message: `O cliente "${targetClient.name}" foi promovido para Ticket Premium pelo orçamento de R$ ${payload.finalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
          actionLabel: "Ver Cliente",
          actionRoute: "/clients",
        });
      }
    }
  }

  if (!targetClient && payload.newClientData) {
    const appSettings = getStoredSettings();
    let effectiveTicket = payload.newClientData.ticket;
    let upgradedToPremium = false;

    if (appSettings.autoClassifyClientTicket) {
      if (payload.finalPrice >= appSettings.premiumTicketThreshold) {
        if (effectiveTicket !== "Premium") upgradedToPremium = true;
        effectiveTicket = "Premium";
      } else if (
        payload.finalPrice >=
        appSettings.premiumTicketThreshold * 0.65
      ) {
        effectiveTicket = "Alto";
      }
    }

    targetClient = {
      id: crypto.randomUUID(),
      name: payload.newClientData.name.trim(),
      company: payload.newClientData.company?.trim() || undefined,
      email: payload.newClientData.email.trim(),
      phone: payload.newClientData.phone?.trim() || undefined,
      ticket: effectiveTicket,
      status: payload.newClientData.status,
      lastContact: today,
    };
    saveStoredClients([targetClient, ...clients]);

    if (upgradedToPremium) {
      pushActivityNotification({
        category: "vip",
        title: "Upgrade Automático para Ticket Premium",
        message: `O cliente "${targetClient.name}" foi promovido para Ticket Premium pelo orçamento de R$ ${payload.finalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
        actionLabel: "Ver Cliente",
        actionRoute: "/clients",
      });
    }
  }

  const fallbackClient: StoredClient = targetClient ?? {
    id: crypto.randomUUID(),
    name: "Cliente",
    email: "contato@cliente.com",
    ticket: "Médio",
    status: "Ativo",
    lastContact: today,
  };

  const createdProject: Project = {
    id: crypto.randomUUID(),
    name: payload.projectName,
    client: fallbackClient.name,
    status: payload.projectStatus,
    type: payload.projectType,
    value: payload.finalPrice,
    isPaid: false,
  };

  saveStoredProjects([createdProject, ...projects]);

  pushActivityNotification({
    category: "event",
    title: "Novo Orçamento Sincronizado",
    message: `Projeto "${createdProject.name}" (${fallbackClient.name}) enviado para a coluna "${createdProject.status}" no valor de R$ ${createdProject.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
    actionLabel: "Abrir Kanban",
    actionRoute: "/projects",
  });

  return { client: fallbackClient, project: createdProject };
}

export function getReadNotificationIds(): string[] {
  return readScopedStorage<string[]>(STORAGE_KEYS.READ_NOTIFICATIONS, []);
}

export function markNotificationAsRead(notificationId: string): void {
  const current = getReadNotificationIds();
  if (!current.includes(notificationId)) {
    writeScopedStorage(STORAGE_KEYS.READ_NOTIFICATIONS, [
      ...current,
      notificationId,
    ]);
  }
}

export function markAllNotificationsAsRead(ids: string[]): void {
  const current = getReadNotificationIds();
  const merged = Array.from(new Set([...current, ...ids]));
  writeScopedStorage(STORAGE_KEYS.READ_NOTIFICATIONS, merged);
}

export function pushActivityNotification(input: {
  category: NotificationCategory;
  title: string;
  message: string;
  actionLabel?: string;
  actionRoute?: "/projects" | "/clients" | "/services" | "/emails";
}): void {
  if (!isUserAuthenticated()) return;
  const current = readScopedStorage<SoloistNotification[]>(
    STORAGE_KEYS.ACTIVITY_LOG,
    [],
  );
  const now = new Date();
  const timeStr = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const newEntry: SoloistNotification = {
    id: `act-${crypto.randomUUID()}`,
    category: input.category,
    title: input.title,
    message: input.message,
    timestamp: `Hoje às ${timeStr}`,
    actionLabel: input.actionLabel,
    actionRoute: input.actionRoute,
    isRead: false,
  };

  writeScopedStorage(
    STORAGE_KEYS.ACTIVITY_LOG,
    [newEntry, ...current].slice(0, 15),
  );
}

export function markProjectPaidStatus(
  projectId: string,
  isPaid: boolean,
): void {
  const projects = getStoredProjects();
  const updated = projects.map((proj) =>
    proj.id === projectId ? { ...proj, isPaid } : proj,
  );
  saveStoredProjects(updated);
}

export function getAllNotifications(): SoloistNotification[] {
  if (!isUserAuthenticated()) return [];

  const projects = getStoredProjects();
  const clients = getStoredClients();
  const services = getStoredServices();
  const settings = getStoredSettings();
  const baseHourlyCost = getCalculatedBaseHourlyCost(settings);
  const readIds = new Set(getReadNotificationIds());
  const smartAlerts: SoloistNotification[] = [];

  // 1. Projetos Concluídos com Pagamento Pendente (!isPaid)
  const unpaidCompleted = projects.filter(
    (p) => p.status === "Concluído" && !p.isPaid,
  );
  for (const proj of unpaidCompleted) {
    const id = `smart-payment-${proj.id}`;
    smartAlerts.push({
      id,
      category: "payment",
      title: `Cobrança Pendente: ${proj.name}`,
      message: `O projeto de ${proj.client} está na coluna "Concluído", mas o pagamento de R$ ${proj.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ainda não foi marcado como recebido.`,
      timestamp: "Ação financeira",
      actionLabel: "Ver Projeto",
      actionRoute: "/projects",
      projectId: proj.id,
      isRead: readIds.has(id),
    });
  }

  // 2. Projetos Pausados (Receita Travada)
  const pausedProjects = projects.filter((p) => p.status === "Pausado");
  if (pausedProjects.length > 0) {
    const pausedTotal = pausedProjects.reduce((sum, p) => sum + p.value, 0);
    const names = pausedProjects.map((p) => p.name).join(", ");
    const id = `smart-paused-${pausedProjects.length}-${pausedTotal}`;
    smartAlerts.push({
      id,
      category: "paused",
      title: `${pausedProjects.length} ${pausedProjects.length === 1 ? "Projeto Pausado" : "Projetos Pausados"} (R$ ${pausedTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`,
      message: `Receita aguardando retomada em: ${names}. Faça contato com o cliente para destravar a aprovação ou o sinal.`,
      timestamp: "Alerta de fluxo",
      actionLabel: "Destravar no Kanban",
      actionRoute: "/projects",
      isRead: readIds.has(id),
    });
  }

  // 3. Follow-up de Prospectos e Validade de Proposta
  const prospects = clients.filter((c) => c.status === "Prospecto");
  if (prospects.length > 0) {
    const prospectNames = prospects.map((c) => c.name).join(", ");
    const id = `smart-prospects-${prospects.map((p) => p.id).join("-")}`;
    smartAlerts.push({
      id,
      category: "prospect",
      title: `Follow-up Comercial (${prospects.length} ${prospects.length === 1 ? "Prospecto" : "Prospectos"})`,
      message: `${prospectNames} ${prospects.length === 1 ? "está" : "estão"} na coluna Prospectos. Lembre-se: seus orçamentos têm validade de ${settings.proposalValidityDays} dias.`,
      timestamp: "Oportunidade de venda",
      actionLabel: "Montar Combo",
      actionRoute: "/services",
      isRead: readIds.has(id),
    });
  }

  // 4. Alerta de Defasagem de Preço nos Presets vs. Hora Técnica Atual
  if (baseHourlyCost > 0) {
    const minRecommendedHourly =
      baseHourlyCost * (1 + settings.defaultProfitMargin / 100);
    const underpricedServices = services.filter((srv) => {
      const effectiveRate =
        srv.estimatedHours > 0 ? srv.price / srv.estimatedHours : srv.price;
      return effectiveRate < minRecommendedHourly;
    });

    if (underpricedServices.length > 0) {
      const firstUnder = underpricedServices[0];
      const effectiveRate = (
        firstUnder.price / Math.max(1, firstUnder.estimatedHours)
      ).toFixed(2);
      const id = `smart-pricing-${firstUnder.id}-${baseHourlyCost}`;
      smartAlerts.push({
        id,
        category: "pricing",
        title: `Defasagem de Hora Técnica (${underpricedServices.length} ${underpricedServices.length === 1 ? "Preset" : "Presets"})`,
        message: `O preset "${firstUnder.title}" rende R$ ${effectiveRate}/h, abaixo da sua meta recomendada de R$ ${minRecommendedHourly.toFixed(2)}/h (Hora base R$ ${baseHourlyCost.toFixed(2)} + ${settings.defaultProfitMargin}% margem).`,
        timestamp: "Saúde financeira",
        actionLabel: "Revisar Presets",
        actionRoute: "/services",
        isRead: readIds.has(id),
      });
    }
  }

  // 5. Relacionamento & Recompra de Clientes VIP (Ticket Premium)
  const vipClients = clients.filter(
    (c) => c.status === "Ativo" && c.ticket === "Premium",
  );
  if (vipClients.length > 0) {
    const vipNames = vipClients.map((c) => c.name).join(", ");
    const id = `smart-vip-${vipClients.length}`;
    smartAlerts.push({
      id,
      category: "vip",
      title: `Carteira VIP (${vipClients.length} ${vipClients.length === 1 ? "Cliente Premium" : "Clientes Premium"})`,
      message: `Mantenha relacionamento próximo com ${vipNames}. Oferecer um combo complementar para clientes ativos tem alta taxa de conversão.`,
      timestamp: "Retenção & LTV",
      actionLabel: "Ver Carteira",
      actionRoute: "/clients",
      isRead: readIds.has(id),
    });
  }

  // Eventos recentes registrados
  const activityEvents = readScopedStorage<SoloistNotification[]>(
    STORAGE_KEYS.ACTIVITY_LOG,
    [],
  ).map((ev) => ({
    ...ev,
    isRead: readIds.has(ev.id),
  }));

  return [...smartAlerts, ...activityEvents];
}

export function clearActivityNotifications(): void {
  writeScopedStorage(STORAGE_KEYS.ACTIVITY_LOG, []);
}

export function resetAllCrmData(): void {
  saveStoredServices([]);
  saveStoredCombos([]);
  saveStoredClients([]);
  saveStoredProjects([]);
  saveStoredEmailTemplates([]);
  saveStoredEmailHistory([]);
  writeScopedStorage(STORAGE_KEYS.ACTIVITY_LOG, []);
  writeScopedStorage(STORAGE_KEYS.READ_NOTIFICATIONS, []);

  // Remove também as configurações/perfil salvos desta conta neste navegador
  const settingsKey = getScopedStorageKey(STORAGE_KEYS.SETTINGS);
  if (settingsKey) {
    try {
      localStorage.removeItem(settingsKey);
      localStorage.removeItem(
        `soloist_reference_hourly_cost_${activeSessionUser?.uid}`,
      );
    } catch {
      // Ignore storage errors
    }
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("soloist-settings-updated"));
    window.dispatchEvent(new Event("soloist-auth-changed"));
  }
}
